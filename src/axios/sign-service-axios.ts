import _signService from "./base-axios"
import { RequestSignIn, RequestSignUp, ResponseSignIn, ResponseSignUp } from "@/types/sign"
import { D } from "unplugin-vue-router/dist/options-8dbadba3"
//토큰 필요없는 axios instance 사용
const signService = _signService({ useToken: false })

const requestSignUp = async (body: RequestSignUp): Promise<BaseRes<ResponseSignUp>> => {
  const { data } = await signService.post("/user/auth/signup", body)
  return data
}

const requestSignIn = async (body: RequestSignIn): Promise<BaseRes<ResponseSignIn>> => {
  const { data } = await signService.post("/user/auth/signin", body) //로그인
  return data
}

const signOutService = _signService()

const requestSignOut = async (): Promise<BaseRes<{}>> => {
  const { data } = await signOutService.post("/user/auth/signout")
  return data
}

export { requestSignIn, requestSignUp, requestSignOut }
