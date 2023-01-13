var _a;
// ~ ENVIRONMENT CONFIG  ~ //
import 'dotenv/config';
// ~ EXPRESS CONFIG ~ //
import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//~ Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});
//If you have your node.js behind a proxy and are using secure: true, you need to set 'trust proxy' in express
// app.set('trust proxy', 1);
// trust first proxy if deploy
//~ Session
import session from 'express-session';
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.SECRET_SESSION,
    cookie: {
        secure: true,
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        // sameSite: 'none' //'lax', // or 'strict'
        //expires : new Date(Date.now() + 60 * 60 * 1000) //1 hour
    }
}));
import { router } from './app/router/index.js';
// import { _404 } from './app/service/errorHandling.js';
// ~ LAUNCHER CONFIG ~ //
app.use('/api/v1', router);
// app.use(_404)
// eslint-disable-next-line no-undef
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(`\x1b[1;33m⚡⚡ http://localhost:${PORT} ⚡⚡ \x1b[0m`);
});
