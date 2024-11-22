import { Router } from 'express';
import { getUserPosts, publishPost } from '../controllers/postsController';
import { verifyJWT } from '../middleware/verifyJWT';

const router = Router();

router.get('/myposts', verifyJWT, getUserPosts);
router.post('/publish', verifyJWT, publishPost);

export default router;