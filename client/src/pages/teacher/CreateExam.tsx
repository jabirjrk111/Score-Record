import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export const CreateExam = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [subjects, setSubjects] = useState<{ name: string, maxMarks: number }[]>([{ name: '', maxMarks: 100 }]);
    const [loading, setLoading] = useState(false);

    const handleSubjectChange = (index: number, field: 'name' | 'maxMarks', value: string | number) => {
        const newSubjects = [...subjects];
        newSubjects[index] = { ...newSubjects[index], [field]: value };
        setSubjects(newSubjects);
    };

    const addSubject = () => {
        setSubjects([...subjects, { name: '', maxMarks: 100 }]);
    };

    const removeSubject = (index: number) => {
        const newSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(newSubjects);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/exams', { name, examDate: date, subjects });
            navigate('/teacher');
        } catch (error) {
            console.error(error);
            alert('Failed to create exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Exam</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <Input
                    label="Exam Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Mid Term 2024"
                    required
                />

                <Input
                    label="Exam Date"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Subjects</label>
                        <Button type="button" size="sm" variant="outline" onClick={addSubject} className="gap-1">
                            <Plus size={14} /> Add Subject
                        </Button>
                    </div>

                    {subjects.map((subject, index) => (
                        <div key={index} className="flex gap-4 items-end bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                                <Input
                                    placeholder="Subject Name"
                                    value={subject.name}
                                    onChange={e => handleSubjectChange(index, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-24">
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={subject.maxMarks}
                                    onChange={e => handleSubjectChange(index, 'maxMarks', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            {subjects.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeSubject(index)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate('/teacher')}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Exam'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
