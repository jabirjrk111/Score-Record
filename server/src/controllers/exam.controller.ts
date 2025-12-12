import { Request, Response } from 'express';
import Exam from '../models/Exam';

export const createExam = async (req: Request, res: Response) => {
    try {
        const { name, examDate, subjects } = req.body;
        const newExam = new Exam({ name, examDate, subjects: subjects || [] });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getExams = async (req: Request, res: Response) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const addSubjectToExam = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const { name, maxMarks } = req.body;
        const exam = await Exam.findById(examId);
        if (!exam) {
            res.status(404).json({ message: 'Exam not found' });
            return;
        }
        exam.subjects.push({ name, maxMarks });
        await exam.save();
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
