// Student Types
export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    gradeLevel: number;
}

export interface StudentProfile {
    id: number;
    firstName: string;
    lastName: string;
    gradeLevel: number;
    gpa: number;
    earnedCredits: number;
    remainingCredits: number;
    currentCoursesCount: number;
}

// Course Types
export interface Course {
    id: number;
    code: string;
    name: string;
    description: string;
    credits: number;
    hoursPerWeek?: number;
    courseType: 'core' | 'elective';
    gradeLevelMin: number;
    gradeLevelMax: number;
    semesterOrder: 1 | 2; // 1=Fall, 2=Spring
    prerequisite?: Course;
    specializationId?: number;
    availableSections?: CourseSection[];
}

export interface TimeSlot {
    id: number;
    courseName?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
}

export interface CourseSection {
    id: number;
    courseId: number;
    courseName: string;
    sectionCode: string;
    semester: string;
    academicYear?: number;
    timeSlots: TimeSlot[];
    enrolledCount: number;
    maxCapacity: number;
    courseCredits: number;
    hasAvailability: boolean;
    canEnroll: boolean;
    blockingReasons: string[];
}

// Semester Types
export interface Semester {
    id: number;
    name: string;
    year: number;
    orderInYear: 1 | 2;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

// Enrollment Types
export interface EnrollmentRequest {
    studentId: number;
    sectionId: number;
}

export interface EnrollmentResponse {
    success: boolean;
    message: string;
    request: EnrollmentRequest;
    errors?: string[];
    updatedStudentProfile?: StudentProfile;
}

// Schedule Types
export interface EnrolledSection {
    enrollmentId: number;
    section: CourseSection;
    enrollmentDate: string;
}

export interface Schedule {
    studentId: number;
    studentName: string;
    enrolledSections: EnrolledSection[];
    weeklySchedule: Record<string, TimeSlot[]>;
}

// Filter Types
export interface CourseFilters {
    courseType?: 'core' | 'elective';
    minCredits?: number;
    specializationId?: number;
    searchTerm?: string;
    semesterOrder?: 1 | 2;
}
