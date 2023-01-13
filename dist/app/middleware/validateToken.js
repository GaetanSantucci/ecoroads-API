import jwt from "jsonwebtoken";
import { ErrorApi } from '../services/errorHandler.js';
import debug from 'debug';
const logger = debug('JWT');
function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization']; //Bearer TOKEN
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            throw new ErrorApi("Token not found", req, res, 400);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            console.log('user: ', user);
            if (error)
                throw new ErrorApi("The token is invalid", req, res, 403);
            req.user = user;
            console.log('req.user: ', req.user);
            next();
        });
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
}
export { authenticateToken };
