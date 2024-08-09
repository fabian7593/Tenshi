//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@config/ConfigManager';
const configPath = path.resolve(__dirname, '../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

//*************************************** */
//          Entities and Database
//*************************************** */
import { Database } from "@config/TypeORMConnection";
import { User } from '@entity/User';
import { Document } from '@entity/Document';
import { Notification } from '@entity/Notification';
import { UnitDynamicCentral } from '@entity/UnitDynamicCentral';
import { UserNotification } from '@entity/UserNotification';
Database.getInstance([User, Document, Notification, UnitDynamicCentral, UserNotification]);


//*************************************** */
//              IMPORTS
//*************************************** */
//Import general libraries 
import 'module-alias/register';
import 'reflect-metadata';
import { default as express } from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';

//Import Routes
import UserRoutes from '@user/routers/UserRoutes';
import UdcRoutes from '@udc/routers/UdcRoutes';
import NotificationRoutes from '@index/modules/notification/routers/NotificationRoutes';
import UserNotificationRoutes from '@index/modules/notification/routers/UserNotificationRoutes';
import LogRoutes from '@index/modules/log/routers/LogRoutes';
import EmailRoutes from '@email/routers/EmailRoutes';
import DocumentRoutes from '@document/routers/DocumentRoutes';

//Import internal classes and functions
import StartMiddleware from '@middlewares/StartMiddleware';
import { debuggingMessage, insertLogBackend, insertLogTracking } from '@utils/logsUtils';
import { executeQuery } from '@utils/executionDBUtils';




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

export { debuggingMessage, insertLogBackend, insertLogTracking, executeQuery, config };



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
app.use(new UserRoutes().getRouter());
app.use(new UdcRoutes().getRouter());
app.use(new NotificationRoutes().getRouter());
app.use(new UserNotificationRoutes().getRouter());
app.use(new LogRoutes().getRouter());
app.use(new EmailRoutes().getRouter());
app.use(new DocumentRoutes().getRouter());


//*************************************** */
//              LISTENER
//*************************************** */
//Open port and listen API
app.listen(config.SERVER.PORT, () => {
  debuggingMessage(`TENSHI Express TypeScript Service Start in Port ${config.SERVER.PORT}`);
});