import express from 'express'
import userRoute from '../routes/user.route' // Import the user routes
import authRoute from '../routes/auth.route' // Import the auth routes

/**
 * Configures the middlewares for the Express application.
 *
 * @param app - The Express application.
 */
export const configureRoutes = (app: express.Application) => {
	const basePath = '/api'
	app.use(basePath, userRoute)
	app.use(basePath, authRoute)
}
