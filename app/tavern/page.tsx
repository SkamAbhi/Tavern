"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Users, X, Mic, MicOff, Settings } from "lucide-react"
import ChatPanel from "../components/chat-panel"
import ParticipantsList from "../components/participants-list"
import Tavern from "../components/tavern-map"

export default function TavernPage() {
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 relative">
      {/* Main tavern area */}
      <div className="p-4">
        <Tavern/>
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <Button
          variant="secondary"
          className="rounded-full shadow-lg"
          onClick={() => setShowParticipants(!showParticipants)}
        >
          <Users className="h-5 w-5 mr-2" />
          Participants
        </Button>
        <Button variant="secondary" className="rounded-full shadow-lg" onClick={() => setShowChat(!showChat)}>
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat
        </Button>
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          className="rounded-full shadow-lg"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button variant="secondary" className="rounded-full shadow-lg">
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </Button>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Tavern Chat</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowChat(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ChatPanel />
        </div>
      )}

      {/* Participants list */}
      {showParticipants && (
        <div className="fixed bottom-16 left-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Tavern Guests</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowParticipants(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ParticipantsList />
        </div>
      )}

     
    </div>
  )
}

