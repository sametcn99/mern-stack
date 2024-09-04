import express from 'express'
import { UsersController } from '../controllers/users.controller'

const router = express.Router()

const usersController = new UsersController()

router
	.route('/users')
	.get(usersController.getAllUsers)
	.post(usersController.createNewUser)
	.patch(usersController.updateUser)
	.delete(usersController.deleteUser)

export default router
