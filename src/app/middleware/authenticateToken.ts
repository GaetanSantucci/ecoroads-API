import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { ErrorApi } from '../services/errorHandler.js';

import debug from 'debug';
const logger = debug('JWT');


function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization']; //Bearer TOKEN

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw new ErrorApi("Token not found", req, res, 400);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error: unknown, user: any) => {
      if (error) throw new ErrorApi("The token is invalid", req, res, 403);

      req.user = user;

      next();
    });
  } catch (err) {
    if (err instanceof Error) logger(err.message);
  }
}

export { authenticateToken };