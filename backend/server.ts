import express from 'express' // Import the express module
import { connectDB } from './src/config/db' // Import the database connection function
import { configureMiddlewares } from './src/middlewares/config'
import { configureRoutes } from './src/routes/config'
import ora from 'ora'
const spinner = ora('Backend is starting...').start()

const app = express() // Create an instance of an Express application
const port = 8080 // Define the port number on which the server will listen

// Connect to the database
await connectDB(spinner)

// Configure the middlewares for the Express application
configureMiddlewares(app, spinner)

// Configure the routes for the Express application
configureRoutes(app, spinner)

// Define a route for the root URL
app.get('/', (req, res) => {
	res.send('Hello World') // Send a simple response for the root URL
})

// Start the server and listen on the defined port
app.listen(port, () => {
	spinner.succeed('Backend started. Listening on port ' + port).stop()
})
