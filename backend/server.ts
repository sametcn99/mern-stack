import express from 'express' // Import the express module
import { connectDB } from './src/config/db' // Import the database connection function
import { configureMiddlewares } from './src/middlewares/config'
import { configureRoutes } from './src/routes/config'

const app = express() // Create an instance of an Express application
const port = 8080 // Define the port number on which the server will listen

// Connect to the database
await connectDB()

// Configure the middlewares for the Express application
configureMiddlewares(app)

// Configure the routes for the Express application
configureRoutes(app)

// Define a route for the root URL
app.get('/', (req, res) => {
	res.send('Hello World') // Send a simple response for the root URL
})

// Start the server and listen on the defined port
app.listen(port, () => {
	console.log(`Backend listening on port ${port}`) // Log a message when the server starts
})
