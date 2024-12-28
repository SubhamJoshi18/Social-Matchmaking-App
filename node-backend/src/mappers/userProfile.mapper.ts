import {
  RelationShipEnum,
  ChildrenPreferencesEnum,
} from '../interfaces/userProfile.interface';

export const fetchUserId = (userPayload: object | any) => {
  if (userPayload._id) {
    return (userPayload as any)._id;
  }
};

export const extractUserName = (username: string) => {
  const indexOfSpecialSymbol = username.indexOf('@');
  const result = username.substring(0, indexOfSpecialSymbol);
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const checkValidRelationShip = (value: string): boolean => {
  return Object.values(RelationShipEnum).includes(value as RelationShipEnum);
};

export const checkValidChildrenType = (value: string): boolean => {
  return Object.values(ChildrenPreferencesEnum).includes(
    value as ChildrenPreferencesEnum
  );
};
