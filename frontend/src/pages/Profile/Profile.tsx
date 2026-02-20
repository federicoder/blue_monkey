import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchStudentProfile, fetchStudentSchedule } from '../../store/slices/studentSlice';
import { fetchAvailableSections } from '../../store/slices/courseSlice';
import { User, Award, BookOpen, Clock, TrendingUp, Download } from 'lucide-react';

const REQUIRED_CREDITS = 30;

const Profile: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentStudent, schedule, loading, error } = useAppSelector((state) => state.student);
    const [activeTab, setActiveTab] = useState<'overview' | 'grades'>('overview');

    const studentId = currentStudent?.id ?? 1;

    useEffect(() => {
        dispatch(fetchStudentProfile(studentId));
        dispatch(fetchStudentSchedule(studentId));
        dispatch(fetchAvailableSections(studentId));
    }, [dispatch, studentId]);

    if (loading || !currentStudent || !schedule) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const totalCourses = schedule.enrolledSections.length;

    const totalCredits = schedule.enrolledSections.reduce<number>(
        (sum, enrolled) => sum + (enrolled.section.courseCredits || 0),
        0
    );

    const progressPercentage = Math.min(100, (currentStudent.earnedCredits / REQUIRED_CREDITS) * 100);

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

            </div>

            {/* Profile Header Card */}
            <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-black">
                <div className="flex items-center space-x-6">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
                        <User size={48} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold">{currentStudent.firstName} {currentStudent.lastName}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className="bg-primary-500 px-3 py-1 rounded-full text-sm">
                                Grade {currentStudent.gradeLevel}
                            </span>
                            <span className="bg-primary-500 px-3 py-1 rounded-full text-sm">
                                ID: {currentStudent.id}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{currentStudent.gpa.toFixed(2)}</div>
                        <div className="text-primary-200">GPA</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{currentStudent.earnedCredits}</div>
                        <div className="text-sm text-gray-600">Credits Earned</div>
                    </div>
                </div>

                <div className="card flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{currentStudent.remainingCredits}</div>
                        <div className="text-sm text-gray-600">Credits Needed</div>
                    </div>
                </div>

                <div className="card flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{totalCourses}</div>
                        <div className="text-sm text-gray-600">Current Courses</div>
                    </div>
                </div>

                <div className="card flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{totalCredits}</div>
                        <div className="text-sm text-gray-600">Current Credits</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'grades'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Grades History
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Personal Information */}
                        <div className="lg:col-span-2 card">
                            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Full Name</label>
                                    <p className="font-medium">{currentStudent.firstName} {currentStudent.lastName}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Student ID</label>
                                    <p className="font-medium">{currentStudent.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Grade Level</label>
                                    <p className="font-medium">Grade {currentStudent.gradeLevel}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="font-medium">
                                        {currentStudent.firstName.toLowerCase()}.{currentStudent.lastName.toLowerCase()}@maplewood.edu
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Graduation Progress */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Graduation Progress</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Progress to Graduation</span>
                                        <span>{currentStudent.earnedCredits}/{REQUIRED_CREDITS} credits</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Required Credits:</span>
                                        <span className="font-medium">{REQUIRED_CREDITS}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-gray-600">Earned Credits:</span>
                                        <span className="font-medium">{currentStudent.earnedCredits}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-gray-600">Remaining:</span>
                                        <span className="font-medium">{currentStudent.remainingCredits}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'grades' && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Grade History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="text-sm text-gray-500">Current GPA</div>
                                <div className="text-2xl font-semibold text-gray-900">{currentStudent.gpa.toFixed(2)}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="text-sm text-gray-500">Earned Credits</div>
                                <div className="text-2xl font-semibold text-gray-900">{currentStudent.earnedCredits}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="text-sm text-gray-500">Credits Remaining</div>
                                <div className="text-2xl font-semibold text-gray-900">{currentStudent.remainingCredits}</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;
