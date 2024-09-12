export default function Me() {
	/**
		if (!username) {
			return (
				<main className="w-full flex flex-col min-h-screen justify-center items-center bg-foreground text-foreground">
					<div className="bg-card p-8 rounded shadow-md w-full max-w-2xl">
						<h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">
							Please log in
						</h2>
					</div>
				</main>
			)
		}
	*/

	return (
		<main className="w-full flex flex-col min-h-screen justify-center items-center bg-foreground text-foreground">
			<div className="bg-card p-8 rounded shadow-md w-full max-w-2xl">
				<h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">
					User Profile
				</h2>
				<form className="w-full">
					<div className="mb-4">
						<label
							className="block text-muted-foreground text-sm font-bold mb-2"
							htmlFor="name"
						>
							Name
						</label>
						<input
							className="w-full py-2 px-3 border border-border rounded focus:outline-none focus:shadow-outline bg-input text-foreground"
							id="name"
							type="text"
							placeholder="John Doe"
							value="John Doe"
							readOnly
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-muted-foreground text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="w-full py-2 px-3 border border-border rounded focus:outline-none focus:shadow-outline bg-input text-foreground"
							id="email"
							type="email"
							placeholder="johndoe@example.com"
							value="johndoe@example.com"
							readOnly
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-muted-foreground text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="w-full py-2 px-3 border border-border rounded focus:outline-none focus:shadow-outline bg-input text-foreground"
							id="password"
							type="password"
							placeholder="Enter your password"
						/>
					</div>
					<div className="flex items-center justify-center">
						<button
							className="bg-primary hover:bg-primary-foreground text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
						>
							Update
						</button>
					</div>
				</form>
			</div>
		</main>
	)
}
