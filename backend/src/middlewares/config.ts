import express from 'express'
import cors from 'cors'
import logger from './logger.middleware'
import errorHandler from './error-handler.middleware'
import type { Ora } from 'ora'

/**
 * Configures the middlewares for the Express application.
 *
 * @param app - The Express application.
 */
export const configureMiddlewares = (
	app: express.Application,
	spinner: Ora,
) => {
	spinner.text = 'Configuring middlewares...'
	app.use(
		cors({
			origin: process.env.CLIENT_URL,
			credentials: true,
			allowedHeaders: [
				'Content-Type',
				'Authorization',
				'Access-Control-Allow-Origin',
			],
		}),
	) // Middleware to enable CORS
	app.use(logger) // Middleware to log requests
	app.use(express.json()) // Middleware to parse JSON bodies
	app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies

	// Error handler middleware should be the last middleware to be added to the Express application stack to handle errors that may occur during the request-response cycle.
	app.use(errorHandler) // Middleware to handle errors
	spinner.succeed('Middlewares configured')
}
