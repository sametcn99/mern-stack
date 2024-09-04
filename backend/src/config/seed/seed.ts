import mongoose from 'mongoose'
import User from '../../models/User'
import mockData from './mock-data.json'
import ora from 'ora'

/**
 * Seeds the database with mock data.
 *
 * @remarks
 * This function connects to the MongoDB database, clears the existing users collection,
 * and inserts mock data into the users collection. It ensures that each document in the
 * mock data has a unique _id and id.
 *
 * @returns A Promise that resolves when the database is successfully seeded.
 *
 * @throws An error if there is a problem connecting to the database, cleaning the users
 * collection, or inserting the mock data.
 */
async function seedDatabase() {
	try {
		// MongoDB'ye bağlanın
		const spinner = ora('Trying to connect to database').start()
		try {
			const mongoURI = process.env.MONGO_URI
			if (!mongoURI) throw new Error('MongoURI is not defined')
			await mongoose.connect(mongoURI)
			spinner.succeed('Database connected')
		} catch (error) {
			spinner.fail('Error connecting to database')
			console.error(error)
			return
		}

		// Mevcut kullanıcıları temizleyin
		await User.deleteMany({})

		// Kullanıcıların temizlendiğini kontrol edin
		const userCount = await User.countDocuments({})
		if (userCount !== 0) {
			throw new Error('Failed to clean users collection')
		} else {
			console.log('Users collection cleaned successfully')
		}

		// Ensure each document in mockData has a unique _id and id
		const uniqueMockData = mockData.map((user) => ({
			...user,
			_id: new mongoose.Types.ObjectId(),
			id: user.id || new mongoose.Types.ObjectId().toString(),
		}))

		// Mock verileri ekleyin
		await User.insertMany(uniqueMockData)

		console.log('Database seeded successfully')
	} catch (error) {
		console.error('Error seeding database:', error)
	} finally {
		// MongoDB bağlantısını kapatın
		mongoose.connection.close()
	}
}

seedDatabase()
