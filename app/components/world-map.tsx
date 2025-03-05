"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for interactive elements
const interactiveElements = [
  { id: 1, x: 200, y: 150, type: "npc", name: "Village Elder", quest: true },
  { id: 2, x: 400, y: 250, type: "chest", name: "Treasure Chest" },
  { id: 3, x: 600, y: 200, type: "portal", name: "Forest Portal" },
  { id: 4, x: 300, y: 400, type: "monster", name: "Slime", level: 3 },
]

export default function WorldMap() {
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

  // Draw the game world
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

    // Draw background (grass)
    ctx.fillStyle = "#a8e6cf"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some decorative elements
    // Trees
    for (let i = 0; i < 10; i++) {
      const x = (i * 150) % canvas.width
      const y = (i * 120 + 50) % canvas.height

      // Tree trunk
      ctx.fillStyle = "#8B4513"
      ctx.fillRect(x, y, 20, 40)

      // Tree leaves
      ctx.fillStyle = "#228B22"
      ctx.beginPath()
      ctx.arc(x + 10, y - 10, 30, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw path
    ctx.fillStyle = "#d4a76a"
    ctx.fillRect(100, 100, canvas.width - 200, 50)
    ctx.fillRect(300, 100, 50, canvas.height - 200)

    // Draw interactive elements
    interactiveElements.forEach((element) => {
      switch (element.type) {
        case "npc":
          // NPC (circle with different color)
          ctx.fillStyle = "#FFD700"
          ctx.beginPath()
          ctx.arc(element.x, element.y, 15, 0, Math.PI * 2)
          ctx.fill()

          // Quest indicator
          if (element.quest) {
            ctx.fillStyle = "#FF0000"
            ctx.beginPath()
            ctx.arc(element.x, element.y - 20, 5, 0, Math.PI * 2)
            ctx.fill()
          }
          break
        case "chest":
          // Chest (rectangle)
          ctx.fillStyle = "#8B4513"
          ctx.fillRect(element.x - 15, element.y - 10, 30, 20)
          ctx.fillStyle = "#FFD700"
          ctx.fillRect(element.x - 10, element.y - 5, 20, 5)
          break
        case "portal":
          // Portal (swirly circle)
          const gradient = ctx.createRadialGradient(element.x, element.y, 5, element.x, element.y, 20)
          gradient.addColorStop(0, "#9370DB")
          gradient.addColorStop(1, "#4B0082")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(element.x, element.y, 20, 0, Math.PI * 2)
          ctx.fill()
          break
        case "monster":
          // Monster (red blob)
          ctx.fillStyle = "#FF6347"
          ctx.beginPath()
          ctx.arc(element.x, element.y, 15, 0, Math.PI * 2)
          ctx.fill()

          // Level indicator
          if (element.level) {
            ctx.fillStyle = "white"
            ctx.font = "10px Arial"
            ctx.textAlign = "center"
            ctx.fillText(`Lv.${element.level}`, element.x, element.y + 3)
          }
          break
      }

      // Draw name labels
      ctx.fillStyle = "black"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(element.name, element.x, element.y + 30)
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
        setDialogContent({
          title: `${nearElement.name} says:`,
          description: nearElement.quest
            ? "Greetings, adventurer! Our village is troubled by monsters in the nearby forest. Can you help us defeat them?"
            : "Welcome to our peaceful village. Feel free to explore!",
        })
        setShowDialog(true)
        break
      case "chest":
        setDialogContent({
          title: "Treasure Found!",
          description: "You found 50 gold coins and a healing potion!",
        })
        setShowDialog(true)
        break
      case "portal":
        setDialogContent({
          title: "Portal",
          description: "This portal leads to the Enchanted Forest. Do you wish to enter?",
        })
        setShowDialog(true)
        break
      case "monster":
        setDialogContent({
          title: "Combat Initiated!",
          description: `You encounter a Level ${nearElement.level} ${nearElement.name}. Prepare for battle!`,
        })
        setShowDialog(true)
        break
    }
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-md bg-green-50" />

      <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded-md text-sm">
        <p>Use arrow keys to move</p>
        <p>Press E to interact with objects</p>
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
            <Button onClick={() => setShowDialog(false)}>Accept</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

