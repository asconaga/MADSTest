import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'MADS-USERS';

/**
 * Fetches the entire users map from AsyncStorage.
 * @returns {Promise<Record<string, { userId: number; name: string }>>}
 */
async function _getUsersMap() {
    try {
        const json = await AsyncStorage.getItem(USERS_KEY);
        return json != null ? JSON.parse(json) : {};
    } catch (error) {
        console.error('Error reading users from storage', error);
        throw error;
    }
}

/**
 * Persists the given users map to AsyncStorage.
 * @param {Record<string, { userId: number; name: string }>} map
 */
async function _setUsersMap(map) {
    try {
        const json = JSON.stringify(map);
        await AsyncStorage.setItem(USERS_KEY, json);
    } catch (error) {
        console.error('Error saving users to storage', error);
        throw error;
    }
}

/**
 * Creates a new user entry.
 * @param {{ userId: number; name: string }} user
 */
export async function createUser(user) {
    const users = await _getUsersMap();
    if (users[user.userId]) {
        throw new Error(`User with ID ${user.userId} already exists.`);
    }
    users[user.userId] = user;
    await _setUsersMap(users);
}

/**
 * Reads a user by ID.
 * @param {number} userId
 * @returns {Promise<{ userId: number; name: string } | null>}
 */
export async function getUser(userId) {
    const users = await _getUsersMap();
    return users[userId] ?? null;
}

/**
 * Updates an existing user.
 * @param {{ userId: number; name: string }} user
 */
export async function updateUser(user) {
    const users = await _getUsersMap();
    if (!users[user.userId]) {
        throw new Error(`User with ID ${user.userId} does not exist.`);
    }
    users[user.userId] = user;
    await _setUsersMap(users);
}

/**
 * Deletes a user by ID.
 * @param {number} userId
 */
export async function deleteUser(userId) {
    const users = await _getUsersMap();
    if (!users[userId]) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }
    delete users[userId];
    await _setUsersMap(users);
}

/**
 * Returns an array of all users.
 * @returns {Promise<Array<{ userId: number; name: string }>>}
 */
export async function getAllUsers() {
    const users = await _getUsersMap();
    return Object.values(users);
}
