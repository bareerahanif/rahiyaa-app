'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HailRide() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement ride hailing logic
    console.log('Ride hailed:', { pickup, dropoff });
    // For now, just redirect back to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hail a Ride</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">Pickup Location</label>
          <input
            type="text"
            id="pickup"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">Dropoff Location</label>
          <input
            type="text"
            id="dropoff"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Hail Ride
        </button>
      </form>
    </div>
  );
}

