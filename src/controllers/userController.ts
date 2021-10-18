import { Request, Response, NextFunction } from 'express';
import { BadRequest, Unauthorized } from 'http-errors';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { SECRET_KEY } from '../consts';
import User from '../models/User';

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequest('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) {
      throw new Unauthorized('Invalid Credentials');
    }

    const payload = {
      id: user!.id
    };

    jwt.sign(
      payload,
      SECRET_KEY,
      { expiresIn: '3h' },
      (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        res.status(201).json({ token: token! });
      }
    );
  } catch (err) {
    next(err);
  }
}

async function register(req: Request, res: Response, next: NextFunction) {
  // Start atomic transaction

  try {
    const { email, password } = req.body;

    const user = await User.create({ email, password });
    const userId = user.id;

    const payload = {
      id: userId
    };

    jwt.sign(
      payload,
      SECRET_KEY,
      { expiresIn: '3h' },
      async (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        res.status(201).json({ token: token! });
      }
    );
  } catch (err) {
    next(err);
  }
}

export const registerFuncs = [register];
export const loginFuncs = [login];
