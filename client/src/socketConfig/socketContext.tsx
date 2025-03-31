import { createContext } from "react";
import { Socket } from "socket.io-client";

// Define the shape of the context value
interface SocketContextValue {
  socket: Socket;
}

// Create context with proper typing and null as default value
export const SocketContext = createContext<SocketContextValue | null>(null);
