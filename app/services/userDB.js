import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'MADS-USERS';
const NEXT_USER_ID_KEY = 'MADS-USERS-NEXT-ID';

/**
 * Validates that a user object has the correct fields.
 * @param {any} user
 */
function _validateUserObject(user) {
    if (typeof user !== 'object' || user === null) {
        throw new Error('User must be an object');
    }
    const { userId, name } = user;
    if (typeof userId !== 'number') throw new Error('userId must be a number');
    if (typeof name !== 'string') throw new Error('name must be a string');
}

/**
 * Allocates the next incremental user ID starting from 1.
 * @returns {Promise<number>} new allocated user ID
 */
async function _allocateUserId() {
    try {
        const json = await AsyncStorage.getItem(NEXT_USER_ID_KEY);
        const current = json != null ? JSON.parse(json) : 0;
        const newId = current + 1;
        await AsyncStorage.setItem(NEXT_USER_ID_KEY, JSON.stringify(newId));
        return newId;
    } catch (error) {
        console.error('Error allocating user ID', error);
        throw error;
    }
}

/**
 * Fetches the entire users map from AsyncStorage.
 * @returns {Promise<Record<number, { userId: number; name: string }>>}
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
 * Reads a user by ID.
 * @param {number} userId
 * @returns {Promise<{ userId: number; name: string } | null>}
 */
export async function getUser(userId) {
    const users = await _getUsersMap();
    return users[userId] ?? null;
}

/**
 * Returns an array of all users.
 * @returns {Promise<Array<{ userId: number; name: string }>>}
 */
export async function getAllUsers() {
    const users = await _getUsersMap();
    return Object.values(users);
}

/**
 * Creates a new user. Pass userId = 0 to auto-assign.
 * @param {{ userId: number; name: string }} user
 * @returns {Promise<number>} the new userId
 */
export async function createUser(user) {
    if (user.userId !== 0) {
        throw new Error('userId must be 0 for new users');
    }
    const id = await _allocateUserId();
    const newUser = { ...user, userId: id };
    _validateUserObject(newUser);
    const users = await _getUsersMap();
    users[id] = newUser;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return id;
}

/**
 * Updates an existing user.
 * @param {{ userId: number; name: string }} user
 */
export async function updateUser(user) {
    _validateUserObject(user);
    const users = await _getUsersMap();
    if (!users[user.userId]) {
        throw new Error(`User ${user.userId} does not exist`);
    }
    users[user.userId] = user;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Deletes a user by ID.
 * @param {number} userId
 */
export async function deleteUser(userId) {
    const users = await _getUsersMap();
    delete users[userId];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}
