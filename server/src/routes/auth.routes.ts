import express from 'express';
import { register, login, logout, getStudents } from '../controllers/auth.controller';
import { verifyToken, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/students', verifyToken, isTeacher, getStudents);

export default router;
