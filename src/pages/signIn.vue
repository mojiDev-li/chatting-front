<route lang="json">
{
  "meta": {
    "hasTokenBack": true
  }
}
</route>
<template>
  <SignInForm />
</template>

<script lang="ts" setup>
import SignInForm from "@/components/user/SignInForm.vue"
import { onMounted, onUnmounted, Ref, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
</script>
