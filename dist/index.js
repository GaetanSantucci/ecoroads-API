var _a;
// ~ ENVIRONMENT CONFIG  ~ //
import 'dotenv/config';
// ~ EXPRESS CONFIG ~ //
import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// import { router } from './app/router/index.js';
// import { _404 } from './app/service/errorHandling.js';
// ~ LAUNCHER CONFIG ~ //
// app.use(router);
// app.use(_404)
app.get('/', (req, res) => {
    res.send("hello world");
});
// eslint-disable-next-line no-undef
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(` \x1b[1;33m⚡⚡ http://localhost:${PORT} ⚡⚡ \x1b[0m`);
});
