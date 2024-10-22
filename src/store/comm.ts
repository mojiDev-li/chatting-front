import { defineStore } from "pinia"
import { computed, Ref, ref } from "vue"

export const useAppStore = defineStore("app", () => {
  const isLoading: Ref<boolean> = ref(false)
  const isMember: Ref<boolean> = ref(false)

  const getIsLoading = () => computed(() => isLoading.value)
  const getIsMember = () => computed(() => isMember.value)

  const setIsLoading = (value: boolean) => {
    isLoading.value = value
  }
  const setIsMember = (value: boolean) => {
    isMember.value = value
  }

  return {
    getIsLoading,
    getIsMember,
    setIsLoading,
    setIsMember
  }
})
