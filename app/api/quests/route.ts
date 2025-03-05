import { NextResponse } from "next/server"

// Mock quests database
const quests = [
  {
    id: "1",
    title: "The Lost Artifact",
    description: "Find the ancient artifact hidden in the Enchanted Forest.",
    level: 1,
    rewards: {
      experience: 100,
      gold: 50,
      items: [{ id: "3", name: "Magic Scroll", quantity: 1 }],
    },
    location: "Enchanted Forest",
    npcGiver: "Village Elder",
  },
  {
    id: "2",
    title: "Slime Infestation",
    description: "Clear the slimes that have been troubling the village.",
    level: 2,
    rewards: {
      experience: 150,
      gold: 75,
      items: [{ id: "4", name: "Slime Essence", quantity: 3 }],
    },
    location: "Village Outskirts",
    npcGiver: "Village Guard",
  },
  {
    id: "3",
    title: "The Dragon's Lair",
    description: "Explore the dragon's lair and retrieve a scale as proof of your bravery.",
    level: 5,
    rewards: {
      experience: 500,
      gold: 300,
      items: [{ id: "5", name: "Dragon Scale", quantity: 1 }],
    },
    location: "Mountain Peak",
    npcGiver: "Guild Master",
  },
]

export async function GET(request: Request) {
  // In a real app, you would verify the JWT token here

  // Get query parameters
  const { searchParams } = new URL(request.url)
  const level = searchParams.get("level")

  let filteredQuests = quests

  // Filter quests by level if provided
  if (level) {
    filteredQuests = quests.filter((q) => q.level <= Number.parseInt(level))
  }

  return NextResponse.json({ quests: filteredQuests })
}

