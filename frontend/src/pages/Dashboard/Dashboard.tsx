import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchStudentProfile, fetchStudentSchedule } from '../../store/slices/studentSlice.ts';
import { fetchAvailableSections } from '../../store/slices/courseSlice';
import ProgressCard from '../../components/StudentInfo/ProgressCard';
import WeeklySchedule from '../../components/Schedule/WeeklySchedule';
import { Loader } from 'lucide-react';

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentStudent, schedule, loading, error } = useAppSelector((state) => state.student);
    const studentId = currentStudent?.id ?? 1;

    useEffect(() => {
        dispatch(fetchStudentProfile(studentId));
        dispatch(fetchStudentSchedule(studentId));
        dispatch(fetchAvailableSections(studentId));
    }, [dispatch, studentId]);

    if (loading || !currentStudent || !schedule) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ProgressCard student={currentStudent} />
                </div>

                <div className="lg:col-span-2">
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-2">Welcome back, {currentStudent.firstName}!</h2>
                        <p className="text-gray-600">
                            You are currently enrolled in {currentStudent.currentCoursesCount} courses this semester.
                            You need {currentStudent.remainingCredits} more credits to graduate.
                        </p>
                    </div>
                </div>
            </div>

            <WeeklySchedule schedule={schedule} />
        </div>
    );
};

export default Dashboard;
