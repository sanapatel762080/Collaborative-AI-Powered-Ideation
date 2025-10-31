import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatRoom.css";

// Initialize socket but don't connect yet
const socket = io("http://localhost:5000", { autoConnect: false });

export default function ChatRoom({ user }) {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Connect socket
  useEffect(() => {
    if (!projectId || !user) return;
    socket.connect();
    socket.emit("join", { projectId, user });

    // Receive previous messages from DB
    socket.on("previousMessages", (msgs) => {
      const realMsgs = msgs.filter((msg) => msg.text && msg.sender); // filter out placeholders
      setMessages(realMsgs);
    });

    // Receive new chat messages
    socket.on("newMessage", (msg) =>
      setMessages((prev) => {
        if (!prev.some((m) => m._id === msg._id)) return [...prev, msg];
        return prev;
      })
    );

    // System messages
    socket.on("system", (msg) => {
      setMessages((prev) => {
        if (!prev.some((m) => m.text === msg && m.sender === "System"))
          return [...prev, { sender: "System", text: msg, _id: `sys-${Date.now()}` }];
        return prev;
      });
    });

    // Typing indicator
    socket.on("typing", (typingUser) => {
      if (typingUser !== user) {
        setTypingUsers((prev) => [...new Set([...prev, typingUser])]);
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== typingUser));
        }, 1500);
      }
    });

    // Update reactions
    socket.on("reactionUpdated", (msg) =>
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)))
    );

    // Update seen status
    socket.on("seenUpdated", (msg) =>
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)))
    );

    return () => socket.disconnect();
  }, [projectId, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit("sendMessage", { projectId, sender: user, text });
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { projectId, user });
  };

  const addReaction = (msgId, emoji) =>
    socket.emit("addReaction", { messageId: msgId, emoji, user });

  const markSeen = (msgId) => socket.emit("markSeen", { messageId: msgId, user });

  return (
    <div className="chat-room-container">
      <div className="chat-header">Project Chat</div>
      <div className="chat-messages">
        {messages.map((msg) => {
          const isMyMessage = msg.sender === user;
          return (
            <div
              key={msg._id}
              className={`chat-message ${isMyMessage ? "my-message" : "other-message"}`}
              onMouseEnter={() => !isMyMessage && markSeen(msg._id)}
            >
              {msg.sender !== "System" && <strong>{msg.sender}</strong>}
              <div className="text">{msg.text}</div>
              {msg.sender !== "System" && (
                <div className="message-footer">
                  <span className="time">{msg.time}</span>
                  <span className="reactions">
                    {(msg.reactions || []).map((r, idx) => (
                      <span key={idx}>{r.emoji}</span>
                    ))}
                    <button onClick={() => addReaction(msg._id, "❤️")}>❤️</button>
                    <button onClick={() => addReaction(msg._id, "👍")}>👍</button>
                  </span>
                  {isMyMessage && (
                    <span className="read-receipt">{msg.seenBy.length > 1 ? "✓✓" : "✓"}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {typingUsers.length > 0 && <div className="typing-indicator">{typingUsers.join(", ")} typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input type="text" placeholder="Type a message..." value={text} onChange={handleTyping} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
