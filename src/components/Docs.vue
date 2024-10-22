<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-tooltip text="Tooltip">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" @click="testFn">임시로그인</v-btn>
            </template>
          </v-tooltip>
        </v-col>
        <v-col cols="auto">
          <v-btn href="" min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="testFn3">
            <v-icon icon="mdi-view-dashboard" size="large" start />
            로컬스토리지비우기
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn href="" min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="testFn2">
            <v-icon icon="mdi-view-dashboard" size="large" start />

            signup
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn href="" min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="onClickRoomList">
            <v-icon icon="mdi-view-dashboard" size="large" start />
            ChatRoom
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn href="" min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="testFn4">
            <v-icon icon="mdi-view-dashboard" size="large" start />
            user(로그인/회원가입)
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn href="" min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="testConn">
            <v-icon icon="mdi-view-dashboard" size="large" start />
            소켓연결
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn href="" min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="getUserList">
            <v-icon icon="mdi-view-dashboard" size="large" start />
            유저목록 요청
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useDocsStore } from "@/store/docs"
import { useRoute, useRouter } from "vue-router"

import Stomp from "webstomp-client"
import SockJS from "sockjs-client"
import axios from "axios"

const router = useRouter()
const route = useRoute()

const store = useDocsStore()

const testFn = async () => {
  store.requestLoginFunction()
}
const testFn2 = () => {
  store.requestJoinFunction()
}
const testFn3 = () => {
  localStorage.clear()
}
const testFn4 = () => {
  router.push({
    name: "/signIn"
  })
}

const getUserList = () => {
  store.requestUserListFn()
}

const testConn = () => {
  const serverURL = "http://211.118.245.244:4123/ws"
  let socket = new SockJS(serverURL)
  const stompClient = Stomp.over(socket)
  let connected = false
  console.log(`소켓 연결을 시도합니다. 서버 주소: ${serverURL}`)
  stompClient.connect(
    {},
    (frame) => {
      // 소켓 연결 성공
      const connected = true
      console.log("소켓 연결 성공", frame)
      // 서버의 메시지 전송 endpoint를 구독합니다.
      // 이런형태를 pub sub 구조라고 합니다.
      stompClient.subscribe("/sub", (res) => {
        console.log("구독으로 받은 메시지 입니다.", res.body)

        // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
        // recvList.push(JSON.parse(res.body))
      })
    },
    (error) => {
      // 소켓 연결 실패
      console.log("소켓 연결 실패", error)
      connected = false
    }
  )
}

const onClickRoomList = () => {
  router.push({
    name: "/chatHome"
  })
}
</script>
