import { Router } from 'express';
import { authenticateUser } from '../controllers/authenticateController';

const router = Router();

router.post('/', authenticateUser);

export default router;