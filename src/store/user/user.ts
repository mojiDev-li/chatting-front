import { defineStore } from "pinia"
import { RequestCreateChat, ResponseUserList, User } from "@/types/user"
import { createChatting, getUserList } from "@/axios/user-service-axios"
import { computed, ref, Ref } from "vue"

export const useUserStore = defineStore("userStore", () => {
  const users: Ref<User[]> = ref([])

  const requestUserList = async () => {
    const { data } = await getUserList()

    users.value = data.list
  }

  const requestCreateChatting = async (body: RequestCreateChat) => {
    const { data } = await createChatting(body)
    return data
  }

  const getUsers = () => computed(() => users.value)

  //   const requestLogin = async (value: RequestSignIn) => {
  return {
    requestUserList,
    requestCreateChatting,
    getUsers
  }
})
