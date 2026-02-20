import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchAllCourses } from '../../store/slices/courseSlice';
import { fetchStudentSchedule } from '../../store/slices/studentSlice';
import { useEnrollment } from '../../hooks/useEnrollment';
import { Search, Loader, BookOpen, CheckSquare } from 'lucide-react';
import CourseCard from "../../components/CourseCard/CourseCard.tsx";
import type { EnrolledSection } from '../../types';

const Catalog: React.FC = () => {
    const dispatch = useAppDispatch();
    const { courses, loading, error: coursesError } = useAppSelector((state) => state.courses);
    const { currentStudent, schedule, error: studentError } = useAppSelector((state) => state.student);
    const { enroll } = useEnrollment();
    const studentId = currentStudent?.id ?? 1;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSectionIds, setSelectedSectionIds] = useState<Set<number>>(new Set());
    const [courseTypeFilter, setCourseTypeFilter] = useState<'all' | 'core' | 'elective'>('all');
    const [showOnlyEnrollable, setShowOnlyEnrollable] = useState(false);

    useEffect(() => {
        dispatch(fetchAllCourses(studentId));
        dispatch(fetchStudentSchedule(studentId));
    }, [dispatch, studentId]);

    const enrolledSectionIds = new Set(
        schedule?.enrolledSections.map((e: EnrolledSection) => e.section.id) || []
    );

    const handleEnroll = async (sectionId: number) => {
        await enroll(sectionId);
        dispatch(fetchStudentSchedule(studentId));
        dispatch(fetchAllCourses(studentId));
        setSelectedSectionIds((prev) => {
            const next = new Set(prev);
            next.delete(sectionId);
            return next;
        });
    };

    const handleSelect = (sectionId: number) => {
        setSelectedSectionIds((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    const handleEnrollSelected = async () => {
        const ids = Array.from(selectedSectionIds);
        for (const sectionId of ids) {
            try {
                const response = await enroll(sectionId);
                if (response.success) {
                    setSelectedSectionIds((prev) => {
                        const next = new Set(prev);
                        next.delete(sectionId);
                        return next;
                    });
                }
            } catch {
                // keep processing the rest of selected sections
            }
        }
        dispatch(fetchStudentSchedule(studentId));
        dispatch(fetchAllCourses(studentId));
    };

    // Filtraggio
    const filteredCourses = courses.filter(course => {
        const matchesSearch = searchTerm === '' ||
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = courseTypeFilter === 'all' || course.courseType === courseTypeFilter;
        const matchesEligibility = !showOnlyEnrollable ||
            (course.availableSections?.some((section) => section.canEnroll) ?? false);

        return matchesSearch && matchesType && matchesEligibility;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {(coursesError || studentError) && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                    {coursesError || studentError}
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
                <button
                    onClick={handleEnrollSelected}
                    disabled={selectedSectionIds.size === 0}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckSquare size={16} />
                    <span>Enroll Selected ({selectedSectionIds.size})</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search courses by name or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <select
                        value={courseTypeFilter}
                        onChange={(e) => setCourseTypeFilter(e.target.value as 'all' | 'core' | 'elective')}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="core">Core</option>
                        <option value="elective">Elective</option>
                    </select>

                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={showOnlyEnrollable}
                            onChange={(e) => setShowOnlyEnrollable(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span>Only enrollable</span>
                    </label>

                    {/* Stats */}
                    <div className="flex items-center text-sm text-gray-600">
                        <BookOpen size={16} className="mr-1" />
                        <span>{filteredCourses.length} courses</span>
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500">Try adjusting your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const isEnrolled = course.availableSections?.some(
                            (section) => enrolledSectionIds.has(section.id)
                        ) ?? false;

                        return (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onEnroll={handleEnroll}
                                onSelect={handleSelect}
                                isEnrolled={isEnrolled}
                                selectedSectionIds={selectedSectionIds}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Catalog;
