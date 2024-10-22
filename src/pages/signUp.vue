<route lang="json">
{
  "meta": {
    "hasTokenBack": true
  }
}
</route>

<template>
  <SignUpForm />
</template>

<script lang="ts" setup>
import SignUpForm from "@/components/user/SignUpForm.vue"
import { onMounted, onUnmounted, Ref, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
</script>
