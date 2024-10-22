<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="70%">
      <v-card>
        <v-card-title class="text-h5"> 채팅방 명칭 지정</v-card-title>
        <v-text-field class="ma-5" v-model="roomName"></v-text-field>
        <v-list>
          <v-list-item v-for="(val, idx) in props.data" :key="idx" :title="`${val.userName}(${val.userId})`"></v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer>이대로 채팅을 생성할까요?</v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialog = false"> 취소 </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="onClickOk"> 확인 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, PropType, Ref, ref } from "vue"
import { User } from "@/types/user"

const emit = defineEmits(["confirmDialog"])

const props = defineProps({
  data: { type: Object as PropType<User[]>, required: true }
})

const dialog: Ref<boolean> = ref(false)

const roomName = ref("")

const onClickOk = () => {
  emit("confirmDialog", roomName.value)
}

const open = () => {
  nextTick(() => {
    roomName.value = props.data.map(({ userName }) => userName).join(", ")
  })
  dialog.value = true
}

const close = () => {
  dialog.value = false
}

defineExpose({ open, close })
</script>
