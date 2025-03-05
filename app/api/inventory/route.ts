import { NextResponse } from "next/server"

// Mock inventory database
const inventories = {
  "1": [
    { id: "1", name: "Health Potion", description: "Restores 50 HP", quantity: 3, type: "consumable", value: 20 },
    {
      id: "2",
      name: "Iron Sword",
      description: "A basic sword",
      quantity: 1,
      type: "weapon",
      value: 100,
      stats: { attack: 10 },
    },
    { id: "3", name: "Magic Scroll", description: "Contains a basic spell", quantity: 1, type: "scroll", value: 50 },
    {
      id: "4",
      name: "Leather Armor",
      description: "Basic protection",
      quantity: 1,
      type: "armor",
      value: 80,
      stats: { defense: 5 },
    },
  ],
}

export async function GET(request: Request) {
  // In a real app, you would verify the JWT token and get the user ID from it
  const userId = "1" // Mock user ID

  const userInventory = inventories[userId] || []

  return NextResponse.json({ inventory: userInventory })
}

export async function POST(request: Request) {
  try {
    // In a real app, you would verify the JWT token and get the user ID from it
    const userId = "1" // Mock user ID

    const body = await request.json()
    const { itemId, action, quantity = 1 } = body

    if (!inventories[userId]) {
      inventories[userId] = []
    }

    const userInventory = inventories[userId]

    if (action === "add") {
      // Check if item already exists in inventory
      const existingItemIndex = userInventory.findIndex((item) => item.id === itemId)

      if (existingItemIndex >= 0) {
        // Update quantity
        userInventory[existingItemIndex].quantity += quantity
      } else {
        // Add new item (in a real app, you would fetch item details from a database)
        userInventory.push({
          id: itemId,
          name: "New Item",
          description: "A new item",
          quantity,
          type: "misc",
          value: 10,
        })
      }
    } else if (action === "remove") {
      // Find item in inventory
      const existingItemIndex = userInventory.findIndex((item) => item.id === itemId)

      if (existingItemIndex >= 0) {
        // Update quantity or remove item
        if (userInventory[existingItemIndex].quantity > quantity) {
          userInventory[existingItemIndex].quantity -= quantity
        } else {
          userInventory.splice(existingItemIndex, 1)
        }
      }
    }

    return NextResponse.json({ inventory: userInventory })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

