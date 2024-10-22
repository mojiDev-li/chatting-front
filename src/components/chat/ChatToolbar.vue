<template>
  <v-card color="grey-lighten-4" class="mx-auto">
    <v-toolbar color="#42b983" dark class="header">
      <v-btn slot="prepend" icon @click="onClickGoRoomList">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>{{ toolBarTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn> -->
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const props = defineProps(["roomName"])

const toolBarTitle = props.roomName

const onClickGoRoomList = () => {
  console.log("채팅방 목록으로 이동")
  router.push("/chatHome")
}
</script>
<style lang="scss" scoped>
.mx-auto {
  height: 64px;
  z-index: 900;
}
.header {
  position: fixed;
}
</style>
