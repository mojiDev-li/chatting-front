declare interface BaseRes<T> {
  code: string
  message: string
  data: T
}

declare interface AxiosOption {
  error?: boolean //error alert 여부
  loading?: boolean
  useToken?: boolean
}
