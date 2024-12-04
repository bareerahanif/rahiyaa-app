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

    const { route, seats, departureTime } = await request.json()

    const carpoolId = uuidv4()
    await query(
      'INSERT INTO carpools (id, driver_id, route, seats, departure_time) VALUES (?, ?, ?, ?, ?)',
      [carpoolId, decoded.userId, route, seats, departureTime]
    )

    const [carpool] = await query<any[]>('SELECT * FROM carpools WHERE id = ?', [carpoolId])

    return NextResponse.json({ carpool })
  } catch (error) {
    console.error('Create carpool error:', error)
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

    const { searchParams } = new URL(request.url)
    const route = searchParams.get('route')

    const carpools = await query<any[]>(
      `SELECT c.*, u.name as driver_name, u.phone as driver_phone 
       FROM carpools c 
       JOIN users u ON c.driver_id = u.id 
       WHERE c.route LIKE ? AND c.departure_time > NOW() 
       ORDER BY c.departure_time ASC`,
      [`%${route}%`]
    )

    return NextResponse.json({ carpools })
  } catch (error) {
    console.error('Get carpools error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

