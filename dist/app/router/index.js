// ~ ROUTER CONFIG ~ //
import { Router } from 'express';
const router = Router();
import { router as userRoutes } from './user.js';
router.use(userRoutes);
router.get('/', (req, res) => {
    res.send(" Welcome to Ecoroads API");
});
export { router };
