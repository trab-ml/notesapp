import React from 'react';

interface EmptyStateProps {
    message: string;
    actionText?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    message, 
    actionText, 
    onAction 
}) => {
    return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">{message}</p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};