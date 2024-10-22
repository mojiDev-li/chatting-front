<template>
  <v-bottom-navigation v-if="visible" style="position: fixed; bottom: 0">
    <v-btn v-for="(item, idx) in btnList" :key="idx" @click="moveTo(item.path)">
      <v-icon>{{ item.icon }}</v-icon>

      <span>{{ item.name }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUpdated, ref, Ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
const route = useRoute()

const btnList = [
  {
    icon: "mdi-account-multiple",
    name: "UserList",
    path: "/userList"
  },
  {
    icon: "mdi-forum",
    name: "Chatting",
    path: "/chatHome"
  }
]

const visible: Ref<boolean> = computed(() => {
  return btnList.some(({ path }) => route.path === path)
})

const moveTo = (to: any) => {
  router.replace(to)
}
</script>
