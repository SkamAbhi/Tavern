"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Users, X } from "lucide-react"
import ChatPanel from "../components/chat-panel"
import PlayersList from "../components/player-lists"
import WorldMap from "../components/world-map"


export default function WorldPage() {
  const [showChat, setShowChat] = useState(false)
  const [showPlayers, setShowPlayers] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 relative">
      {/* Main game area */}
      <div className="p-4">
        <WorldMap />
      </div>

      {/* Game controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <Button variant="secondary" className="rounded-full shadow-lg" onClick={() => setShowPlayers(!showPlayers)}>
          <Users className="h-5 w-5 mr-2" />
          Players
        </Button>
        <Button variant="secondary" className="rounded-full shadow-lg" onClick={() => setShowChat(!showChat)}>
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat
        </Button>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Chat</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowChat(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ChatPanel />
        </div>
      )}

      {/* Players list */}
      {showPlayers && (
        <div className="fixed bottom-16 left-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Players Nearby</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowPlayers(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <PlayersList />
        </div>
      )}

      {/* Game HUD */}
      <div className="fixed top-20 left-4 space-y-2">
        <Card className="w-48">
          <CardContent className="p-3">
            <div className="text-sm font-medium">Level 5</div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-purple-600 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">XP: 450/1000</div>
          </CardContent>
        </Card>

        <Card className="w-48">
          <CardContent className="p-3">
            <div className="text-sm font-medium">Health</div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-red-500 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">75/100</div>
          </CardContent>
        </Card>

        <Card className="w-48">
          <CardContent className="p-3">
            <div className="text-sm font-medium">Mana</div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">60/100</div>
          </CardContent>
        </Card>
      </div>

      {/* Mini map */}
      <div className="fixed top-20 right-4">
        <Card className="w-48 h-48">
          <CardContent className="p-0 relative">
            <div className="absolute inset-0 bg-green-100 rounded-sm m-2">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

