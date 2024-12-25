import { v4 as uuid } from 'uuid';

/**
 * Create the randomized uuid
 * @returns {string}
 */
export const createRandomizeUuid = (): string => {
  const randomUuid = uuid();
  const randomDigits = Math.floor(Math.random() * 900000) + 100000; 
  return `${randomUuid}-${randomDigits}`;
};
