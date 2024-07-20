//*************************************** */
//              IMPORTS
//*************************************** */
//Import libraries 
import 'module-alias/register';
import 'reflect-metadata';
import { default as express } from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';
import config from '../unbreakable-config';

//Import classes
import UserRouter from '@user/routers/UserRouter';
import UdcRouter from '@udc/routers/UdcRouter';
import NotificationRouter from '@notification/routers/NotificationRouter';
import UserNotificationRouter from '@notification/routers/UserNotificationRouter';
import LogRouter from '@log/routers/LogRouter';
import EmailRouter from '@email/routers/EmailRouter';
import DocumentRouter from '@document/routers/DocumentRouter';

import StartMiddleware from '@middlewares/StartMiddleware';
import { debuggingMessage, insertLog } from '@utils/logsUtils';
import { executeQuery } from '@utils/executionDBUtils';

import { Database } from "@config/TypeORMConnection";



//*************************************** */
//              EXPORTS
//*************************************** */
export { Router, Request, Response, NextFunction };
export { express, cors, bodyParser };

//Objects
export { default as JWTObject } from '@objects/JWTObject';

//Utils & helpers
export { default as Validations } from '@helpers/Validations';
export { default as HttpAction } from '@helpers/HttpAction';
export { sendMail, replaceCompanyInfoEmails } from "@utils/sendEmailsUtils";

export { debuggingMessage, insertLog, executeQuery, config };

//*************************************** */
//              VARIABLES
//*************************************** */
//add necessary variables
const app = express();
app.use(cors());
app.use(bodyParser.json());



//*************************************** */
//              MIDDLEWARE
//*************************************** */
//MiddleWare to set content type to json
app.use((req : Request, res : Response, next : NextFunction) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

//middleware to validate JWT and secret key
app.use(StartMiddleware);



//*************************************** */
//              ROUTES
//*************************************** */
//Add Routers
app.use(UserRouter);
app.use(UdcRouter);
app.use(NotificationRouter);
app.use(UserNotificationRouter);
app.use(LogRouter);
app.use(EmailRouter);
app.use(DocumentRouter);

//*************************************** */
//              LISTENER
//*************************************** */
//Open port and listen API
app.listen(config.SERVER.PORT, () => {
  Database.getInstance();
  debuggingMessage(`UNBREAKABLE Express TypeScript Service Start in Port ${config.SERVER.PORT}`);
});