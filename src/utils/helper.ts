import { ServerResponse } from './types'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const buildResponse = <T>(
  isSuccessful: boolean = false,
  displayMessage: string = 'Unknown message',
  description: string | null,
  exception: string | null = null,
  data: T | null = null
): ServerResponse<T> => {

  return {
    isSuccessful,
    displayMessage,
    description,
    exception,
    data,
  };
};

export const createToken = (id: string) => {

  const token = jwt.sign({ id: id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  return token;
}