import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    characterClass: "warrior",
    level: 5,
    experience: 450,
    inventory: [
      { id: "1", name: "Health Potion", quantity: 3 },
      { id: "2", name: "Iron Sword", quantity: 1 },
    ],
  },
]

export async function GET(request: Request) {
  // In a real app, you would verify the JWT token here

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, characterClass, gender, hairStyle, hairColor, skinTone } = body

    // Check if username already exists
    if (users.some((u) => u.username === username)) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      email,
      password, // In a real app, this would be hashed
      characterClass,
      gender,
      hairStyle,
      hairColor,
      skinTone,
      level: 1,
      experience: 0,
      inventory: [
        { id: "1", name: "Health Potion", quantity: 1 },
        { id: "2", name: "Wooden Sword", quantity: 1 },
      ],
    }

    users.push(newUser)

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          characterClass: newUser.characterClass,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

