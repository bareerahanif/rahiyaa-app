import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, userType } = await request.json()

    // Check if user already exists
    const existingUser = await query<any[]>('SELECT * FROM users WHERE email = ?', [email])
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create new user
    const userId = uuidv4()
    await query(
      'INSERT INTO users (name, email, password,  phone, user_type) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone,  userType]
    )

    return NextResponse.json({ user: { id: userId, name, email } })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

