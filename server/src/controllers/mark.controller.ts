import { Request, Response } from 'express';
import Result from '../models/Result';
import Exam from '../models/Exam';

export const addOrUpdateMarks = async (req: Request, res: Response) => {
    try {
        const { examId, studentId, marks } = req.body;

        // Check if result exists
        let result = await Result.findOne({ exam: examId, student: studentId });

        if (result) {
            result.marks = marks;
            await result.save();
        } else {
            result = new Result({
                exam: examId,
                student: studentId,
                marks
            });
            await result.save();
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentMarks = async (req: Request, res: Response) => {
    try {
        // If student, use their ID from token (middleware would attach it to req.user)
        // For now assuming we pass studentId or it's form req.user
        // But let's support querying by studentId
        const { studentId } = req.params;

        // We want to return list of exams with marks
        const results = await Result.find({ student: studentId as any }).populate('exam');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getExamMarks = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const results = await Result.find({ exam: examId }).populate('student', 'name email');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
