import { GraphQLError } from "graphql";

import {
  USER_NOT_AUTHORIZED_CODE,
  USER_NOT_AUTHORIZED_MESSAGE,
  INVALID_PARAM_CODE,
  INVALID_PARAM_MESSAGE,
} from "./constants.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileNumberRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[a-zA-Z\s'-]+$/;

const throwInputError = (key: string): void => {
  throw new GraphQLError(INVALID_PARAM_MESSAGE.replace("{PARAM}", key), {
    extensions: {
      code: INVALID_PARAM_CODE,
    },
  });
};

export const checkIfValidUser = (user: string): boolean | void => {
  if (!user) {
    throw new GraphQLError(USER_NOT_AUTHORIZED_MESSAGE, {
      extensions: {
        code: USER_NOT_AUTHORIZED_CODE,
      },
    });
  }
  return true;
};

export const checkIfValidEmail = (email: string): boolean | void => {
  if (!emailRegex.test(email)) {
    throwInputError("email");
  }
  return true;
};

export const checkIfValidPhoneNumber = (
  phoneNumber: string
): boolean | void => {
  if (!mobileNumberRegex.test(phoneNumber)) {
    throwInputError("phoneNumber");
  }
  return true;
};

export const checkIfValidName = (name: string): boolean | void => {
  if (!nameRegex.test(name)) {
    throwInputError("name");
  }
  return true;
};

export const checkIfValidPaginationParams = (
  limit: number,
  offset: number
): boolean | void => {
  if (limit && !Number.isInteger(limit)) {
    throwInputError("limit");
  }
  if (offset && !Number.isInteger(offset)) {
    throwInputError("offset");
  }
  return true;
};
