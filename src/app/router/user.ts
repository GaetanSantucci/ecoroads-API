// ~ ROUTER CONFIG ~ //
import { Router } from 'express';
const router = Router();

import { getAllUsers, getUserProfile, signUp, signIn, signOut, updateUser, deleteUser } from '../controller/user.js'
import { auth } from '../middleware/auth.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

router.get('/users', getAllUsers)

router.post('/users/signup', signUp)

router.post('/users/signIn', signIn)
router.get('/users/:userId(\\d+)', [authenticateToken, auth], getUserProfile)

router.get('/users/signout', signOut)

router.patch('/users/:userId(\\d+)', [authenticateToken, auth], updateUser)
router.delete('/users/:userId(\\d+)', [authenticateToken, auth], deleteUser)

export { router };