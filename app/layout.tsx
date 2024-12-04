import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rahiyaa - Female-Focused Driving App',
  description: 'Hail a ride or find a carpool with Rahiyaa, the trusted driving app for women.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}

