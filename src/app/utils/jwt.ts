/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';


function generateAccessToken(user: object) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1d" });
}

function generateRefreshToken(user: object, req: Request) {

  req.session.refreshToken = [];
  const token = req.session.refreshToken;

  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "2d" });

  token.push(refreshToken);
  console.log(req.user);
  return refreshToken;
}

function refreshToken(req: Request, res: Response) {
  return res.json("token refresh")
}


export { generateAccessToken, generateRefreshToken, refreshToken }