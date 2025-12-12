import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ExamMarks = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState<any[]>([]);
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examRes, marksRes] = await Promise.all([
                    api.get(`/exams/${examId}`),
                    api.get(`/marks/exam/${examId}`)
                ]);
                setExam(examRes.data);
                setResults(marksRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [examId]);

    const downloadFullReport = () => {
        const doc = new jsPDF();

        doc.setFillColor(14, 165, 233);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(`Exam Report: ${exam?.name}`, 14, 20);

        const tableBody = results.map(result => {
            const studentName = result.student?.name || 'Unknown';
            const totalMarks = Object.values(result.marks).reduce((a: any, b: any) => a + b, 0);
            const marksStr = Object.entries(result.marks)
                .map(([subject, mark]) => `${subject}: ${mark}`)
                .join(', ');

            return [studentName, marksStr, totalMarks];
        });

        autoTable(doc, {
            startY: 40,
            head: [['Student Name', 'Marks Breakdown', 'Total']],
            body: tableBody,
            headStyles: { fillColor: [14, 165, 233] },
        });

        doc.save(`${exam?.name}_Full_Report.pdf`);
    };

    if (loading) return <div>Loading...</div>;
    if (!exam) return <div>Exam not found</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => navigate('/teacher')} className="p-2">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{exam.name} - Marks</h2>
                    <p className="text-gray-500">Date: {new Date(exam.examDate).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto">
                    <Button onClick={downloadFullReport} className="gap-2">
                        <Download size={18} />
                        Download Report
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                {exam.subjects.map((sub: any) => (
                                    <th key={sub._id} className="px-6 py-4">{sub.name} (/{sub.maxMarks})</th>
                                ))}
                                <th className="px-6 py-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {results.map((result) => {
                                const marks = result.marks as Record<string, number>;
                                const total = Object.values(marks).reduce((a, b) => a + b, 0);
                                return (
                                    <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {result.student?.name}
                                            <div className="text-xs text-gray-500 font-normal">{result.student?.email}</div>
                                        </td>
                                        {exam.subjects.map((sub: any) => (
                                            <td key={sub._id} className="px-6 py-4">
                                                {marks[sub.name] !== undefined ? (marks[sub.name] as React.ReactNode) : '-'}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 font-bold text-primary-600">{total}</td>
                                    </tr>
                                );
                            })}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={exam.subjects.length + 2} className="px-6 py-12 text-center text-gray-500">
                                        No marks entered for this exam yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
