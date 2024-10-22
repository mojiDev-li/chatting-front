## 채팅 프로젝트 (~ 2월 1주차)

## 채팅방 목록

로그인한 사용자가 참여하는 채팅방 목록

id3 채팅방 목록
![소켓연결](/public/img/채팅목록id3지원.PNG)
<br>
id4 채팅방 목록
![소켓연결](/public/img/채팅목록id4혜정.PNG)

## 채팅방

### 1. 소켓 연결

사용자가 채팅방을 클릭했을 경우

```javascript
import SockJS from "sockjs-client"
import Stomp from "webstomp-client"

const serverURL = "http://localhost:8085/ws"
let socket = new SockJS(serverURL) // 소켓생성
const stompClient = Stomp.over(socket) // stomp 프로토콜 위에 sockJs가 돌아가도록해줌
console.log(`소켓 연결을 시도합니다. 서버 주소: ${serverURL}`)

export { stompClient }
```

```javascript
const accessToken = getAccessToken()
const headers: any = { Authorization:accessToken }
stompClient.connect(
    headers,
    (frame) => { // fram은 연결정보
        console.log("소켓 연결 성공", frame)
    },
    (error) => {
        console.log("소켓 연결 실패", error)
    }
)
```

![소켓연결](/public/img/소켓연결성공.PNG)

### 2. 토픽 구독

상대방에게 메세지를 보내거나 받아야 할 경우 구독을 해야한다.
<br>
구독할 토픽의 url : /sub/room/{roomId}

```javascript
stompClient.subscribe(
  "/sub/room/" + roomId.value,
  (res) => {
    // 새로운 메시지 도착 시 실행되는 콜백 함수
    console.log("구독으로 받은 메시지 입니다.", JSON.parse(res.body).data)
  },
  headers
)
```

![토픽구독](/public/img/구독.PNG)

### 2. 메세지 전송

메세지를 전송하면 "/sub/room/{roomId}" 를 구독하는 사용자에게 message를 뿌린다.

```javascript
const body = {
  roomId: roomId.value,
  userId: userId,
  message: msg,
  messageType: "TALK"
}
stompClient.send("/pub/chat/" + roomId.value, JSON.stringify(body))
```

![채팅방](/public/img/채팅방.PNG)<br>

id3 -> id4 메세지 전송
![메세지전송](/public/img/메세지전송.PNG)<br>
id4 메세지 받음 <br>
![메세지받기](/public/img/메세지받기.PNG)
