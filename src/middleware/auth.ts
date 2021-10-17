import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { ON_AUTH, SECRET_KEY } from '../consts';
import { Unauthorized, NotFound } from 'http-errors';

import User from '../models/User';

export interface UserDecoded {
  id: number;
  iat: number;
  exp: number;
}

async function authImpl(req: Request, res: Response, next: NextFunction) {
  if (!ON_AUTH) {
    next();
    return;
  }

  const token = req.header('x-auth-token');

  if (!token) {
    next(new Unauthorized('No token found!'));
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserDecoded;
    const user = await User.findByPk(decoded.id);
    if (user === null) {
      throw new NotFound('No user found during authentication');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      next(new Unauthorized('JWT expired. Please refresh token'));
      return;
    }

    next(err);
  }
}

export const auth = [authImpl];
