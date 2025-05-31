import React from 'react';
import { useSyncStatus } from '../../hooks/useSyncStatus';

interface NetworkStatusIndicatorProps {
    showDetailedMessages?: boolean;
    notesCount?: number;
    className?: string;
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
    showDetailedMessages = false,
    notesCount = 0,
    className = ""
}) => {
    const { syncStatus, isOnline } = useSyncStatus();

    const getStatus = () => {
        if (!isOnline) {
            return {
                color: 'bg-red-500',
                text: 'Hors ligne',
                icon: '⚡'
            };
        }
        
        switch (syncStatus) {
            case 'syncing':
                return {
                    color: 'bg-yellow-500',
                    text: 'Synchronisation...',
                    icon: '🔄'
                };
            case 'error':
                return {
                    color: 'bg-red-500',
                    text: 'Erreur',
                    icon: '⚠️'
                };
            default:
                return {
                    color: 'bg-green-500',
                    text: 'En ligne',
                    icon: '✓'
                };
        }
    };

    const getDetailedMessage = () => {
        if (!showDetailedMessages) return null;
        
        if (!isOnline) {
            return notesCount === 0 
                ? "Connectez-vous pour voir vos notes"
                : "Mode hors ligne - changements synchronisés à la reconnexion";
        }
        
        if (syncStatus === 'syncing') return "Synchronisation...";
        if (syncStatus === 'error') return "Erreur de connexion";
        
        return null;
    };

    const status = getStatus();
    const message = getDetailedMessage();

    return (
        <div className={className}>
            <div className={`inline-flex items-center px-2 py-1 rounded text-xs text-white ${status.color}`}>
                <span className="mr-1">{status.icon}</span>
                {status.text}
            </div>
            
            {message && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700">
                    {message}
                </div>
            )}
        </div>
    );
};