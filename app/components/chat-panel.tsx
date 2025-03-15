"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

const initialMessages = [
  { id: 1, sender: "System", content: "Welcome to the Golden Dragon Tavern!", timestamp: new Date().toISOString() },
  {
    id: 2,
    sender: "ElvenArcher",
    content: "Has anyone seen the traveling merchant today?",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 3,
    sender: "DwarfSmith",
    content: "I heard he'll be arriving tomorrow with rare items from the eastern kingdoms.",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
]

export default function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"}`}>
            <div
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                message.sender === "You"
                  ? "bg-purple-600 text-white"
                  : message.sender === "System"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.sender !== "You" && <div className="text-xs font-medium mb-1">{message.sender}</div>}
              <p className="text-sm">{message.content}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

