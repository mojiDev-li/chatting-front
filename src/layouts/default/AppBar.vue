<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi mdi-chat" />
      Chatting
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn v-if="store.getIsMember().value" variant="outlined" @click="logout">로그아웃</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { getUserId } from "@/axios/apiUtil"
import { clearTokenInfo } from "@/axios/apiUtil"
import { useAppStore } from "@/store/comm"
import { useSignStore } from "@/store/sign/sign"
import { useRouter } from "vue-router"
import { useLoginStateStore } from "@/store/loginState/loginState"
import Stomp, { Client } from "webstomp-client"
import { onMounted, ref, Ref } from "vue"

const loginStateStore = useLoginStateStore()

const store = useAppStore()
const signStore = useSignStore()
const router = useRouter()
let stompClient: Client | null = null
let logoutTime: Ref<number> = ref(300)

const logout = async () => {
  // 로그인 소켓 종료
  let loginSocket = await loginStateStore.getLoginSocket()
  console.log("loginSocket : " + loginSocket)
  stompClient = Stomp.over(loginSocket)
  stompClient?.send("/pub/login", JSON.stringify({ userId: getUserId(), type: "LOGOUT" }))
  stompClient?.disconnect()

  await signStore.requestLogout()
  clearTokenInfo()

  router.push({
    name: "/signIn"
  })
}

const handleVisibilityChange = async () => {
  let loginSocket = await loginStateStore.getLoginSocket()
  stompClient = Stomp.over(loginSocket)
  if (document.visibilityState === "hidden") {
    logoutTime.value = 5
    let logoutTimer = setInterval(() => {
      logoutTime.value -= 1
      if (logoutTime.value === 0) {
        stompClient?.send("/pub/login", JSON.stringify({ userId: getUserId(), type: "LOGOUT" }))
        clearInterval(logoutTimer)
      }
    }, 1000)
  } else {
    const body = {
      userId: getUserId()
    }
    stompClient?.send("/pub/login", JSON.stringify(body))
  }
}

onMounted(() => {
  if (store.getIsMember().value !== null) {
    document.addEventListener("visibilitychange", handleVisibilityChange, false)
  }
})
</script>
