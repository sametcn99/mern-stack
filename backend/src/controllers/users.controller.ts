import type { Request, Response } from 'express'
import User from '../models/user.model'
import type { Document } from 'mongoose' // Import the correct type

type CreateUserRequest = {
	id: string
	name: string
	email: string
	password: string
}

type UpdateUserRequest = {
	id: string
	name?: string
	email?: string
	password?: string
}

type UserDocument = Document & {
	id: string
	name: string
	email: string
	password: string
}

export class UsersController {
	/**
	 * Creates a new user.
	 *
	 * @param req - The request object.
	 * @param res - The response object.
	 * @returns A Promise that resolves to a Response object.
	 */
	async createNewUser(req: Request, res: Response): Promise<Response> {
		try {
			// Validate request body
			if (!req.body)
				return res.status(400).json({ message: 'Request body is required' })

			// Extract user details from request
			const { name, email, password, id } = req.body as CreateUserRequest

			// Check for duplicate user
			const existingUser = await User.findOne({ email })
			if (existingUser)
				return res
					.status(409)
					.json({ message: 'User with this email already exists' })

			// Create user object
			const userObject = { name, email, password, id }

			// Save user to the database
			const user = await User.create(userObject)

			if (!user) return res.status(400).json({ message: 'Failed to create user' })

			return res.status(201).json({ message: 'User created successfully', user })
		} catch (error) {
			// Log the error for debugging purposes
			console.error('Error creating user:', error)

			// Respond with a generic error message
			return res.status(500).json({ message: 'Internal server error' })
		}
	}

	/**
	 * Retrieves all users from MongoDB.
	 *
	 * @param {Request} _ - The request object (unused).
	 * @param {Response} res - The response object.
	 * @returns {Response} The response containing the retrieved users or an error message.
	 */
	async getAllUsers(_: Request, res: Response) {
		// Remove unused req parameter
		try {
			// Get all users from MongoDB
			const users = await User.find().select('-password').lean()

			// If no users
			if (!users?.length)
				return res.status(400).json({ message: 'No users found' })

			// Get all users
			res.json(users)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	/**
	 * Updates a user's details.
	 *
	 * @param req - The request object.
	 * @param res - The response object.
	 * @returns A Promise that resolves to a response containing the updated user details.
	 */
	async updateUser(req: Request, res: Response): Promise<Response> {
		try {
			// Validate request body
			if (!req.body)
				return res.status(400).json({ message: 'Request body is required' })

			// Extract user details from request
			const { id, name, email, password } = req.body as UpdateUserRequest

			console.log(id)

			// Find the user by ID
			const user = (await User.findById(id)) as UserDocument
			if (!user) return res.status(404).json({ message: 'User not found' })

			// Update user details
			if (name) user.name = name
			if (email) user.email = email
			if (password) user.password = password

			// Save updated user to the database
			const updatedUser = await user.save()
			return res
				.status(200)
				.json({ message: 'User updated successfully', user: updatedUser })
		} catch (error) {
			console.error('Error updating user:', error)
			return res.status(500).json({ message: 'Internal server error' })
		}
	}

	/**
	 * Deletes a user.
	 *
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @returns {Promise<Response>} The response containing the result of the deletion.
	 */
	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			// Extract user ID from request parameters
			const { id } = req.query

			// Find the user by ID and delete them
			const user = await User.findByIdAndDelete(id)

			if (!user) return res.status(404).json({ message: 'User not found' })
			else return res.status(200).json({ message: 'User deleted successfully' })
		} catch (error) {
			console.error('Error deleting user:', error)
			return res.status(500).json({ message: 'Internal server error' })
		}
	}
}
