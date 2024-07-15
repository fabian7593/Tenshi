import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './modules/user/routers/UserRouter';

import {debuggingMessage} from './utils/logsUtils';
import "reflect-metadata";
import StartMiddleware from './middlewares/StartMiddleware';

//add necessary variables
const app = express();
app.use(cors());
app.use(bodyParser.json());

//MiddleWare
app.use((req : Request, res : Response, next : NextFunction) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(StartMiddleware);

//Add Routers
app.use(userRouter);

//Open port and listen API
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  debuggingMessage(`UNBREAKABLE Express TypeScript Service Start in Port ${PORT}`);
});