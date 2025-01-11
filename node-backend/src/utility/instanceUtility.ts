/**
 * The Function will return the string if it is number
 * @param value
 * @returns {string}
 */
export const convertIntoString = (value: any) => {
  if (typeof value === 'string') {
    return value;
  }
  return String(value).trim();
};

/**
 *  The Function will return the number if it is string
 * @param value
 * @returns {number}
 */
export const convertIntoNumber = (value: any) => {
  if (typeof value === 'number') {
    return value;
  }
  return Number(value);
};

/**
 * This Function is used to check whether the object is valid or not
 * @param valueObject
 * @returns {boolean}
 */
export const checkObjectLength = (valueObject: Object) => {
  return typeof valueObject === 'object'
    ? Object.entries(valueObject).length > 0
    : false;
};
