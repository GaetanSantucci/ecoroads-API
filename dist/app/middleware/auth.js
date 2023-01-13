//~ Import module
import { ErrorApi } from '../services/errorHandler.js';
//~ Authentication
function auth(req, res, next) {
    console.log('req.user dans le authhhhhh', req.user);
    if (!req.user)
        throw new ErrorApi(`User not connected !`, req, res, 401);
    next();
}
export { auth };
