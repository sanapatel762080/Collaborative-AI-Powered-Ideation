import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, signup, refresh, me, logout, seedAdmin } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';


const router = Router();


const limiter = rateLimit({
windowMs: 60 * 1000,
max: 20,
standardHeaders: true,
legacyHeaders: false,
});


router.use(limiter);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/refresh', refresh);


//  Remove or protect in production
router.post('/seed-admin', seedAdmin);


export default router;