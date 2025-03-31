import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { SocketContext } from "./socketConfig/socketContext.tsx";
import { socket } from "./socketConfig/socket.ts";
import "antd/dist/reset.css"; // Import Ant Design styles


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketContext.Provider value={{socket }}>
      <App />
    </SocketContext.Provider>
  </BrowserRouter>
);
