import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pickup, destination } = await request.json()

    const rideId = uuidv4()
    await query(
      'INSERT INTO rides (id, rider_id, pickup, destination, status, fare) VALUES (?, ?, ?, ?, ?, ?)',
      [rideId, decoded.userId, pickup, destination, 'PENDING', 15.00]
    )

    const [ride] = await query<any[]>('SELECT * FROM rides WHERE id = ?', [rideId])

    return NextResponse.json({ ride })
  } catch (error) {
    console.error('Create ride error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rides = await query<any[]>(
      'SELECT * FROM rides WHERE rider_id = ? OR driver_id = ? ORDER BY created_at DESC',
      [decoded.userId, decoded.userId ]
    )

    return NextResponse.json({ rides })
  } catch (error) {
    console.error('Get rides error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

