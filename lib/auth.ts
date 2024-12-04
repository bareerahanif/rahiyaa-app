import { verify, sign } from 'jsonwebtoken'

export function verifyToken(token: string | undefined) {
  if (!token) return null

  try {
    return verify(token, process.env.JWT_SECRET!) as { userId: string, email: string }
  } catch (error) {
    return null
  }
}

export function generateToken(payload: { userId: string, email: string }) {
  return sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' })
}

