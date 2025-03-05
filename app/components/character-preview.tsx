"use client"

import { useEffect, useRef } from "react"

interface CharacterData {
  characterRace?: string
  gender?: string
  hairStyle?: string
  hairColor?: string
  outfit?: string
}

export default function CharacterPreview({ characterData }: { characterData: CharacterData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw character based on selected options
    drawCharacter(ctx, characterData)
  }, [characterData])

  const drawCharacter = (ctx: CanvasRenderingContext2D, data: CharacterData) => {
    // Set skin tone based on race
    let skinColor = "#F5D0A9"
    switch (data.characterRace) {
      case "human":
        skinColor = "#F5D0A9"
        break
      case "elf":
        skinColor = "#E0F5E0"
        break
      case "dwarf":
        skinColor = "#D2B48C"
        break
      case "halfling":
        skinColor = "#FFE4B5"
        break
    }

    // Set hair color
    let hairColor = "#8B4513"
    switch (data.hairColor) {
      case "black":
        hairColor = "#000000"
        break
      case "brown":
        hairColor = "#8B4513"
        break
      case "blonde":
        hairColor = "#FFD700"
        break
      case "red":
        hairColor = "#B22222"
        break
      case "silver":
        hairColor = "#C0C0C0"
        break
    }

    // Draw body
    ctx.fillStyle = skinColor
    ctx.beginPath()
    ctx.arc(100, 70, 30, 0, Math.PI * 2) // Head
    ctx.fill()

    // Draw eyes
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(90, 65, 5, 0, Math.PI * 2) // Left eye
    ctx.arc(110, 65, 5, 0, Math.PI * 2) // Right eye
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(90, 65, 2, 0, Math.PI * 2) // Left pupil
    ctx.arc(110, 65, 2, 0, Math.PI * 2) // Right pupil
    ctx.fill()

    // Draw mouth
    ctx.beginPath()
    ctx.arc(100, 80, 10, 0.1 * Math.PI, 0.9 * Math.PI, false)
    ctx.stroke()

    // Draw pointed ears for elves
    if (data.characterRace === "elf") {
      ctx.fillStyle = skinColor
      ctx.beginPath()
      ctx.moveTo(70, 65)
      ctx.lineTo(60, 55)
      ctx.lineTo(70, 75)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(130, 65)
      ctx.lineTo(140, 55)
      ctx.lineTo(130, 75)
      ctx.closePath()
      ctx.fill()
    }

    // Draw hair based on style
    ctx.fillStyle = hairColor
    switch (data.hairStyle) {
      case "short":
        ctx.beginPath()
        ctx.arc(100, 60, 30, Math.PI, 2 * Math.PI)
        ctx.fill()
        break
      case "long":
        ctx.beginPath()
        ctx.arc(100, 60, 30, Math.PI, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(70, 60, 60, 40)
        break
      case "ponytail":
        ctx.beginPath()
        ctx.arc(100, 60, 30, Math.PI, 2 * Math.PI)
        ctx.fill()
        ctx.fillRect(100, 40, 10, 50)
        break
      case "bald":
        // No hair
        break
    }

    // Draw body
    ctx.fillStyle = skinColor
    ctx.fillRect(85, 100, 30, 50) // Torso

    // Draw outfit
    switch (data.outfit) {
      case "casual":
        // Simple shirt
        ctx.fillStyle = "#8A2BE2"
        ctx.fillRect(80, 100, 40, 50)
        break
      case "noble":
        // Fancy clothes
        ctx.fillStyle = "#4B0082"
        ctx.fillRect(80, 100, 40, 50)
        // Gold trim
        ctx.fillStyle = "#FFD700"
        ctx.fillRect(80, 100, 40, 5)
        break
      case "adventurer":
        // Leather armor
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(80, 100, 40, 50)
        // Belt
        ctx.fillStyle = "#A0522D"
        ctx.fillRect(80, 125, 40, 5)
        break
      case "mage":
        // Robe
        ctx.fillStyle = "#483D8B"
        ctx.fillRect(80, 100, 40, 60)
        // Rune symbols
        ctx.fillStyle = "#FFD700"
        ctx.fillText("✦", 90, 120)
        ctx.fillText("✧", 110, 120)
        break
    }

    // Draw arms
    ctx.fillStyle = skinColor
    ctx.fillRect(65, 100, 15, 40) // Left arm
    ctx.fillRect(120, 100, 15, 40) // Right arm

    // Draw legs
    ctx.fillStyle = "#000080" // Blue pants
    ctx.fillRect(85, 150, 12, 50) // Left leg
    ctx.fillRect(103, 150, 12, 50) // Right leg

    // Draw feet
    ctx.fillStyle = "#8B4513" // Brown shoes
    ctx.fillRect(85, 200, 12, 5) // Left foot
    ctx.fillRect(103, 200, 12, 5) // Right foot

    // Race-specific features
    if (data.characterRace === "dwarf") {
      // Beard for male dwarves
      if (data.gender === "male") {
        ctx.fillStyle = hairColor
        ctx.beginPath()
        ctx.moveTo(85, 85)
        ctx.lineTo(115, 85)
        ctx.lineTo(100, 120)
        ctx.closePath()
        ctx.fill()
      }

      // Shorter height
      ctx.clearRect(85, 180, 30, 25)
      ctx.fillStyle = "#000080"
      ctx.fillRect(85, 150, 12, 30) // Left leg
      ctx.fillRect(103, 150, 12, 30) // Right leg

      ctx.fillStyle = "#8B4513"
      ctx.fillRect(85, 180, 12, 5) // Left foot
      ctx.fillRect(103, 180, 12, 5) // Right foot
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-md">
      <h3 className="text-center font-medium mb-4">Character Preview</h3>
      <canvas ref={canvasRef} width={200} height={250} className="border rounded-md" />
      <div className="mt-4 text-center text-sm">
        <p className="font-medium">
          {characterData.gender === "male" ? "Male" : "Female"}{" "}
          {characterData.characterRace?.charAt(0).toUpperCase() + characterData.characterRace?.slice(1)}
        </p>
      </div>
    </div>
  )
}

