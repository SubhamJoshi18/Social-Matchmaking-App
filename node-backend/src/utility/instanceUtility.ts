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
