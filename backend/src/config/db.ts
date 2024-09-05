import mongoose from 'mongoose'
import ora from 'ora'

/**
 * Connects to the database.
 * @returns {Promise<void>} A promise that resolves when the database is connected.
 */
export async function connectDB() {
	const spinner = ora('Trying to connect to database').start()
	try {
		const mongoURI = process.env.MONGO_URI
		if (!mongoURI) throw new Error('MongoURI is not defined')
		await mongoose.connect(mongoURI)
		spinner.succeed('Database connected')
	} catch (error) {
		spinner.fail('Error connecting to database. \n Error: ' + error)
		console.error(error)
	}
}
