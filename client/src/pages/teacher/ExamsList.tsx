import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const ExamsList = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get('/exams');
                setExams(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (loading) return <div>Loading exams...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Exams</h2>
                    <p className="text-gray-500">Manage exams and view details.</p>
                </div>
                <Link to="/teacher/create-exam">
                    <Button className="gap-2">
                        <Plus size={18} />
                        New Exam
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {exams.map((exam) => (
                    <div key={exam._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">{exam.name}</h3>
                            <p className="text-sm text-gray-500">
                                Date: {new Date(exam.examDate).toLocaleDateString()}
                            </p>
                            <div className="mt-2 flex gap-2">
                                {exam.subjects.map((sub: any) => (
                                    <span key={sub._id} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                        {sub.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Maybe add action buttons here later */}
                    </div>
                ))}
                {exams.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No exams found. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
