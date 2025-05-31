import { db } from "../firebase/firebase";
import { enableNetwork, disableNetwork } from "firebase/firestore";
import { uid } from "uid/secure";

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export interface PendingOperation {
    id: string;
    type: 'create' | 'update' | 'delete' | 'share' | 'unshare' | 'favorite';
    noteId?: string;
    data?: unknown;
    timestamp: number;
}

export class BaseNotesService {
    protected isOnline = true;
    protected isNetworkEnabled = true;
    protected pendingOperations: PendingOperation[] = [];
    protected syncStatusCallbacks = new Set<(status: SyncStatus) => void>();
    protected retryTimeout: NodeJS.Timeout | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', this.handleOnline.bind(this));
            window.addEventListener('offline', this.handleOffline.bind(this));
            this.isOnline = navigator.onLine;
        }
    }

    protected handleOnline() {
        this.isOnline = true;
        this.processPendingOperations();
    }

    protected handleOffline() {
        this.isOnline = false;
        this.notifySyncStatus('offline');
    }

    protected notifySyncStatus(status: SyncStatus) {
        this.syncStatusCallbacks.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.error('Erreur callback sync status:', error);
            }
        });
    }

    onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
        this.syncStatusCallbacks.add(callback);
        callback(this.getCurrentSyncStatus());

        return () => {
            this.syncStatusCallbacks.delete(callback);
        };
    }

    protected getCurrentSyncStatus(): SyncStatus {
        if (!this.isOnline) return 'offline';
        if (this.pendingOperations.length > 0) return 'syncing';
        return 'synced';
    }

    protected addPendingOperation(operation: Omit<PendingOperation, 'id' | 'timestamp'>) {
        const pendingOp: PendingOperation = {
            ...operation,
            id: uid(),
            timestamp: Date.now()
        };
        this.pendingOperations.push(pendingOp);
        this.notifySyncStatus('syncing');
        if (this.isOnline) {
            this.processPendingOperations();
        }
    }

    protected async processPendingOperations() {
        if (!this.isOnline || this.pendingOperations.length === 0) return;

        this.notifySyncStatus('syncing');
        const operationsToProcess = [...this.pendingOperations];

        for (const operation of operationsToProcess) {
            try {
                await this.executeOperation(operation);
                this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
            } catch (error) {
                console.error("Erreur lors de l'exécution de l'opération:", error);
                this.scheduleRetry();
                break;
            }
        }

        this.notifySyncStatus(this.getCurrentSyncStatus());
    }

    private scheduleRetry() {
        if (this.retryTimeout) clearTimeout(this.retryTimeout);

        this.retryTimeout = setTimeout(() => {
            if (this.isOnline && this.pendingOperations.length > 0) {
                this.processPendingOperations();
            }
        }, 5000);
    }

    protected async executeOperation(operation: PendingOperation): Promise<void> {
        throw new Error("La méthode executeOperation() doit être surchargée par la sous-classe");
    }

    static async initializeOfflineSupport() {
        try {
            await enableNetwork(db);
            console.log("Cache offline Firebase initialisé");
        } catch (error) {
            console.error("Erreur initialisation cache offline:", error);
        }
    }

    async setNetworkEnabled(enabled: boolean) {
        if (this.isNetworkEnabled === enabled) return;

        try {
            if (enabled) {
                await enableNetwork(db);
                this.isNetworkEnabled = true;
            } else {
                this.cleanup?.();
                await disableNetwork(db);
                this.isNetworkEnabled = false;
            }
        } catch (error) {
            console.error("Erreur changement état réseau:", error);
        }
    }

    protected async executeWithOfflineSupport<T>(
        operation: () => Promise<T>,
        fallback?: () => T | Promise<T>
    ): Promise<T> {
        if (!this.isOnline && fallback) {
            return await fallback();
        }

        if (!this.isOnline) {
            throw new Error("Opération non disponible hors ligne");
        }

        try {
            return await operation();
        } catch (error) {
            if (fallback) return await fallback();
            throw error;
        }
    }

    getPendingOperationsCount(): number {
        return this.pendingOperations.length;
    }

    public clearPendingOperations(): void {
        this.pendingOperations = [];
        this.notifySyncStatus(this.getCurrentSyncStatus());
    }

    protected cleanup?(): void;

    protected destroy() {
        this.cleanup?.();
        this.syncStatusCallbacks.clear();
        
        if (typeof window !== 'undefined') {
            window.removeEventListener('online', this.handleOnline.bind(this));
            window.removeEventListener('offline', this.handleOffline.bind(this));
        }
    }
}
