import { defineStore } from "pinia"
import { requestSignIn, requestSignOut, requestSignUp } from "@/axios/sign-service-axios"
import { RequestSignIn, RequestSignUp } from "@/types/sign"
import { Ref, ref } from "vue"

export const useLoginStateStore = defineStore("loginStateStore", () => {
  const webSocket: Ref<WebSocket | null> = ref(null)

  const setLoginUsers = async (loginUsers: Array<string>) => {
    localStorage.setItem("loginUsers", JSON.stringify(loginUsers))
  }

  const getLoginUsers = async (): Promise<Array<string>> => {
    if (localStorage.getItem("loginUsers") == null) return []
    else return JSON.parse(localStorage.getItem("loginUsers")!)
  }

  const getUserId = async () => {
    return localStorage.getItem("userId") || ""
  }

  const removeLoginUsers = async () => {
    localStorage.removeItem("loginUsers")
  }

  const setLoginSocket = async (socket: any) => {
    webSocket.value = socket
  }

  const getLoginSocket = async () => {
    return webSocket.value
  }

  return {
    setLoginUsers,
    getLoginUsers,
    getUserId,
    removeLoginUsers,
    setLoginSocket,
    getLoginSocket
  }
})
