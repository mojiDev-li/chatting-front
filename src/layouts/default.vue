<template>
  <v-app>
    <DefaultBar />
    <DefaultView />
    <BottomNav />
    <LoadingBar v-if="store.getIsLoading().value" />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./default/AppBar.vue"
import DefaultView from "./default/View.vue"
import BottomNav from "./default/BottomNav.vue"
import LoadingBar from "@/components/app/LoadingBar.vue"

import { useAppStore } from "@/store/comm"
const store = useAppStore()
</script>
