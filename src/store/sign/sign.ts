import { defineStore } from "pinia"
import { requestSignIn, requestSignOut, requestSignUp } from "@/axios/sign-service-axios"
import { RequestSignIn, RequestSignUp } from "@/types/sign"

export const useSignStore = defineStore("signStore", () => {
  const requestLogin = async (value: RequestSignIn) => {
    const { data } = await requestSignIn(value)

    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("name", data.name)
    localStorage.setItem("userId", data.id)
  }

  const requestJoin = async (body: RequestSignUp) => {
    const { data } = await requestSignUp(body)
  }

  const requestLogout = async () => {
    const { data } = await requestSignOut()
  }

  return {
    requestLogin,
    requestJoin,
    requestLogout
  }
})
