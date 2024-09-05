import type { Request, Response } from 'express'
import { SignJWT } from 'jose'
import User from '../models/User'
import bcrypt from 'bcrypt'

export class AuthController {
	async login(req: Request, res: Response): Promise<Response> {
		const { name, password } = req.body as { name: string; password: string }

		const accessTokenSecret = new TextEncoder().encode(
			process.env.ACCESS_TOKEN_SECRET,
		) // Get the access token secret from the environment variables
		const refreshTokenSecret = new TextEncoder().encode(
			process.env.REFRESH_TOKEN_SECRET,
		) // Get the refresh token secret from the environment variables

		if (!accessTokenSecret || !refreshTokenSecret)
			return res.status(500).json({ message: 'Internal server error' })

		if (!name || !password)
			return res.status(400).json({ message: 'All fields are required' })

		const foundUser = (await User.findOne({ name })) as {
			name: string
			password: string
		}
		if (!foundUser) return res.status(404).json({ message: 'User not found' })

		const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)

		if (!isPasswordCorrect)
			return res.status(401).json({ message: 'Incorrect password' })

		const accessToken = await new SignJWT({ name: foundUser.name })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('15m') // Access token expires in 15 minutes
			.sign(accessTokenSecret)

		const refreshToken = await new SignJWT({ name: foundUser.name })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('7d') // Refresh token expires in 7 days
			.sign(refreshTokenSecret)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 604800000, // 7 days
		}) // Set the refresh token in a cookie

		return res.status(200).json({
			message: 'Login successful',
			accessToken,
			refreshToken,
		})
	}
}
