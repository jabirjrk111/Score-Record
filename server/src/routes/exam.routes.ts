import express from 'express';
import { createExam, getExams, addSubjectToExam, updateExam, deleteExam, getExamById } from '../controllers/exam.controller';
import { verifyToken, isTeacher } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', verifyToken, isTeacher, createExam);
router.get('/', verifyToken, getExams); // Students can also see exams
router.post('/:examId/subjects', verifyToken, isTeacher, addSubjectToExam);
router.put('/:examId', verifyToken, isTeacher, updateExam);
router.delete('/:examId', verifyToken, isTeacher, deleteExam);
router.get('/:examId', verifyToken, getExamById);

export default router;
