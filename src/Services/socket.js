import { io } from "socket.io-client";

const WAITROOM_URL = "http://localhost:8081/waitroom";
const CHATROOM_URL = "http://localhost:8081/chatroom";

export const waitroomSocket = io(WAITROOM_URL, {
  transports: ["websocket"],
  upgrade: false,
});

export const chatroomSocket = io(CHATROOM_URL, {
  transports: ["websocket"],
  upgrade: false,
});
