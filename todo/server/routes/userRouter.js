import { Router } from 'express'
import { postRegistration, postLogin } from '../controllers/UserController.js'

const router = Router()

router.post('/signup', postRegistration)

router.post('/signin', postLogin)

export default router
