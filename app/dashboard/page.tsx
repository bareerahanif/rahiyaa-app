'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Ride {
  ride_id: number;
  ride_type: string;
  start_location: string;
  end_location: string;
  start_time: string;
  status: string;
}

export default function Dashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRides = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/rides?userId=${token}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch rides');
        }

        const data = await response.json();
        setRides(data.rides);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link href="/dashboard/carpool">Carpool</Link></li>
          <li><Link href="/dashboard/hail-ride">Hail a Ride</Link></li>
        </ul>
      </nav>
      <h2>Your Rides</h2>
      {rides.length > 0 ? (
        <ul>
          {rides.map((ride) => (
            <li key={ride.ride_id}>
              {ride.ride_type} - From {ride.start_location} to {ride.end_location} - {ride.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rides found.</p>
      )}
    </div>
  );
}

