import { Request } from 'express';
export interface genericResponseType {
  data: any;
  message: string;
  success: boolean;
  token?: string;
}

interface IUser {
  _id: string;
  email: string;
  fullName: string;
}
export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}
