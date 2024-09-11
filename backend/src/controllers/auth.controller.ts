import type { Request, Response } from 'express'
import { SignJWT } from 'jose'
import User from '../models/user.model'
import bcrypt from 'bcrypt'

export class AuthController {
	async login(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body as { email: string; password: string }

		const accessTokenSecret = new TextEncoder().encode(
			process.env.ACCESS_TOKEN_SECRET,
		) // Get the access token secret from the environment variables
		const refreshTokenSecret = new TextEncoder().encode(
			process.env.REFRESH_TOKEN_SECRET,
		) // Get the refresh token secret from the environment variables

		if (!accessTokenSecret || !refreshTokenSecret)
			return res.status(500).json({ message: 'Internal server error' })

		if (!email || !password)
			return res.status(400).json({ message: 'All fields are required' })

		const foundUser = (await User.findOne({ email })) as {
			email: string
			password: string
		}
		if (!foundUser) return res.status(404).json({ message: 'User not found' })

		const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)

		if (!isPasswordCorrect)
			return res.status(401).json({ message: 'Incorrect password' })

		const accessToken = await new SignJWT({ email: foundUser.email })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('15m') // Access token expires in 15 minutes
			.sign(accessTokenSecret)

		const refreshToken = await new SignJWT({ email: foundUser.email })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('7d') // Refresh token expires in 7 days
			.sign(refreshTokenSecret)

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 900000, // 15 minutes
		}) // Set the access token in a cookie

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 604800000, // 7 days
		}) // Set the refresh token in a cookie

		return res.status(200).json({
			message: 'Login successful',
		})
	}
}
