import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const res = await api.post('/auth/login', { email, password });
                login(res.data.user, res.data.token);
                if (res.data.user.role === 'teacher' || res.data.user.role === 'admin') {
                    navigate('/teacher');
                } else {
                    navigate('/student');
                }
            } else {
                await api.post('/auth/register', { name, email, password, role: 'student' });
                // After register, auto login
                const res = await api.post('/auth/login', { email, password });
                login(res.data.user, res.data.token);
                navigate('/student');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
                <div className="bg-white/80 backdrop-blur-lg py-8 px-6 shadow-2xl shadow-gray-200/50 rounded-2xl border border-white/50 relative overflow-hidden transition-all duration-300 hover:shadow-primary-500/10 hover:border-primary-100">

                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-110 duration-300 p-2">
                            <img src="/edtech-logo.png" alt="EdTech Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                            {isLogin ? 'Welcome back' : 'Join us today'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isLogin ? 'Enter your details to access your account' : 'Start your learning journey with us'}
                        </p>
                    </div>

                    {/* Form Section */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="relative group">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 ml-1 mb-1">Full Name</label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 sm:text-sm"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1 mb-1">Email address</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 sm:text-sm"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-1 mb-1">Password</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 sm:text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start animate-fade-in">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Login failed</h3>
                                    <div className="mt-1 text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all duration-200 hover:translate-y-[-1px] hover:shadow-primary-500/25 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign in' : 'Create Account'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer / Toggle */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white/80 backdrop-blur px-4 text-gray-500 rounded-full">
                                    {isLogin ? 'New to the platform?' : 'Already registered?'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                                className="text-primary-600 hover:text-primary-500 font-medium text-sm transition-colors duration-200 flex items-center gap-1 group"
                            >
                                {isLogin ? (
                                    <>Create a new account <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" /> </>
                                ) : (
                                    <>Sign in to your account <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" /> </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional branding/info footer */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    &copy; 2025 Edutech Platform. All rights reserved.
                </p>
            </div>
        </div>
    );
};
