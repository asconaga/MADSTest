import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS_KEY = 'MADS-STATUS';

const INITIAL_STATUSES = {
    1: { statusId: 1, name: 'draft' },
    2: { statusId: 2, name: 'published' },
    3: { statusId: 3, name: 'archived' },
    4: { statusId: 4, name: 'new' },
    5: { statusId: 5, name: 'stored' },
    6: { statusId: 6, name: 'saved' },
};

/**
 * Seed AsyncStorage with INITIAL_STATUSES if none exist yet.
 * Call this once at app startup (e.g. in your root component).
 */
export async function initializeStatus() {
    try {
        const existing = await AsyncStorage.getItem(STATUS_KEY);
        if (existing == null) {
            await AsyncStorage.setItem(STATUS_KEY, JSON.stringify(INITIAL_STATUSES));
        }
    } catch (error) {
        console.error('Error initializing statuses', error);
        throw error;
    }
}

/**
 * Fetches the entire statuses map from AsyncStorage.
 * @returns {Promise<Record<number, { statusId: number; name: string }>>}
 */
async function _getStatusesMap() {
    try {
        const json = await AsyncStorage.getItem(STATUS_KEY);
        // If for some reason it’s missing, fall back to the initial map
        return json != null ? JSON.parse(json) : INITIAL_STATUSES;
    } catch (error) {
        console.error('Error reading statuses from storage', error);
        throw error;
    }
}

/**
 * Reads a status by ID.
 * @param {number} statusId
 * @returns {Promise<{ statusId: number; name: string } | null>}
 */
export async function getStatus(statusId) {
    const statuses = await _getStatusesMap();
    return statuses[statusId] ?? null;
}

/**
 * Returns an array of all statuses.
 * @returns {Promise<Array<{ statusId: number; name: string }>>}
 */
export async function getAllStatuses() {
    const statuses = await _getStatusesMap();
    // Object.values preserves insertion order (1,2,3)
    return Object.values(statuses);
}

