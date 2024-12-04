'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  userType: 'RIDER' | 'DRIVER'
}

interface Ride {
  id: string
  pickup: string
  destination: string
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED'
  fare: number
}

interface Carpool {
  id: string
  route: string
  seats: number
  departure_time: string
  driver_name: string
  driver_phone: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [carpoolSearch, setCarpoolSearch] = useState('')
  const [rides, setRides] = useState<Ride[]>([])
  const [carpools, setCarpools] = useState<Carpool[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (user) {
      fetchRides()
    }
  }, [user])

  const fetchRides = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/rides', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setRides(data.rides)
      } else {
        throw new Error(data.error || 'Failed to fetch rides')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleHailRide = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ pickup, destination }),
      })
      const data = await response.json()
      if (response.ok) {
        setRides([data.ride, ...rides])
        setPickup('')
        setDestination('')
      } else {
        throw new Error(data.error || 'Failed to create ride')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleFindCarpool = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/carpools?route=${encodeURIComponent(carpoolSearch)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setCarpools(data.carpools)
      } else {
        throw new Error(data.error || 'Failed to fetch carpools')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Welcome to Your Rahiyaa Dashboard, {user.name}</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {user.userType === 'RIDER' ? (
        <Tabs defaultValue="hail-ride" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hail-ride">Hail a Ride</TabsTrigger>
            <TabsTrigger value="find-carpool">Find a Carpool</TabsTrigger>
          </TabsList>
          <TabsContent value="hail-ride">
            <Card>
              <CardHeader>
                <CardTitle>Hail a Ride</CardTitle>
                <CardDescription>Enter your pickup and destination locations to request a ride.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHailRide} className="space-y-4">
                  <div>
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Input
                      id="pickup"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Enter pickup location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination"
                    />
                  </div>
                  <Button type="submit">Request Ride</Button>
                </form>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Your Rides</CardTitle>
              </CardHeader>
              <CardContent>
                {rides.length > 0 ? (
                  <ul className="space-y-2">
                    {rides.map((ride) => (
                      <li key={ride.id} className="border p-2 rounded">
                        <p>From: {ride.pickup}</p>
                        <p>To: {ride.destination}</p>
                        <p>Status: {ride.status}</p>
                        <p>Fare: ${ride.fare.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No rides found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="find-carpool">
            <Card>
              <CardHeader>
                <CardTitle>Find a Carpool</CardTitle>
                <CardDescription>Search for available carpool options by route.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFindCarpool} className="space-y-4">
                  <div>
                    <Label htmlFor="carpool-search">Search Carpools</Label>
                    <Input
                      id="carpool-search"
                      value={carpoolSearch}
                      onChange={(e) => setCarpoolSearch(e.target.value)}
                      placeholder="Enter your route or destination"
                    />
                  </div>
                  <Button type="submit">Search Carpools</Button>
                </form>
                {carpools.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Available Carpools</h3>
                    <ul className="space-y-2">
                      {carpools.map((carpool) => (
                        <li key={carpool.id} className="border p-2 rounded">
                          <p>Route: {carpool.route}</p>
                          <p>Driver: {carpool.driver_name}</p>
                          <p>Seats: {carpool.seats}</p>
                          <p>Departure: {new Date(carpool.departure_time).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Driver Dashboard</CardTitle>
            <CardDescription>Manage your rides and carpool availability.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Implement driver-specific functionality here */}
            <p>Driver dashboard content goes here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

