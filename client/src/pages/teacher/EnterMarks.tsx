import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const EnterMarks = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const [marks, setMarks] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examsRes, studentsRes] = await Promise.all([
                    api.get('/exams'),
                    api.get('/auth/students')
                ]);
                setExams(examsRes.data);
                setStudents(studentsRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const selectedExam = exams.find(e => e._id === selectedExamId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        try {
            await api.post('/marks', {
                examId: selectedExamId,
                studentId: selectedStudentId,
                marks
            });
            setSuccess('Marks saved successfully!');
            // Reset maybe?
        } catch (error) {
            console.error(error);
            alert('Error saving marks');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Student Marks</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={selectedExamId}
                        onChange={e => {
                            setSelectedExamId(e.target.value);
                            setMarks({});
                        }}
                        required
                    >
                        <option value="">Select an exam...</option>
                        {exams.map(exam => (
                            <option key={exam._id} value={exam._id}>{exam.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={selectedStudentId}
                        onChange={e => setSelectedStudentId(e.target.value)}
                        required
                    >
                        <option value="">Select a student...</option>
                        {students.map(student => (
                            <option key={student._id} value={student._id}>{student.name} ({student.email})</option>
                        ))}
                    </select>
                </div>

                {selectedExam && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="font-medium text-gray-900">Enter Marks</h3>
                        {selectedExam.subjects.map((subject: any) => (
                            <div key={subject._id} className="flex items-center justify-between">
                                <label className="text-sm text-gray-600 w-1/3">{subject.name} (Max: {subject.maxMarks})</label>
                                <Input
                                    type="number"
                                    className="w-full"
                                    value={marks[subject.name] || ''}
                                    max={subject.maxMarks}
                                    onChange={e => setMarks({ ...marks, [subject.name]: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                )}

                {success && <div className="text-green-600 bg-green-50 p-3 rounded">{success}</div>}

                <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={loading || !selectedExam || !selectedStudentId}>
                        {loading ? 'Saving...' : 'Save Marks'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
