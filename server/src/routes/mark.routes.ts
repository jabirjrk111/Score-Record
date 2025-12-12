import express from 'express';
import { addOrUpdateMarks, getStudentMarks, getExamMarks } from '../controllers/mark.controller';
import { verifyToken, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', verifyToken, isTeacher, addOrUpdateMarks);
router.get('/:studentId', verifyToken, getStudentMarks);
router.get('/exam/:examId', verifyToken, isTeacher, getExamMarks);

export default router;
