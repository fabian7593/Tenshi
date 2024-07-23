//*************************************** */
//              IMPORTS
//*************************************** */
//Import libraries 
import 'module-alias/register';
import 'reflect-metadata';
import { container } from './inversify.config';
import { default as express } from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';
import config from '../unbreakable-config';

//Import classes
import UserRoutes from '@user/routers/UserRoutes';
import UdcRoutes from '@udc/routers/UdcRoutes';
import NotificationRoutes from '@index/modules/notification/routers/NotificationRoutes';
import UserNotificationRoutes from '@index/modules/notification/routers/UserNotificationRoutes';
import LogRoutes from '@index/modules/log/routers/LogRoutes';
import EmailRoutes from '@email/routers/EmailRoutes';
import DocumentRoutes from '@document/routers/DocumentRoutes';

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

export { debuggingMessage, insertLog, executeQuery, container, config };

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

const userRoutes = new UserRoutes();
const udcRoutes = new UdcRoutes();
const notificationRoutes = new NotificationRoutes(); 
const userNotificationRoutes = new UserNotificationRoutes();
const logRoutes = new LogRoutes();
const emailRoutes = new EmailRoutes();
const documentRoutes = new DocumentRoutes();

app.use(userRoutes.getRouter());
app.use(udcRoutes.getRouter());
app.use(notificationRoutes.getRouter());
app.use(userNotificationRoutes.getRouter());
app.use(logRoutes.getRouter());
app.use(emailRoutes.getRouter());
app.use(documentRoutes.getRouter());


//dependency injections
/*const userRoutes = container.get(UserRoutes);
const udcRoutes = container.get(UdcRoutes);
const notificationRoutes = container.get(NotificationRoutes);
const userNotificationRoutes = container.get(UserNotificationRoutes);
const logRoutes = container.get(LogRoutes);
const emailRoutes = container.get(EmailRoutes);
const documentRoutes = container.get(DocumentRoutes);

app.use(userRoutes.getRouter());
app.use(udcRoutes.getRouter());
app.use(notificationRoutes.getRouter());
app.use(userNotificationRoutes.getRouter());
app.use(logRoutes.getRouter());
app.use(emailRoutes.getRouter());
app.use(documentRoutes.getRouter());
*/


//*************************************** */
//              LISTENER
//*************************************** */
//Open port and listen API
app.listen(config.SERVER.PORT, () => {
  Database.getInstance();
  debuggingMessage(`UNBREAKABLE Express TypeScript Service Start in Port ${config.SERVER.PORT}`);
});