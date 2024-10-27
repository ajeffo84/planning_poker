import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PROD 
  ? 'https://your-production-server.com'  // Replace with your production server URL
  : 'http://localhost:3001';

export const socket = io(SOCKET_URL);