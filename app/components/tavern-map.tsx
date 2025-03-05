"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for interactive elements
const interactiveElements = [
  { id: 1, x: 200, y: 150, type: "npc", name: "Tavern Keeper", interactive: true },
  { id: 2, x: 400, y: 250, type: "table", name: "Main Table", seats: 6, occupied: 3 },
  { id: 3, x: 600, y: 200, type: "table", name: "Corner Table", seats: 4, occupied: 1 },
  { id: 4, x: 300, y: 400, type: "bard", name: "Traveling Bard", interactive: true },
  { id: 5, x: 500, y: 350, type: "fireplace", name: "Fireplace" },
  { id: 6, x: 150, y: 300, type: "bar", name: "Bar Counter" },
]

// Mock data for other participants
const otherParticipants = [
  { id: 1, x: 410, y: 230, name: "ElvenArcher", avatar: "elf" },
  { id: 2, x: 430, y: 270, name: "DwarfSmith", avatar: "dwarf" },
  { id: 3, x: 390, y: 260, name: "WizardMage", avatar: "human" },
  { id: 4, x: 610, y: 190, name: "RogueThief", avatar: "halfling" },
]

export default function TavernMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerX, setPlayerX] = useState(350)
  const [playerY, setPlayerY] = useState(250)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" })
  const playerSize = 20
  const moveSpeed = 5

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setPlayerY((prev) => Math.max(playerSize, prev - moveSpeed))
          break
        case "ArrowDown":
          setPlayerY((prev) => Math.min(window.innerHeight - 100, prev + moveSpeed))
          break
        case "ArrowLeft":
          setPlayerX((prev) => Math.max(playerSize, prev - moveSpeed))
          break
        case "ArrowRight":
          setPlayerX((prev) => Math.min(window.innerWidth - 100, prev + moveSpeed))
          break
        case "e":
          // Check for interaction with elements
          checkInteraction()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Draw the tavern
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth - 100
    canvas.height = window.innerHeight - 150

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw tavern floor
    ctx.fillStyle = "#d4a76a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw wooden floor pattern
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.strokeStyle = "#b38c5d"
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    for (let i = 0; i < canvas.height; i += 50) {
      ctx.strokeStyle = "#b38c5d"
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw interactive elements
    interactiveElements.forEach((element) => {
      switch (element.type) {
        case "npc":
          // NPC (circle with different color)
          ctx.fillStyle = "#FFD700"
          ctx.beginPath()
          ctx.arc(element.x, element.y, 15, 0, Math.PI * 2)
          ctx.fill()

          // Interactive indicator
          if (element.interactive) {
            ctx.fillStyle = "#FF0000"
            ctx.beginPath()
            ctx.arc(element.x, element.y - 20, 5, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case "table":
          // Table (circle)
          ctx.fillStyle = "#8B4513"
          ctx.beginPath()
          ctx.arc(element.x, element.y, 30, 0, Math.PI * 2)
          ctx.fill()

          // Table top
          ctx.fillStyle = "#A0522D"
          ctx.beginPath()
          ctx.arc(element.x, element.y, 25, 0, Math.PI * 2)
          ctx.fill()

          // Seats
          const seatRadius = 10
          const seatDistance = 35
          for (let i = 0; i < element.seats; i++) {
            const angle = (i / element.seats) * Math.PI * 2
            const seatX = element.x + Math.cos(angle) * seatDistance
            const seatY = element.y + Math.sin(angle) * seatDistance

            ctx.fillStyle = "#8B4513"
            ctx.beginPath()
            ctx.arc(seatX, seatY, seatRadius, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case "bard":
          // Bard (circle with music notes)
          ctx.fillStyle = "#9370DB"
          ctx.beginPath()
          ctx.arc(element.x, element.y, 15, 0, Math.PI * 2)
          ctx.fill()

          // Music notes
          ctx.fillStyle = "#FFFFFF"
          ctx.font = "12px Arial"
          ctx.fillText("♪", element.x - 15, element.y - 15)
          ctx.fillText("♫", element.x + 10, element.y - 10)
          break
        case "fireplace":
          // Fireplace (rectangle with flames)
          ctx.fillStyle = "#8B4513"
          ctx.fillRect(element.x - 25, element.y - 15, 50, 40)

          // Flames
          const gradient = ctx.createRadialGradient(element.x, element.y, 5, element.x, element.y, 20)
          gradient.addColorStop(0, "#FF4500")
          gradient.addColorStop(1, "#FF8C00")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(element.x, element.y, 15, 0, Math.PI * 2)
          ctx.fill()
          break
        case "bar":
          // Bar counter (rectangle)
          ctx.fillStyle = "#8B4513"
          ctx.fillRect(element.x - 40, element.y - 15, 80, 30)

          // Bar top
          ctx.fillStyle = "#A0522D"
          ctx.fillRect(element.x - 40, element.y - 15, 80, 5)

          // Bottles
          for (let i = 0; i < 5; i++) {
            ctx.fillStyle = ["#C0C0C0", "#8A2BE2", "#FF7F50", "#32CD32", "#4682B4"][i % 5]
            ctx.fillRect(element.x - 35 + i * 15, element.y - 25, 10, 10)
          }
          break
      }

      // Draw name labels
      ctx.fillStyle = "black"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(element.name, element.x, element.y + 40)
    })

    // Draw other participants
    otherParticipants.forEach((participant) => {
      // Avatar circle
      let avatarColor = "#9370DB"
      switch (participant.avatar) {
        case "elf":
          avatarColor = "#32CD32" // Green
          break
        case "dwarf":
          avatarColor = "#B8860B" // Dark goldenrod
          break
        case "halfling":
          avatarColor = "#FF7F50" // Coral
          break
        case "human":
          avatarColor = "#4682B4" // Steel blue
          break
      }

      ctx.fillStyle = avatarColor
      ctx.beginPath()
      ctx.arc(participant.x, participant.y, playerSize, 0, Math.PI * 2)
      ctx.fill()

      // Name label
      ctx.fillStyle = "black"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(participant.name, participant.x, participant.y + 35)
    })

    // Draw player character
    ctx.fillStyle = "#9370DB"
    ctx.beginPath()
    ctx.arc(playerX, playerY, playerSize, 0, Math.PI * 2)
    ctx.fill()

    // Draw player name
    ctx.fillStyle = "black"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("You", playerX, playerY + 35)

    // Draw interaction hint
    const nearElement = checkNearbyElements()
    if (nearElement) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(playerX - 60, playerY - 50, 120, 25)
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.fillText("Press E to interact", playerX, playerY - 35)
    }
  }, [playerX, playerY])

  // Check if player is near interactive elements
  const checkNearbyElements = () => {
    return interactiveElements.find((element) => {
      const distance = Math.sqrt(Math.pow(element.x - playerX, 2) + Math.pow(element.y - playerY, 2))
      return distance < 50 // Interaction radius
    })
  }

  // Handle interaction with elements
  const checkInteraction = () => {
    const nearElement = checkNearbyElements()
    if (!nearElement) return

    // Different interactions based on element type
    switch (nearElement.type) {
      case "npc":
        if (nearElement.name === "Tavern Keeper") {
          setDialogContent({
            title: `${nearElement.name} says:`,
            description:
              "Welcome to the Golden Dragon Tavern! Feel free to take a seat at any table. We have private rooms available upstairs if you need a more secluded meeting space.",
          })
        } else {
          setDialogContent({
            title: `${nearElement.name} says:`,
            description: "Greetings, traveler! How can I help you today?",
          })
        }
        setShowDialog(true)
        break
      case "table":
        setDialogContent({
          title: `${nearElement.name}`,
          description: `This table has ${nearElement.seats} seats with ${nearElement.occupied} currently occupied. Would you like to join this table?`,
        })
        setShowDialog(true)
        break
      case "bard":
        setDialogContent({
          title: `${nearElement.name} says:`,
          description:
            "Would you like to hear a tale of adventure and wonder? Or perhaps you'd like to request a specific song for the tavern?",
        })
        setShowDialog(true)
        break
      case "fireplace":
        setDialogContent({
          title: `${nearElement.name}`,
          description:
            "The warm fire crackles and provides a cozy atmosphere to the tavern. Perfect for sharing stories with fellow adventurers.",
        })
        setShowDialog(true)
        break
      case "bar":
        setDialogContent({
          title: `${nearElement.name}`,
          description:
            "The bar counter is stocked with various drinks and refreshments. You can order something to enjoy during your meeting.",
        })
        setShowDialog(true)
        break
    }
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-md bg-amber-50" />

      <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded-md text-sm">
        <p>Use arrow keys to move</p>
        <p>Press E to interact with objects and NPCs</p>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
            <Button onClick={() => setShowDialog(false)}>Respond</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

