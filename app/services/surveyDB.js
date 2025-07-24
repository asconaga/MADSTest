import AsyncStorage from '@react-native-async-storage/async-storage';

const SURVEYS_KEY = 'MADS-SURVEYS';
const NEXT_SURVEY_ID_KEY = 'MADS-SURVEYS-NEXT-ID';

/**
 * Validates that a survey object has all required fields with correct types.
 * @param {any} survey
 */
function _validateSurveyObject(survey) {
    if (typeof survey !== 'object' || survey === null) {
        throw new Error('Survey must be an object');
    }
    const {
        surveyId,
        name,
        description,
        createdBy,
        createdOn,
        status
    } = survey;

    if (typeof surveyId !== 'number') {
        throw new Error('surveyId must be a number');
    }
    if (typeof name !== 'string') {
        throw new Error('name must be a string');
    }
    if (typeof description !== 'string') {
        throw new Error('description must be a string');
    }
    if (typeof createdBy !== 'number') {
        throw new Error('createdBy must be a number');
    }
    if (typeof createdOn !== 'string' || isNaN(Date.parse(createdOn))) {
        throw new Error('createdOn must be a valid ISO date string');
    }
    if (typeof status !== 'number') {
        throw new Error('status must be a number');
    }
}

/**
 * Fetches the current next survey ID from storage, initializing if needed.
 * @returns {Promise<number>}
 */
async function _getNextSurveyId() {
    try {
        const json = await AsyncStorage.getItem(NEXT_SURVEY_ID_KEY);
        if (json == null) {
            // Initialize starting ID at 1
            await AsyncStorage.setItem(NEXT_SURVEY_ID_KEY, JSON.stringify(1));
            return 1;
        }
        const id = JSON.parse(json);
        return typeof id === 'number' ? id : 1;
    } catch (error) {
        console.error('Error reading next survey ID', error);
        throw error;
    }
}

/**
 * Increments and persists the next survey ID.
 * @returns {Promise<number>} the allocated survey ID
 */
async function _allocateSurveyId() {
    const nextId = await _getNextSurveyId();
    const newNext = nextId + 1;
    await AsyncStorage.setItem(NEXT_SURVEY_ID_KEY, JSON.stringify(newNext));
    return nextId;
}

/**
 * Fetches the entire surveys map from AsyncStorage.
 * @returns {Promise<Record<number, {
 *   surveyId: number;
 *   name: string;
 *   description: string;
 *   createdBy: number;
 *   createdOn: string; // ISO date string
 *   status: number;
 * }>>}
 */
async function _getSurveysMap() {
    try {
        const json = await AsyncStorage.getItem(SURVEYS_KEY);
        return json != null ? JSON.parse(json) : {};
    } catch (error) {
        console.error('Error reading surveys from storage', error);
        throw error;
    }
}

/**
 * Reads a survey by ID.
 * @param {number} surveyId
 * @returns {Promise<{surveyId: number; name: string; description: string; createdBy: number; createdOn: string; status: number;} | null>}
 */
export async function getSurvey(surveyId) {
    const surveys = await _getSurveysMap();
    return surveys[surveyId] ?? null;
}

/**
 * Returns an array of all surveys.
 * @returns {Promise<Array<{surveyId: number; name: string; description: string; createdBy: number; createdOn: string; status: number;}>>}
 */
export async function getAllSurveys() {
    const surveys = await _getSurveysMap();
    return Object.values(surveys);
}

/**
 * Creates a new survey. Pass surveyId = 0 to auto-assign the next ID.
 * @param {{
 *   surveyId: number;
 *   name: string;
 *   description: string;
 *   createdBy: number;
 *   createdOn: string; // ISO date string
 *   status: number;
 * }} survey
 * @returns {Promise<number>} the surveyId of the created survey
 */
export async function createSurvey(survey) {
    try {
        // Only allow auto-allocation
        if (survey.surveyId !== 0) {
            throw new Error('surveyId must be 0 for new surveys');
        }
        // Allocate new ID
        const id = await _allocateSurveyId();
        const newSurvey = { ...survey, surveyId: id };
        _validateSurveyObject(newSurvey);

        const surveys = await _getSurveysMap();
        surveys[id] = newSurvey;
        await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
        return id;
    } catch (error) {
        console.error('Error creating survey', error);
        throw error;
    }
}

/**
 * Updates an existing survey.
 * @param {{
 *   surveyId: number;
 *   name: string;
 *   description: string;
 *   createdBy: number;
 *   createdOn: string; // ISO date string
 *   status: number;
 * }} survey
 */
export async function updateSurvey(survey) {
    try {
        _validateSurveyObject(survey);
        const surveys = await _getSurveysMap();
        if (!surveys[survey.surveyId]) {
            throw new Error(`Survey ${survey.surveyId} does not exist`);
        }
        surveys[survey.surveyId] = survey;
        await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
    } catch (error) {
        console.error('Error updating survey', error);
        throw error;
    }
}

/**
 * Deletes a survey by ID.
 * @param {number} surveyId
 */
export async function deleteSurvey(surveyId) {
    try {
        const surveys = await _getSurveysMap();
        delete surveys[surveyId];
        await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
    } catch (error) {
        console.error('Error deleting survey', error);
        throw error;
    }
}
