import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PROD
  ? import.meta.env.VITE_SERVER_URL
  : import.meta.env.VITE_SERVER_URL //'http://localhost:3001';

export const socket = io(SOCKET_URL);