import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth.tsx'
import Me from './pages/me.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/me" element={<Me />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)
