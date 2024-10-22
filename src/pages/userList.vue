<route lang="json">
{
  "meta": {
    "requiresAuth": true
  }
}
</route>

<template>
  <UserList @click:room="joinChatRoom" @create-room="selectUsers" />
  <UsersConfirmDialog ref="dialog" :data="selectedUsers" @confirmDialog="confirmDialog" />
</template>

<script lang="ts" setup>
import { getUserId, getUserName } from "@/axios/apiUtil"
import UserList from "@/components/user/UserList.vue"
import UsersConfirmDialog from "@/components/user/UsersConfirmDialog.vue"
import { useUserStore } from "@/store/user/user"
import { RequestCreateChat, User } from "@/types/user"
import { Ref, ref } from "vue"
import { useRouter } from "vue-router"

const emits = defineEmits(["click:room"])
const router = useRouter()
const store = useUserStore()

const selectedUsers: Ref<User[]> = ref([])

const dialog = ref()

const joinChatRoom = ({ userId, userName }: User) => {
  // 채팅룸으로 이동
  createChatRoom({ roomName: `${getUserName()}, ${userName}`, userId: [getUserId(), userId] })
  // router.push({ name: "/chatRoom", query: { roomId: roomId } })
}

const selectUsers = async (value: User[]) => {
  selectedUsers.value = value
  dialog.value.open()
}

const confirmDialog = async (roomName: string) => {
  const userId = selectedUsers.value.map(({ userId }) => userId)
  createChatRoom({ roomName, userId })
}

const createChatRoom = async (data: RequestCreateChat) => {
  try {
    const res = await store.requestCreateChatting(data)
    router.push({
      name: "/chatRoom",
      query: {
        roomId: res.roomId,
        roomName: data.roomName
      }
    })
  } catch {
    alert("다시 시도해주세요")
  }
}
</script>
