import React from 'react';
import { Award, BookOpen, Target } from 'lucide-react';
import type { StudentProfile } from '../../types';

interface ProgressCardProps {
    student: StudentProfile;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ student }) => {
    const progressPercentage = (student.earnedCredits / 30) * 100;

    return (
        <div className="card">
            <h2 className="text-lg font-semibold mb-4">Graduation Progress</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <Award className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {student.gpa.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">GPA</div>
                </div>

                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <BookOpen className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {student.currentCoursesCount}
                    </div>
                    <div className="text-sm text-gray-600">Current Courses</div>
                </div>

                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <Target className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {student.remainingCredits}
                    </div>
                    <div className="text-sm text-gray-600">Credits Needed</div>
                </div>
            </div>

            <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to Graduation</span>
                    <span>{student.earnedCredits}/30 credits</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressCard;
