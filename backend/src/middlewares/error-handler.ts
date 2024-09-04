import type { Request, Response, NextFunction } from 'express'

/**
 * Error handler middleware.
 *
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Log the error (you can customize this to log to a file or external service)
	console.error(err.stack)

	// Set the response status code
	const statusCode = err.statusCode || 500

	// Send a standardized error response
	res.status(statusCode).json({
		status: 'error',
		statusCode: statusCode,
		message: err.message || 'Internal Server Error',
	})
}

export default errorHandler
