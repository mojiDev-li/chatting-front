import { defineStore } from "pinia"
import { ref } from "vue"
import { requestTestApi, requestLogin, requestUserList } from "@/axios/docs-service-axios"

export const useDocsStore = defineStore("docs", () => {
  const testRef: any = ref({})

  const requestLoginFunction = async () => {
    const res = await requestLogin()
    localStorage.setItem("accessToken", res.data.data.accessToken)
  }

  const requestJoinFunction = async () => {
    const res = await requestTestApi()
    setTestRef(res)
  }

  const requestUserListFn = async () => {
    const res = await requestUserList()
  }

  const setTestRef = (value: any) => {
    testRef.value = value
  }

  return {
    requestLoginFunction,
    requestJoinFunction,
    requestUserListFn
  }
})
