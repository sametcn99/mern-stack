import mongoose from 'mongoose'
import User from '../../models/User'
import mockData from './mock-data.json'
import ora from 'ora'
import bcrypt from 'bcrypt'

/**
 * Seeds the database with mock data.
 *
 * @remarks
 * This function connects to the database, clears the users collection, and inserts mock data into the collection.
 *
 * @returns A Promise that resolves when the database is seeded successfully or rejects with an error.
 */
async function seedDatabase() {
	const dbSpinner = ora('Trying to connect to database')
	const seedSpinner = ora('Seeding database')
	try {
		try {
			dbSpinner.start()
			const mongoURI = process.env.MONGO_URI
			if (!mongoURI) throw new Error('MongoURI is not defined')
			await mongoose.connect(mongoURI)
			dbSpinner.succeed('Database connected')
		} catch (error) {
			dbSpinner.fail('Error connecting to database')
			console.error(error)
			return
		}

		// Start the seed spinner
		seedSpinner.start()

		// Clear the users collection
		seedSpinner.text = 'Cleaning database'
		await User.deleteMany({})

		// Ensure the users collection is empty
		const userCount = await User.countDocuments({})
		if (userCount !== 0) throw new Error('Failed to clean users collection')
		else seedSpinner.text = 'Database cleaned'

		const uniqueMockData = await Promise.all(
			mockData.map(async (user) => {
				const hashedPassword = await bcrypt.hash(user.password, 10)
				return {
					...user,
					_id: new mongoose.Types.ObjectId(),
					id: user.id || new mongoose.Types.ObjectId().toString(),
					password: hashedPassword,
				}
			}),
		)

		// Insert the mock data into the users collection in the database
		await User.insertMany(uniqueMockData)

		seedSpinner.succeed('Database seeded successfully')
	} catch (error) {
		console.error('Error seeding database:', error)
		seedSpinner.fail('Error seeding database')
	} finally {
		// Close the database connection
		mongoose.connection.close()
	}
}

seedDatabase()
