import express from 'express'
import cors from 'cors'
import logger from './logger'
import errorHandler from './error-handler'

/**
 * Configures the middlewares for the Express application.
 *
 * @param app - The Express application.
 */
export const configureMiddlewares = (app: express.Application) => {
	app.use(cors()) // Middleware to enable CORS
	app.use(logger) // Middleware to log requests
	app.use(express.json()) // Middleware to parse JSON bodies
	app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies

	// Error handler middleware should be the last middleware to be added to the Express application stack to handle errors that may occur during the request-response cycle.
	app.use(errorHandler) // Middleware to handle errors
}
