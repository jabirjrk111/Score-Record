import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { LogOut, GraduationCap, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const StudentDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!user) return;
            try {
                const res = await api.get(`/marks/${user.id}`);
                setResults(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const downloadPDF = (result: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(14, 165, 233); // Primary color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Student Report Card", 105, 25, { align: 'center' });

        // Student Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Student Name: ${user?.name}`, 14, 50);
        doc.text(`Exam: ${result.exam.name}`, 14, 58);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 66);

        // Marks Table
        const tableBody: any[] = Object.entries(result.marks).map(([subject, marks]) => [subject, marks]);

        autoTable(doc, {
            startY: 75,
            head: [['Subject', 'Marks Obtained']],
            body: tableBody,
            headStyles: { fillColor: [14, 165, 233] },
            alternateRowStyles: { fillColor: [240, 249, 255] }
        });

        // Footer
        const totalMarks = Object.values(result.marks).reduce((a: any, b: any) => a + b, 0);
        doc.text(`Total Marks: ${totalMarks}`, 14, (doc as any).lastAutoTable.finalY + 10);

        doc.save(`${user?.name}_${result.exam.name}_Report.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-primary-600" size={32} />
                        <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Exam Results</h2>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((result) => (
                            <div key={result._id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{result.exam.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                Exam Date: {new Date(result.exam.examDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                                            Result
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {Object.entries(result.marks).slice(0, 3).map(([subject, marks]: any) => (
                                            <div key={subject} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{subject}</span>
                                                <span className="font-semibold text-gray-900">{marks}</span>
                                            </div>
                                        ))}
                                        {Object.keys(result.marks).length > 3 && (
                                            <p className="text-xs text-gray-400 italic">...and {Object.keys(result.marks).length - 3} more</p>
                                        )}
                                    </div>

                                    <Button onClick={() => downloadPDF(result)} className="w-full gap-2" variant="secondary">
                                        <Download size={18} />
                                        Download PDF Report
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && results.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No results found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
