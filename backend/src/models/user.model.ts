import mongoose, { Schema } from 'mongoose'

/**
 * User schema for the User model.
 *
 * @property {string} id - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 */
const UserSchema = new mongoose.Schema(
	{
		id: { type: Schema.Types.String, required: true },
		name: { type: Schema.Types.String, required: true },
		email: { type: Schema.Types.String, required: true },
		password: { type: Schema.Types.String, required: true },
	},
	{
		collection: 'users',
		timestamps: true, // Adds createdAt and updatedAt fields
	},
)

export default mongoose.model('User', UserSchema)
