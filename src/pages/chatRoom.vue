<route lang="json">
{
  "meta": {
    "requiresAuth": true
  }
}
</route>
<template>
  <div class="chat-room-page">
    <ChatToolbar :roomName="roomName"> </ChatToolbar>
    <div v-auto-scroll-bottom="messages" class="chat-messages-container" ref="scrollRef" @scroll="scrolling">
      <ChatMessage :messages="messages" />
    </div>

    <div class="chat-message-input">
      <ChatInput @send:message="sendMessage" @send:img="sendImg" :roomId="roomId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChatToolbar from "@/components/chat/ChatToolbar.vue"
import ChatMessage from "@/components/chat/ChatMessage.vue"
import ChatInput from "@/components/chat/ChatInput.vue"
import { computed, onMounted, onUnmounted, onUpdated, Ref, ref, nextTick } from "vue"
import { useRoute } from "vue-router"
//import SockJS from "sockjs-client"
//import { stompClient } from "@/socket/socket-service"
import { getAccessToken, getUserId } from "@/axios/apiUtil"
import { useChatStore } from "@/store/chat/chat"
import { storeToRefs } from "pinia"
import SockJS from "sockjs-client"
import Stomp, { Client } from "webstomp-client"
import { IFile, IMessage } from "@/types/chat"
import dayjs from "dayjs"

const route = useRoute()
const store = useChatStore()
const { getMessageList, getRes, getNextYn } = storeToRefs(store)
const emits = defineEmits(["send:message", "send:img"])

const scrollRef = ref()
const roomId = ref() // 채팅방 번호
const roomName = ref(route.query.roomName) // 채팅방 이름
let stompClient: Client | null = null
const message: Ref<IMessage[]> = ref([]) // 보낸 채팅
//const messages = computed(() => [...message.value])
const previousScrollHeight = ref()

const messages = computed(() =>
  [...message.value].map((item) => {
    const sendTime = dayjs(item.createAt).format("HH:mm")
    return { ...item, ...{ sendTime } }
  })
)

const initailize = async () => {
  console.log("query >>> ", route.query.roomId)
  roomId.value = route.query.roomId

  const accessToken = getAccessToken()
  const headers: any = { Authorization: accessToken }
  const serverURL = "http://211.118.245.244:4123/ws"
  let socket = new SockJS(serverURL)
  stompClient = Stomp.over(socket)

  new Promise((resolve, reject) => {
    stompClient?.connect(
      headers,
      (frame) => {
        console.log("소켓 연결 성공", frame)
        // 서버의 메시지 전송 endpoint를 구독합니다.
        stompClient?.subscribe(
          "/sub/room/" + roomId.value,
          (res) => {
            // 새로운 메시지 도착 시 실행되는 콜백 함수
            console.log("구독으로 받은 메시지 입니다.", JSON.parse(res.body).data)

            const resMessage = JSON.parse(res.body).data
            getMessageList.value.unshift(resMessage)
            message.value.unshift(resMessage)
            console.log("messages >> ", message.value)

            let chatMessages = scrollRef.value
            // 스크롤 최하단으로 이동
            setTimeout(() => chatMessages.scrollTo({ top: chatMessages.scrollHeight }), 200)

            // 상대방 입장했을때 readCnt -1
            if ((resMessage.messageType == "ENTER" || resMessage.messageType == "EXIT") && resMessage.userId != getUserId()) {
              message.value.forEach((el) => {
                if (!el.users?.includes(resMessage.userId)) {
                  el.users?.push(resMessage.userId)
                  el.readCnt = el.readCnt - 1
                }
              })
            }
            resolve(message)
          },
          headers
        )
        // 입장메세지
        enterMessage()
      },
      async (error: any) => {
        if (error.body !== undefined) {
          console.log("소켓 연결 실패", JSON.parse(error.body))
          const resErr = JSON.parse(error.body)
          console.log("resErr", resErr)
          if (resErr?.code === "C008") {
            store.initMessage()
            await requestMessageList() // access 토큰 만료되면  API조회 (accessToken 재발급)
            message.value = getMessageList.value

            // TODO message.value 초기화
            message.value = []
            await initailize()
          }
        }
      }
    )
  }).then(async () => {
    store.initMessage()
    await requestMessageList()
    message.value = [...message.value, ...getMessageList.value]

    nextTick(() => {
      let chatMessages = scrollRef.value
      // 스크롤 최하단으로 이동
      chatMessages.scrollTo({ top: chatMessages.scrollHeight })
    })
  })
}

// 메세지 조회
const requestMessageList = async () => {
  const body = {
    roomId: roomId.value,
    chatId: 0,
    cnt: 10
  }
  await store.requestMessage(body)
}

// 입장 메세지
const enterMessage = () => {
  const body = {
    roomId: roomId.value,
    userId: getUserId(),
    message: "",
    messageType: "ENTER"
  }
  stompClient?.send("/pub/chat/" + roomId.value, JSON.stringify(body))
}

// 메세지 전송
const sendMessage = (msg: String) => {
  const userId = getUserId()
  const body = {
    roomId: roomId.value,
    userId: userId,
    message: msg,
    messageType: typeof msg == "string" ? "TALK" : "FILE"
  }
  stompClient?.send("/pub/chat/" + roomId.value, JSON.stringify(body))
  msg = ""
}

// 이미지 전송
const sendImg = (file: IFile) => {
  const userId = getUserId()
  const body = {
    roomId: roomId.value,
    userId: userId,
    fileName: file.fileName,
    fileExt: file.fileExt,
    fileUrl: file.fileUrl,
    message: "",
    messageType: "FILE"
  }
  stompClient?.send("/pub/chat/" + roomId.value, JSON.stringify(body))
}

const scrolling = async (event: any) => {
  const scrollHeight = event.target.scrollHeight
  const scrollTop = event.target.scrollTop
  const clientHeight = event.target.clientHeight

  // console.log("aaascrollHeight ", scrollHeight)
  // console.log("aaascrollTop ", scrollTop)
  // console.log("aaaclientHeight ", clientHeight)

  if (scrollTop === 0) {
    let chatMessages = scrollRef.value
    previousScrollHeight.value = chatMessages.scrollHeight
    console.log("최상단이동했을때, 두번째 조회 전", previousScrollHeight.value)

    // 최상단으로 이동했을때 nextYn이 Y면 메세지 조회
    if (getNextYn.value == "Y") {
      const requestBody = {
        // chatId: 이전 목록 리스트에서 마지막 chatId
        roomId: getRes.value[getRes.value.length - 1].roomId,
        chatId: getRes.value[getRes.value.length - 1].chatId,
        cnt: 10
      }
      await store.requestMessage(requestBody)
      //message.value = [...message.value, ...getMessageList.value]
      message.value = getMessageList.value

      nextTick(() => {
        let chatMessages = scrollRef.value
        const nowScrollTo = chatMessages.scrollHeight - previousScrollHeight.value
        console.log("ttscrollHeight", chatMessages.scrollHeight)
        console.log("ttpreviousScrollHeight", previousScrollHeight.value)
        chatMessages.scrollTo({ top: nowScrollTo })
      })
    }
  }
}

onMounted(() => {
  //test.value.addEventListener("scroll", doScroll)
  initailize()
})

onUnmounted(() => {
  console.log("소켓 연결 해제")
  stompClient?.disconnect()
})

onUpdated(() => {
  // const div = test.value as HTMLDivElement
  // div.scrollTop = div.scrollHeight
  console.log("onUpdated")
})
</script>

<style lang="scss" scoped>
.chat-room-page {
  .chat-messages-container {
    margin-top: 70px;
    background: #eeeeee;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 75px;
    overflow-x: scroll;
  }
  .chat-message-input {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    margin: 10px 0;
    margin-right: 15px;

    .chat-text-input {
      height: 45px;
    }
  }
}
</style>
