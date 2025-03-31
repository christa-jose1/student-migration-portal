import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5173"); // Update with your server URL

interface Message {
  name: string;
  message: string;
}

const ChatInterface = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    socket.on("client-chat", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("client-chat");
    };
  }, []);

  const handleSetUsername = () => {
    const name = prompt("Enter your username");
    if (name) {
      setUsername(name);
      setIsUsernameSet(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msg: Message = { name: username, message };
    socket.emit("client-chat", msg);
    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-green-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">Two-User Chat</h1>
      {!isUsernameSet ? (
        <button
          onClick={handleSetUsername}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Set Username
        </button>
      ) : (
        <div>
          <div className="p-4 border rounded-lg shadow-md bg-white h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 border-b ${msg.name === username ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}
              >
                <p>
                  <strong className="text-green-700">{msg.name}:</strong> {msg.message}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="ml-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;