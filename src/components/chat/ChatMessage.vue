<template>
  <v-layout class="chat-messages" row wrap>
    <v-flex v-for="(item, index) in messages.slice().reverse()" :key="index" xs12>
      <v-card v-if="item.messageType === 'EXIT'" class="chat-system-message" color="grey-lighten-2" flat>
        <v-card-text class="text-grey-darken-1"> {{ item.userId }} 님이 퇴장했습니다. </v-card-text>
      </v-card>

      <!-- <v-card v-else-if="item.messageType === 'ENTER'" class="chat-system-message" color="grey-lighten-2" flat>
        <v-card-text class="text-grey-darken-1"> {{ item.userId }} 님이 입장했습니다. </v-card-text>
      </v-card> -->

      <v-card
        v-else-if="item.messageType == 'TALK' || item.messageType === 'FILE'"
        class="chat-message-box"
        :class="item.userId == userId ? 'chat-right' : 'chat-left'"
        flat
      >
        <v-card-title class="chat-username" style="font-size: 1em">
          <div class="text-grey-darken-1">{{ item.userId != userId ? item.userId : "" }}</div>
        </v-card-title>
        <v-img
          v-if="item.messageType === 'FILE'"
          :src="`http://211.118.245.244:4123/${item.fileUrl}`"
          class="chat-image"
          max-width="400"
          height="200px"
          contain
          @click="clickImg(item.fileUrl)"
        ></v-img>

        <v-card-text class="chat-message" v-if="item.messageType == 'TALK'">
          {{ item.message.replace(/\</g, "&lt;") }}
        </v-card-text>
        <div :class="item.userId == userId ? 'msg-info-right' : 'msg-info-left'">
          <p v-if="item.readCnt != 0">{{ item.readCnt }}</p>
          <p>{{ item.sendTime }}</p>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { getUserId } from "@/axios/apiUtil"

const props = defineProps(["messages"])
const userId = ref(getUserId())
const messages = computed(() => {
  return props.messages
})

const clickImg = (fileUrl: any) => {
  console.log("이미지클릭")
  window.open("http://211.118.245.244:4123/" + fileUrl)
}
</script>

<style lang="scss" scoped>
.chat-messages {
  flex-direction: column;
  .chat-username {
    padding-bottom: 0;
  }
  .chat-message {
    padding-top: 0;
    word-wrap: break-word;
  }
  .chat-image {
    margin: 0 16px;
  }
  .chat-message-box {
    border-color: #e0e0e0 !important;
    border-radius: 1rem;
    min-width: 40%;
    max-width: 60%;
    margin: 5px;
  }
  .chat-right {
    background-color: #81d4fa !important;
    float: right;
  }
  .chat-left {
    background-color: #c5e1a5 !important;
    float: left;
  }
  .read-cnt-right {
    display: inline;
    position: absolute;
    bottom: 0;
    left: -13px;
  }
  .read-cnt-left {
    display: inline;
    position: absolute;
    bottom: 0;
    right: -13px;
  }
  .v-card {
    overflow: visible;
  }
  .msg-info-left {
    display: inline;
    position: absolute;
    bottom: -10px;
    left: 101%;
    text-align: left;
    font-size: 12px;
  }
  .msg-info-right {
    display: inline;
    position: absolute;
    bottom: -10px;
    right: 101%;
    text-align: right;
    font-size: 12px;
  }
}
</style>
