// ~ ROUTER CONFIG ~ //

import { Router } from 'express';
const router = Router();
import { getAllUsers, getUser, signUp, signIn, signOut, updateUser, deleteUser } from '../controller/user.js'

router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.post('/users', signUp)
router.post('/users/signIn', signIn)
router.get('/users/signout', signOut)
router.patch('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export { router };