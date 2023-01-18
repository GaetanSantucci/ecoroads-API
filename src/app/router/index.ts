// ~ ROUTER CONFIG ~ //

import { Router } from 'express';
const router = Router();

import { router as userRoutes } from './user.js';
router.use(userRoutes);

import { router as locationRoutes } from './location.js';
router.use(locationRoutes);

router.get('/', (req, res) => {
  res.send(" Welcome to Ecoroads API")
})



export { router };