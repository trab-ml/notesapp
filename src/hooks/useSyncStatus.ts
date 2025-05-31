import { useState, useEffect } from 'react';
import { notesService } from '../services/notesService';
import { SyncStatus } from '../services/baseNotesService';

export const useSyncStatus = () => {
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

    useEffect(() => {
        const unsubscribe = notesService.onSyncStatusChange(setSyncStatus);
        return unsubscribe;
    }, []);

    return {
        syncStatus,
        isOnline: syncStatus !== 'offline',
        pendingOperationsCount: notesService.getPendingOperationsCount()
    };
};