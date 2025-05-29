import React from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface NetworkStatusIndicatorProps {
    syncStatus?: 'synced' | 'syncing' | 'offline';
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({ 
    syncStatus = 'synced' 
}) => {
    const isOnline = useNetworkStatus();

    const getStatusInfo = () => {
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
            case 'offline':
                return {
                    color: 'bg-orange-500',
                    text: 'Données locales',
                    icon: '💾'
                };
            default:
                return {
                    color: 'bg-green-500',
                    text: 'Synchronisé',
                    icon: '✓'
                };
        }
    };

    const status = getStatusInfo();

    return (
        <div className={`max-w-fit mt-2 flex items-center space-x-2 px-3 rounded-full ${status.color} text-white text-sm`}>
            <span>{status.icon}</span>
            <span>{status.text}</span>
        </div>
    );
};