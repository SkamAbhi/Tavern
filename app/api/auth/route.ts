import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    password: "password123", // In a real app, this would be hashed
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Find user
    const user = users.find((u) => u.username === username)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you would generate a JWT token here
    const token = "mock-jwt-token"

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

