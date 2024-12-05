import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const rides = await query(
      `SELECT r.ride_id, r.ride_type, r.start_location, r.end_location, r.start_time, r.status
       FROM rides r
       LEFT JOIN ride_passengers rp ON r.ride_id = rp.ride_id
       WHERE r.driver_id = ? OR rp.passenger_id = ?
       ORDER BY r.start_time DESC`,
      [userId, userId]
    );

    return NextResponse.json({ rides });
  } catch (error) {
    console.error('Get rides error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

