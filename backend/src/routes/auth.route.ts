import express from 'express'
import { AuthController } from '../controllers/auth.controller'

const router = express.Router()

const authController = new AuthController()

router.route('/auth').post(authController.login)

export default router
