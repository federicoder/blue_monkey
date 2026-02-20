import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { removeNotification } from '../../store/slices/uiSlice';

const NotificationToast: React.FC = () => {
    const dispatch = useAppDispatch();
    const { notifications } = useAppSelector((state) => state.ui);

    useEffect(() => {
        const timers = notifications.map((notification) =>
            setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, 5000)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [notifications, dispatch]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-400" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
            default:
                return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    const getStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`flex items-center p-4 rounded-lg border shadow-lg ${getStyles(notification.type)}`}
                >
                    {getIcon(notification.type)}
                    <p className="ml-3 text-sm font-medium text-gray-900">{notification.message}</p>
                    <button
                        onClick={() => dispatch(removeNotification(notification.id))}
                        className="ml-4 text-gray-400 hover:text-gray-500"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
