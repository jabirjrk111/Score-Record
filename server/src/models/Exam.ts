import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject {
    name: string;
    maxMarks: number;
}

export interface IExam extends Document {
    name: string;
    examDate: Date;
    subjects: ISubject[];
}

const SubjectSchema = new Schema({
    name: { type: String, required: true },
    maxMarks: { type: Number, required: true }
});

const ExamSchema: Schema = new Schema({
    name: { type: String, required: true },
    examDate: { type: Date, required: true },
    subjects: [SubjectSchema]
}, { timestamps: true });

export default mongoose.model<IExam>('Exam', ExamSchema);
