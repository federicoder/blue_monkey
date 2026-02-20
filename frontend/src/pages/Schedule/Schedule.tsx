import React, { useEffect } from 'react';
import { BookOpen, Loader, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchStudentProfile, fetchStudentSchedule } from '../../store/slices/studentSlice';
import WeeklySchedule from '../../components/Schedule/WeeklySchedule';
import { useEnrollment } from '../../hooks/useEnrollment';

const Schedule: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentStudent, schedule, loading, error } = useAppSelector((state) => state.student);
    const { drop, loading: enrollmentLoading } = useEnrollment();
    const studentId = currentStudent?.id ?? 1;

    useEffect(() => {
        dispatch(fetchStudentProfile(studentId));
        dispatch(fetchStudentSchedule(studentId));
    }, [dispatch, studentId]);

    if (loading || !schedule) {
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
            <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>

            <WeeklySchedule schedule={schedule} />

            <div className="card">
                <h2 className="text-lg font-semibold mb-4">Enrolled Courses</h2>
                <div className="space-y-3">
                    {schedule.enrolledSections.map((enrolled) => (
                        <div key={enrolled.enrollmentId} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <div className="font-medium">{enrolled.section.courseName}</div>
                                <div className="text-sm text-gray-600">
                                    {enrolled.section.sectionCode} • {enrolled.section.timeSlots
                                        .map((slot) => `${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`)
                                        .join(', ')}
                                </div>
                            </div>
                            <button
                                onClick={() => drop(enrolled.section.id)}
                                disabled={enrollmentLoading}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <Trash2 size={16} />
                                <span>Drop</span>
                            </button>
                        </div>
                    ))}
                    {schedule.enrolledSections.length === 0 && (
                        <div className="text-center text-gray-500 py-6">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            No enrolled courses yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schedule;
