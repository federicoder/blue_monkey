import React from 'react';
import { Clock } from 'lucide-react';
import type { Schedule, TimeSlot } from '../../types';

interface WeeklyScheduleProps {
    schedule: Schedule;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule }) => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

    const getCourseForTimeSlot = (day: string, time: string) => {
        const slots = schedule.weeklySchedule[day] || [];
        return slots.find((slot: TimeSlot) => {
            const slotHour = parseInt(slot.startTime.split(':')[0]);
            const timeHour = parseInt(time.split(':')[0]);
            return slotHour === timeHour;
        });
    };

    return (
        <div className="card overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>

            <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-6 gap-1 mb-1">
                    <div className="p-2"></div>
                    {days.map(day => (
                        <div key={day} className="p-2 text-center font-medium text-gray-700">
                            {day.charAt(0) + day.slice(1).toLowerCase()}
                        </div>
                    ))}
                </div>

                {/* Time slots */}
                {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-6 gap-1 mb-1">
                        <div className="p-2 text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {time}
                        </div>

                        {days.map(day => {
                            const course = getCourseForTimeSlot(day, time);
                            return (
                                <div
                                    key={`${day}-${time}`}
                                    className={`p-2 min-h-[60px] rounded ${
                                        course
                                            ? 'bg-primary-100 border border-primary-200'
                                            : 'bg-gray-50'
                                    }`}
                                >
                                    {course && (
                                        <div className="text-xs">
                                            <div className="font-medium text-primary-800">
                                                {course.courseName}
                                            </div>
                                            <div className="text-primary-600">
                                                {course.roomNumber}
                                            </div>
                                            <div className="text-primary-600">
                                                {course.startTime}-{course.endTime}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;
