import { getAccessToken } from "./apiUtil"
import axios from "./base-axios"
import { RequestDeleteChatting, RequestMessageList, ResponseChatRoom, ResponseMessageList } from "@/types/chat"

const chatService = axios()
const _chatService = axios({}, (config) => {
  config.headers["Authorization"] = `Bearer ${getAccessToken()}`
  return config
})
const chatListService = axios({ loading: false })

const requestChatRoomList = async (userId: string): Promise<BaseRes<ResponseChatRoom>> => {
  const { data } = await chatListService.get("/chat/roomList", { params: { userId: userId } })
  return data
}

const requestMessageList = async (body: RequestMessageList): Promise<BaseRes<ResponseMessageList>> => {
  const { data } = await chatService.post("/chat/messageList", body)
  return data
}

const requestDeleteChatting = async (body: RequestDeleteChatting) => {
  const { data } = await chatService.post("/chat/leave", body)
  return data
}

const requestImg = async (formData: FormData) => {
  const { data } = await _chatService.post("/chat/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
  return data
}

export { requestChatRoomList, requestMessageList, requestDeleteChatting, requestImg }
