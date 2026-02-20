import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, User } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

const Sidebar: React.FC = () => {
    const { sidebarOpen } = useAppSelector((state) => state.ui);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Course Catalog', href: '/catalog', icon: BookOpen },
        { name: 'My Schedule', href: '/schedule', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    if (!sidebarOpen) return null;

    return (
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-100vh">
            <nav className="mt-5 px-2">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                                isActive
                                    ? 'bg-primary-100 text-primary-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon
                            className="mr-3 h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                        />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
