export interface User {
  userId: string
  userName: string
}

export interface ResponseUserList {
  list: User[]
}

export interface RequestCreateChat {
  roomName: string
  userId: string[]
}

export interface ResponseCreateChat {
  roomId: string
  existRoom: boolean
  roomList: []
}
