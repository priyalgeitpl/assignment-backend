import { getAllUsers, verifyEmail, sendEmail, saveCategories, findUser } from '../Controllers/UserController';
import express from 'express';
const router = express.Router();

router.get('/user', getAllUsers);
router.post('/login', findUser);
router.post('/verify/email', verifyEmail);
router.post('/send/email', sendEmail);
router.post('/categories', saveCategories);

export default router;
