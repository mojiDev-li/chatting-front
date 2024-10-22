<route lang="json">
{
  "meta": {
    "requiresAuth": true
  }
}
</route>

<template>
  <ChatRoomList @click:room="joinChatRoom" />
</template>

<script lang="ts" setup>
import ChatRoomList from "@/components/chat/ChatRoomList.vue"
import { useRouter } from "vue-router"
import { useChatStore } from "@/store/chat/chat"
import { computed, onMounted, Ref, ref } from "vue"
import { storeToRefs } from "pinia"

const emits = defineEmits(["click:room"])

const router = useRouter()

const joinChatRoom = (roomId: number, roomName: string) => {
  // 채팅룸으로 이동
  console.log("채팅방 id : ", roomId, roomName)
  router.push({ name: "/chatRoom", query: { roomId: roomId, roomName: roomName } })
}
</script>
