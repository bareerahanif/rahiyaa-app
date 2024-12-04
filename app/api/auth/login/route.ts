import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import { query } from '@/lib/db'
import { generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const users = await query<any[]>('SELECT * FROM users WHERE email = ?', [email])
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken({ userId: user.id, email: user.email })

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, userType: user.user_type } })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

