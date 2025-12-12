import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Pencil, Trash2, Eye } from 'lucide-react';

export const ExamsList = () => {
    const navigate = useNavigate();
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

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;
        try {
            await api.delete(`/exams/${id}`);
            setExams(exams.filter(exam => exam._id !== id));
        } catch (err) {
            console.error('Failed to delete exam', err);
            alert('Failed to delete exam');
        }
    };

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
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50" onClick={() => navigate(`/teacher/exam-marks/${exam._id}`)} title="View Marks">
                                <Eye size={18} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => navigate(`/teacher/edit-exam/${exam._id}`)}>
                                <Pencil size={18} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(exam._id)}>
                                <Trash2 size={18} />
                            </Button>
                        </div>
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
