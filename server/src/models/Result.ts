import mongoose, { Document, Schema } from 'mongoose';

export interface IResult extends Document {
    student: mongoose.Schema.Types.ObjectId;
    exam: mongoose.Schema.Types.ObjectId;
    marks: Map<string, number>; // key: Subject Name, value: Marks Obtained
}

const ResultSchema: Schema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    marks: {
        type: Map,
        of: Number,
        required: true
    }
}, { timestamps: true });

// Prevent duplicate results for same student+exam
ResultSchema.index({ student: 1, exam: 1 }, { unique: true });

export default mongoose.model<IResult>('Result', ResultSchema);
