"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserPlus } from "lucide-react"

// Mock player data
const nearbyPlayers = [
  { id: 1, name: "DragonSlayer42", level: 7, class: "Warrior", online: true },
  { id: 2, name: "MagicWizard", level: 5, class: "Mage", online: true },
  { id: 3, name: "ShadowNinja", level: 8, class: "Rogue", online: false },
  { id: 4, name: "HealerGirl", level: 4, class: "Cleric", online: true },
  { id: 5, name: "TankMaster", level: 9, class: "Knight", online: true },
]

export default function PlayersList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 space-y-3">
        {nearbyPlayers.map((player) => (
          <div key={player.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={player.name} />
              <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-medium truncate">{player.name}</p>
                <span className={`ml-2 h-2 w-2 rounded-full ${player.online ? "bg-green-500" : "bg-gray-300"}`}></span>
              </div>
              <p className="text-xs text-gray-500">
                Lv.{player.level} {player.class}
              </p>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

