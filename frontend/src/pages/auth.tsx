import { useCallback, useEffect, useState } from 'react'
import { apiURL, cn } from '../lib/utils'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [submitDisabled, setSubmitDisabled] = useState(true)
	const navigate = useNavigate()

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setEmail(e.target.value)

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value)

	const activateSubmitButton = useCallback(() => {
		// validate email by regex
		const emailValidate = email.match(
			/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
		)

		// validate password by checking length
		const passwordValidate = password.length >= 8

		// enable submit button if both are valid
		return emailValidate && passwordValidate ? false : true
	}, [email, password])

	useEffect(() => {
		setSubmitDisabled(activateSubmitButton())
	}, [email, password, activateSubmitButton])

	const handleSubmit = async () => {
		if (submitDisabled) {
			alert('Invalid email or password')
			return
		}
		try {
			console.debug(email, password)
			const response = await fetch(`${apiURL}/api/auth`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include',
			})

			if (response.ok) {
				navigate('/me')
			} else {
				console.error('Failed to login')
			}
		} catch (error) {
			console.error('Failed to login', error)
		}
	}

	return (
		<main className="w-full flex flex-col min-h-screen justify-center items-center bg-foreground">
			<div className="bg-card p-8 rounded shadow-md w-full max-w-sm">
				<h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">
					Login
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-muted-foreground text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className={cn(
								'w-full py-2 px-3 border border-border rounded focus:outline-none focus:shadow-outline bg-input text-foreground',
							)}
							id="email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={handleEmailChange}
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-muted-foreground text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className={cn(
								'w-full py-2 px-3 border border-border rounded focus:outline-none focus:shadow-outline bg-input text-foreground',
							)}
							id="password"
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={handlePasswordChange}
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="button"
							onClick={handleSubmit}
						>
							Login
						</button>
						<a
							className="inline-block align-baseline font-bold text-sm text-accent-foreground hover:text-accent"
							href="#"
						>
							Forgot Password?
						</a>
					</div>
				</form>
			</div>
		</main>
	)
}
