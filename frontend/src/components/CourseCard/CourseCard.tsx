import React, { useState } from 'react';
import { Clock, Users, BookOpen, ChevronDown, ChevronUp, Calendar, Award } from 'lucide-react';
import { useEnrollment } from '../../hooks/useEnrollment.ts';
import type {Course} from "../../types";

interface CourseCardProps {
    course: Course;
    onEnroll: (sectionId: number) => void;
    onSelect: (sectionId: number) => void;
    isEnrolled?: boolean;
    selectedSectionIds: Set<number>;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onSelect, isEnrolled, selectedSectionIds }) => {
    const [expanded, setExpanded] = useState(false);
    const { loading } = useEnrollment();

    const getDepartmentFromCode = (code: string) => {
        if (code.startsWith('MATH')) return 'Mathematics';
        if (code.startsWith('ENG')) return 'English';
        if (code.startsWith('SCI')) return 'Science';
        if (code.startsWith('HIST')) return 'History';
        if (code.startsWith('ART')) return 'Arts';
        return 'Other';
    };

    const getDepartmentColor = (code: string) => {
        const colors: Record<string, string> = {
            'MATH': 'bg-blue-100 text-blue-800',
            'ENG': 'bg-purple-100 text-purple-800',
            'SCI': 'bg-green-100 text-green-800',
            'HIST': 'bg-yellow-100 text-yellow-800',
            'ART': 'bg-pink-100 text-pink-800',
        };
        const prefix = code.substring(0, 4);
        return colors[prefix] || 'bg-gray-100 text-gray-800';
    };

    const semesterName = course.semesterOrder === 1 ? 'Fall' : 'Spring';

    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.code}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(course.code)}`}>
          {getDepartmentFromCode(course.code)}
        </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                    <Award size={16} className="mr-1" />
                    <span>{course.credits} credits</span>
                </div>
                <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{semesterName}</span>
                </div>
                <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>Grades {course.gradeLevelMin}-{course.gradeLevelMax}</span>
                </div>
                <div className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    <span>{course.courseType}</span>
                </div>
            </div>

            {course.prerequisite && (
                <div className="mb-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span className="ml-1">Prerequisite: {course.prerequisite.code}</span>
                    </button>

                    {expanded && (
                        <div className="mt-2 ml-6 p-2 bg-gray-50 rounded text-sm text-gray-600">
                            <p className="font-medium">{course.prerequisite.name}</p>
                            <p className="text-xs mt-1">{course.prerequisite.description}</p>
                        </div>
                    )}
                </div>
            )}

            {course.availableSections && course.availableSections.length > 0 && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Available Sections</h4>
                    <div className="space-y-2">
                        {course.availableSections.map((section) => (
                            <div key={section.id} className="flex items-center justify-between text-sm p-2 border rounded hover:bg-gray-50">
                                <div>
                                    <span className="font-medium">{section.sectionCode}</span>
                                    <div className="flex items-center text-gray-500 mt-1">
                                        <Clock size={14} className="mr-1" />
                                        <span>
                      {section.timeSlots.map(slot =>
                          `${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`
                      ).join(', ')}
                    </span>
                                    </div>
                                    {section.blockingReasons?.length > 0 && (
                                        <div className="mt-1 text-xs text-amber-700">
                                            {section.blockingReasons.join(' • ')}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3">
                  <span className={`text-xs ${section.hasAvailability ? 'text-green-600' : 'text-red-600'}`}>
                    {section.enrolledCount}/{section.maxCapacity}
                  </span>
                                    <button
                                        onClick={() => onSelect(section.id)}
                                        disabled={!section.canEnroll || isEnrolled}
                                        className={`px-3 py-1 text-xs rounded border ${
                                            selectedSectionIds.has(section.id)
                                                ? 'bg-primary-100 text-primary-800 border-primary-300'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {selectedSectionIds.has(section.id) ? 'Selected' : 'Select'}
                                    </button>
                                    <button
                                        onClick={() => onEnroll(section.id)}
                                        disabled={!section.canEnroll || isEnrolled || loading}
                                        className="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isEnrolled ? 'Enrolled' : 'Enroll'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseCard;
