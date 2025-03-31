import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Input, Button } from "@nextui-org/react";
import { SendIcon } from "../assets/icons/SendIcon";

const socket = io("http://localhost:5173");

interface Message {
  name: string;
  message: string;
}

const TextInput = () => {
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
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

  const handleUsername = () => {
    const name = prompt("Enter your username");
    if (name) {
      setUsername(name);
      setIsUsernameSet(true);
      socket.emit("client-username", name);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      const msg: Message = { name: username, message: input };
      socket.emit("client-chat", msg);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-200 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-bold text-green-700 text-center mb-4">GeeksforGeeks ChatRoom</h1>
        {!isUsernameSet ? (
          <Button color="success" className="w-full" onPress={handleUsername}>
            Join Chatroom
          </Button>
        ) : (
          <>
            <Input
              value={username}
              isDisabled
              className="mb-2"
            />
            <div className="border p-4 rounded-lg h-60 overflow-y-auto bg-gray-100">
              {messages.map((msg, index) => (
                <p key={index} className={`p-1 ${msg.name === username ? 'text-blue-500' : 'text-green-700'} font-semibold`}>
                  {msg.name}: {msg.message}
                </p>
              ))}
            </div>
            <div className="mt-2 flex">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button isIconOnly color="primary" onPress={sendMessage}>
                <SendIcon />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TextInput;
