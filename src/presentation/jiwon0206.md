## 채팅 프로젝트 (~ 2월 1주차)

## axios인스턴스생성

- param : option / request, response Interceptor / baseUrl / Timeout

```js
import { useAppStore } from "@/store/comm"
import Axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { clearTokenInfo, getAccessToken, setNewAccessToken } from "./apiUtil"

const defaultOption = {
  error: true,
  loading: true,
  useToken: true
}

export default (
  options: AxiosOption = defaultOption,
  requestInterceptor: ((value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>) | null = null,
  responseInterceptor: ((value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>) | null = null,
  baseURL = "http://localhost:8085",
  timeout = 5000
) => {
  const instance = Axios.create({
    baseURL,
    timeout
  })
  const _options = { ...defaultOption, ...options }
  const store = useAppStore()

  // 토큰 사용 요청 인터셉터
  const useTokenRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    if (_options.loading) {
      store.setIsLoading(true)
    }
    if (!_options.useToken) return config
    const accessToken = getAccessToken()

    if (!accessToken) {
      window.location.href = "/signin"
      return config
    }

    config.headers["Content-Type"] = "application/json"
    config.headers["Authorization"] = `Bearer ${accessToken}`

    return config
  }

  // 토큰 사용 응답 인터셉터
  const useTokenResponseInterceptor = (response: AxiosResponse) => {
    if (_options.loading) {
      store.setIsLoading(false)
    }
    if (!_options.useToken) return response

    const token = response.headers["authorization"]

    console.log("Api Response : " + token)
    if (token !== undefined && token !== null) {
      setNewAccessToken(token.split(" ")[1])
    }

    if (response.data.code === "C008") {
      clearTokenInfo()
      alert("토큰 만료! 로그인 페이지로 이동합니다 !")
      window.location.href = "/signin"
    }

    return response
  }

  instance.interceptors.request.use(requestInterceptor || useTokenRequestInterceptor, (error) => {
    store.setIsLoading(false)
  })
  instance.interceptors.response.use(responseInterceptor || useTokenResponseInterceptor, ({ response }) => {
    console.log("interceptor option > ", _options)

    if (_options.error) alert(response.data.message)
    store.setIsLoading(false)
    return Promise.reject(response.data)
  })

  return instance
}

```

```js
const tokenService = _tokenService()
const noneTokenService = _tokenService({ useToken: false })
const noneTokenService = _tokenService({
  useToken: false,
  loading: false
})
```

## 라우터

- beforeEach와 meta사용하여 로그인 체크

```js
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
```

```html
<!-- xxx.vue 인증이 필요한 페이지-->
<route lang="json"> { "meta": { "requiresAuth": true } } </route>
```

## 화면 캡쳐

- 로그인/회원가입
- 사용자목록/채팅방만들기(방이름입력X)
- 로딩스피너

![로그인](/public/img/jiwon/0206/login.png)
![회원가입](/public/img/jiwon/0206/join.png)
![사용자목록](/public/img/jiwon/0206/userlist.png)
![사용자선택](/public/img/jiwon/0206/checkbox.png)
![확인창](/public/img/jiwon/0206/confirm.png)
![로딩스피너](/public/img/jiwon/0206/loading.png)
