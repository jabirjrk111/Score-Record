import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, LogOut, PlusCircle, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Sub-pages
import { ExamsList } from './teacher/ExamsList';
import { CreateExam } from './teacher/CreateExam';
import { EnterMarks } from './teacher/EnterMarks';

export const TeacherDashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="text-primary-600" />
                        Teacher Portal
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Welcome, {user?.name}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/teacher">
                        <Button variant={isActive('/teacher') ? 'primary' : 'ghost'} className="w-full justify-start gap-2">
                            <FileText size={18} />
                            Exams
                        </Button>
                    </Link>
                    <Link to="/teacher/create-exam">
                        <Button variant={isActive('/teacher/create-exam') ? 'primary' : 'ghost'} className="w-full justify-start gap-2">
                            <PlusCircle size={18} />
                            Create Exam
                        </Button>
                    </Link>
                    <Link to="/teacher/enter-marks">
                        <Button variant={isActive('/teacher/enter-marks') ? 'primary' : 'ghost'} className="w-full justify-start gap-2">
                            <UserCheck size={18} />
                            Enter Marks
                        </Button>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Mobile Header */}
            {/* ... (Skipping complex mobile nav for brevity, but would add hamburger here) */}

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<ExamsList />} />
                    <Route path="/create-exam" element={<CreateExam />} />
                    <Route path="/enter-marks" element={<EnterMarks />} />
                </Routes>
            </div>
        </div>
    );
};
