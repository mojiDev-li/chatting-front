export interface RequestSignUp {
  userId: string
  userPw: string
  name: string
}

export interface ResponseSignUp {}

export interface RequestSignIn {
  userId: string
  userPw: string
}
// BaseRes<ResponseSignIn>
export interface ResponseSignIn {
  id: string
  accessToken: string
  refreshToken: string
  name: string
}
