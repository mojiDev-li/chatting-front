import { defineStore } from "pinia"
import { requestChatRoomList, requestMessageList, requestImg } from "@/axios/chat-service-axios"
import { Ref, computed, ref } from "vue"
import { IChatRoom, IFile, IMessageList, RequestMessageList } from "@/types/chat"

export const useChatStore = defineStore("chatStore", () => {
  const chatRoomList: Ref<IChatRoom[]> = ref([])
  const messageList: Ref<IMessageList[]> = ref([])
  const res: Ref<IMessageList[]> = ref([])
  const nextYn: Ref<string> = ref("")
  const fileInfo: Ref<IFile> = ref({})

  const getChatRoomList = computed(() => chatRoomList.value)
  const getMessageList = computed(() => messageList.value)
  const getRes = computed(() => res.value)
  const getNextYn = computed(() => nextYn.value)
  const getFileInfo = computed(() => fileInfo.value)

  // 채팅방 목록 조회
  const requestChatRoom = async (userId: string) => {
    const { data } = await requestChatRoomList(userId)
    chatRoomList.value = data.roomList
  }

  // 채팅메세지 조회
  const requestMessage = async (body: RequestMessageList) => {
    const { data } = await requestMessageList(body)
    messageList.value = messageList.value.concat(data.msgList)
    res.value = data.msgList
    nextYn.value = data.nextYn
    //console.log("messageList.value", messageList.value)

    // const requestBody = {
    //   // chatId: 이전 목록 리스트에서 마지막 chatId
    //   roomId: data.msgList[data.msgList.length - 1].roomId,
    //   chatId: data.msgList[data.msgList.length - 1].chatId,
    //   cnt: 15
    // }
    // if (data.nextYn == "Y") {
    //   await requestMessage(requestBody)
    // }
  }

  // 이미지 정송
  const requestImage = async (formData: FormData) => {
    const res = await requestImg(formData)
    console.log(res.data)
    fileInfo.value = res.data

    return res
  }

  // 초기화
  const initMessage = () => {
    messageList.value = []
  }

  return {
    requestChatRoom,
    requestMessage,
    requestImage,
    getChatRoomList,
    getMessageList,
    getRes,
    getNextYn,
    getFileInfo,
    initMessage
  }
})
