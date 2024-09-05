import type { Request, Response, NextFunction } from 'express'

/**
 * Middleware function for logging HTTP requests and responses.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
const logger = (req: Request, res: Response, next: NextFunction) => {
	const method = req.method
	const url = req.url
	const userAgent = req.headers['user-agent']
	const start = Date.now()

	// Listen for the response to finish
	res.on('finish', () => {
		const duration = Date.now() - start
		console.log(
			`${new Date().toISOString()} - ${method} ${url} - ${userAgent} - ${duration}ms`,
		)
	})

	// Call the next middleware function in the stack
	next()
}

export default logger
