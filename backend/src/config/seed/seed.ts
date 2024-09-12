import mongoose from 'mongoose'
import User from '../../models/user.model'
import mockData from './mock-data.json'
import ora from 'ora'
import bcrypt from 'bcrypt'
import inquirer from 'inquirer'

/**
 * Seeds the database with mock data.
 *
 * @remarks
 * This function connects to the database, clears the users collection, and inserts mock data into the collection.
 *
 * @returns A Promise that resolves when the database is seeded successfully or rejects with an error.
 */
;(async () => {
	const dbSpinner = ora('Trying to connect to database')
	const seedSpinner = ora('Starting seed process')
	const confirmation = await askForConfirmation(
		'This action will delete all existing data in the database and replace it with default values.\nIf you want to proceed, type "yes" and press Enter: ',
	)
	if (!confirmation) {
		console.error('Seed process aborted')
		return
	}
	try {
		try {
			dbSpinner.start()
			const mongoURI = process.env.MONGO_URI
			if (!mongoURI) throw new Error('MongoURI is not defined')
			await mongoose.connect(mongoURI)
			dbSpinner.succeed('Database connected')
		} catch (error) {
			dbSpinner.fail('Error connecting to database. \n Error: ' + error)
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
		else seedSpinner.succeed('Database cleaned')

		seedSpinner.text = 'Hashing passwords'
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
		seedSpinner.succeed('Passwords hashed successfully')

		seedSpinner.text = 'Seeding database'

		// Insert the mock data into the users collection in the database
		await User.insertMany(uniqueMockData)

		seedSpinner.succeed('Database seeded successfully').stop()
	} catch (error) {
		console.error('Error seeding database:', error)
		seedSpinner.fail('Error seeding database')
	} finally {
		// Close the database connection
		mongoose.connection.close()
	}
})()

async function askForConfirmation(message: string): Promise<boolean> {
	const answers = await inquirer.prompt([
		{
			type: 'input',
			name: 'confirmation',
			message: message,
		},
	])
	return answers.confirmation.toLowerCase() === 'yes'
}
