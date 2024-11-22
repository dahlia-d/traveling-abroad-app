import { Router } from 'express';
import { refreshToken } from '../controllers/refreshTokenController';

const router = Router();

router.get('/', refreshToken);

export default router;