// ~ ROUTER CONFIG ~ //
import { Router } from 'express';
const router = Router();
router.get('/api', (req, res) => {
    res.send(" Welcome to Ecoroads API");
});
export { router };
