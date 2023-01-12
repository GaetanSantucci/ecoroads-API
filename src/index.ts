// ~ ENVIRONMENT CONFIG  ~ //
import 'dotenv/config';

// ~ EXPRESS CONFIG ~ //
import express from 'express';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import { router } from './app/router/index.js';
// import { _404 } from './app/service/errorHandling.js';

// ~ LAUNCHER CONFIG ~ //
app.use('/api/v1', router);
// app.use(_404)


// eslint-disable-next-line no-undef
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(` \x1b[1;33m⚡⚡ http://localhost:${PORT} ⚡⚡ \x1b[0m`)
});