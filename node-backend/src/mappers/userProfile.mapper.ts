import {
  RelationShipEnum,
  ChildrenPreferencesEnum,
} from '../interfaces/userProfile.interface';

/**
 * Extracts and formats the username from an email-like string.
 *
 * @param {string} username - The email-like string from which to extract the username.
 * @returns {string} - The formatted username with the first character capitalized.
 */
export const extractUserName = (username: string): string => {
  const indexOfSpecialSymbol = username.indexOf('@');
  const result = username.substring(0, indexOfSpecialSymbol);
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Checks if the provided relationship value is valid.
 *
 * @param {string} value - The relationship value to validate.
 * @returns {boolean} - True if the value is valid, otherwise false.
 */
export const checkValidRelationShip = (value: string): boolean => {
  return Object.values(RelationShipEnum).includes(value as RelationShipEnum);
};

/**
 * Checks if the provided children preference type is valid.
 *
 * @param {string} value - The children preference type to validate.
 * @returns {boolean} - True if the value is valid, otherwise false.
 */
export const checkValidChildrenType = (value: string): boolean => {
  return Object.values(ChildrenPreferencesEnum).includes(
    value as ChildrenPreferencesEnum
  );
};

export const fetchUserId = (user: any) => {
  if (user.hasOwnProperty('_id')) {
    return (user as any)._id;
  }
  return null;
};

export const checkIsArray = (value: string[] | any[]) => {
  return typeof value === 'object' && Array.isArray(value);
};
