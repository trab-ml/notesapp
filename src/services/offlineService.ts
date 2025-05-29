import { enableNetwork, disableNetwork } from "firebase/firestore";
import { db } from "../firebase/firebase";

class OfflineService {
    private isNetworkEnabled = true;

    async enableOfflineMode() {
        if (this.isNetworkEnabled) {
            try {
                await disableNetwork(db);
                this.isNetworkEnabled = false;
                console.log("Mode offline activé");
            } catch (error) {
                console.error("Erreur lors de l'activation du mode offline:", error);
            }
        }
    }

    async enableOnlineMode() {
        if (!this.isNetworkEnabled) {
            try {
                await enableNetwork(db);
                this.isNetworkEnabled = true;
                console.log('Mode online activé');
            } catch (error) {
                console.error("Erreur lors de l'activation du mode online:", error);
            }
        }
    }

    getNetworkStatus() {
        return this.isNetworkEnabled;
    }
}

export const offlineService = new OfflineService();