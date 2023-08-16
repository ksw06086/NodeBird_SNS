import express from 'express';
import { isLoggedIn } from '../middlewares';
import { update, follow, followCancel, like, likeCancel } from '../controllers/user';
import multer from 'multer';
const router = express.Router();

const upload = multer();
router.patch('/update', isLoggedIn, upload.none(), update);
router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/follow/cancel', isLoggedIn, followCancel);
router.post('/:id/like', isLoggedIn, like);
router.post('/:id/like/cancel', isLoggedIn, likeCancel);

export default router;