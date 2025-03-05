"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Volume2, VolumeX } from "lucide-react"

// Mock participants data
const participants = [
  { id: 1, name: "ElvenArcher", avatar: "elf", speaking: false, muted: false },
  { id: 2, name: "DwarfSmith", avatar: "dwarf", speaking: true, muted: false },
  { id: 3, name: "WizardMage", avatar: "human", speaking: false, muted: true },
  { id: 4, name: "RogueThief", avatar: "halfling", speaking: false, muted: false },
  { id: 5, name: "You", avatar: "human", speaking: false, muted: false, isYou: true },
]

export default function ParticipantsList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <Avatar className={`h-10 w-10 border ${participant.speaking ? "border-green-500 border-2" : ""}`}>
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={participant.name} />
              <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {participant.name} {participant.isYou && "(You)"}
              </p>
            </div>
            <div className="flex space-x-1">
              {!participant.isYou && (
                <>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {participant.muted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

