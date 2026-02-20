import React from 'react';
import { Menu, X, GraduationCap, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleSidebar } from '../../store/slices/uiSlice';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentStudent } = useAppSelector((state) => state.student);
    const { sidebarOpen } = useAppSelector((state) => state.ui);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="flex items-center ml-4">
                            <GraduationCap className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                Maplewood High
              </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <User size={18} />
                            <span>{currentStudent?.firstName} {currentStudent?.lastName}</span>
                            <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                Grade {currentStudent?.gradeLevel}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
