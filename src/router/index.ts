/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto"
// @ts-ignore
import { setupLayouts } from "virtual:generated-layouts"
import { getAccessToken } from "@/axios/apiUtil"
import { nextTick } from "process"
import { useAppStore } from "@/store/comm"

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: setupLayouts
})

router.beforeEach((to, from, next) => {
  const token = getAccessToken()
  const store = useAppStore()
  console.log("token : ", token)

  store.setIsMember(token ? true : false)
  if (to.matched.some((record) => record.meta.hasTokenBack)) {
    if (token) {
      next("/userList")
      return
    }
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      alert("로그인이 필요한 서비스입니다.")
      next("/signin")
      return
    }
    // 로그아웃된 상태로 변경
    // 로그인 화면으로 이동
  }
  next()
})

export default router
