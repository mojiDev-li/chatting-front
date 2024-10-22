<template>
  <v-card color="grey-lighten-4" class="mx-auto" max-width="800">
    <v-toolbar color="#42b983" dark>
      <v-toolbar-title>사용자 목록</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn variant="outlined" @click="createGroupChatRoom" v-if="!creatingChat"> 채팅방생성 </v-btn>
      <v-btn class="mr-3" variant="outlined" @click="createGroupChatRoom" v-else> 취소 </v-btn>
      <v-btn variant="outlined" @click="confirmCreateChat" v-if="creatingChat"> 완료 </v-btn>
    </v-toolbar>

    <v-list lines="two">
      <template v-for="(item, index) in items" :key="item.userId">
        <v-list-item>
          <template v-slot:prepend="{ isActive }" v-if="creatingChat">
            <v-list-item-action start>
              <v-checkbox-btn @update:model-value="checkedItem(item)" :model-value="item.isChecked"></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <template v-slot:title>
            <div v-if="loginUsers.includes(item.userId)" style="color: #5d80f5">{{ item.userName }}({{ item.userId }} _ ON)</div>
            <div v-else>{{ item.userName }}({{ item.userId }} _ OFF)</div>
          </template>
          <template v-slot:append>
            <v-btn color="grey-lighten-1" variant="outlined" @click="createChatRoom(item)" v-if="!creatingChat">1:1대화하기</v-btn>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { getUserId, getAccessToken } from "@/axios/apiUtil"
import { useUserStore } from "@/store/user/user"
import { User } from "@/types/user"
import { onMounted, Ref, ref } from "vue"
import { useRouter } from "vue-router"
import { useLoginStateStore } from "@/store/loginState/loginState"
import SockJS from "sockjs-client"
import Stomp, { Client } from "webstomp-client"

interface UserItem extends User {
  isChecked: boolean
}

const emit = defineEmits(["click:room", "createRoom"])
const router = useRouter()
const store = useUserStore()
const loginStateStore = useLoginStateStore()
let stompClient: Client | null = null
const loginSocket: Ref<WebSocket | null> = ref(null)

const items: Ref<UserItem[]> = ref([])

const creatingChat: Ref<boolean> = ref(false)
const loginUsers: Ref<string[]> = ref([])

// 채팅방으로 이동
const createChatRoom = (item: User) => {
  console.log(item.userId)
  emit("click:room", item)
}

// 채팅방 생성
const createGroupChatRoom = () => {
  items.value.forEach((item) => {
    item.isChecked = false
  })
  creatingChat.value = !creatingChat.value
}

const checkedItem = (user: UserItem) => {
  user.isChecked = !user.isChecked
}

const confirmCreateChat = async () => {
  const selectedUsers = [...items.value.filter(({ isChecked }) => isChecked)]
  const myInfoObj = store.getUsers().value.find(({ userId }) => userId === getUserId())
  if (!selectedUsers.length) {
    alert("사용자를 1명 이상 선택해주세요.")
    return
  }

  emit("createRoom", [myInfoObj, ...selectedUsers])
}

const initApi = async () => {
  await store.requestUserList()
}

const connectSocket = async () => {
  const accessToken = getAccessToken()
  const headers: any = { Authorization: accessToken }
  const serverURL = "http://211.118.245.244:4123/ws"
  //let socket = new SockJS(serverURL)
  loginSocket.value = new SockJS(serverURL)
  //stompClient = Stomp.over(socket)
  stompClient = Stomp.over(loginSocket.value)

  if (loginSocket.value.readyState !== WebSocket.OPEN) {
    new Promise((resolve, reject) => {
      stompClient?.connect(
        headers,
        (frame) => {
          console.log("소켓 연결 성공", frame)
          // 서버의 메시지 전송 endpoint를 구독합니다.
          stompClient?.subscribe(
            "/sub/login",
            (res) => {
              console.log("구독으로 받은 메시지 입니다.", JSON.parse(res.body).data)
              const resMessage = JSON.parse(res.body).data
              loginUsers.value = JSON.parse(res.body).data
              resolve(resMessage)
            },
            headers
          )
          sendLoginUser()
        },
        async (error: any) => {
          if (error.body !== undefined) {
            console.log("소켓 연결 실패", JSON.parse(error.body))
            const resErr = JSON.parse(error.body)
            console.log("resErr", resErr)
          }
        }
      )
    }).then(async (userId: any) => {
      console.log("구독으로 받은 후 실행되는 함수 : " + userId)
      // 로그인 유저들 관리하는 storage에 데이터 set
    })
  }
}

// login 구독에 login한 유저의 리스트를 message로 뿌림
const sendLoginUser = async () => {
  console.log("로그인시 아이디 전송 ")
  const body = {
    userId: getUserId()
  }
  stompClient?.send("/pub/login", JSON.stringify(body))
}

onMounted(async () => {
  await initApi()
  await connectSocket()
  await loginStateStore.setLoginSocket(loginSocket.value)

  //자신 제외 후 체크 옵션 추가
  items.value = store
    .getUsers()
    .value.filter(({ userId }) => userId !== getUserId())
    .map((item: User) => ({ ...item, ...{ isChecked: false } }))
})
</script>
