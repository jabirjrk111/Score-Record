import express from 'express';
import { addOrUpdateMarks, getStudentMarks } from '../controllers/mark.controller';
import { verifyToken, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', verifyToken, isTeacher, addOrUpdateMarks);
router.get('/:studentId', verifyToken, getStudentMarks);

export default router;
