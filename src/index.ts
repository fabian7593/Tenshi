//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
//set configuration first time
const configPath = path.resolve(__dirname, '../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

//*************************************** */
//          Entities and Database
//*************************************** */
import { Database } from "@TenshiJS/persistance/TypeORMConnection";
import { User } from '@TenshiJS/entity/User';
import { Document } from '@entity/Document';
import { Notification } from '@entity/Notification';
import { UnitDynamicCentral } from '@entity/UnitDynamicCentral';
import { UserNotification } from '@entity/UserNotification';
//Init instance of database First time
Database.getInstance([User, Document, Notification, UnitDynamicCentral, UserNotification]);


//*************************************** */
//              IMPORTS
//*************************************** */
//Import general libraries 
import 'module-alias/register';
import 'reflect-metadata';
import http from 'http';
import { default as express } from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { default as bodyParser } from 'body-parser';

//Import Routes
import UserRoutes from '@modules/user/routers/UserRoutes';
import RoleRoutes from '@modules/role/routers/RoleRoutes';
import UdcRoutes from '@modules/udc/routers/UdcRoutes';
import NotificationRoutes from '@modules/notification/routers/NotificationRoutes';
import UserNotificationRoutes from '@modules/notification/routers/UserNotificationRoutes';
import LogRoutes from '@modules/log/routers/LogRoutes';
import EmailRoutes from '@modules/email/routers/EmailRoutes';
import DocumentRoutes from '@modules/document/routers/DocumentRoutes';

//Import internal classes and functions
import StartMiddleware from '@TenshiJS/middlewares/StartMiddleware';
import RateLimitMiddleware from '@TenshiJS/middlewares/RateLimitMiddleware';
import { debuggingMessage, insertLogBackend, insertLogTracking } from '@TenshiJS/utils/logsUtils';
import helmet from 'helmet';
import { ConstGeneral } from '@TenshiJS/consts/Const';
import RouteNotFoundMiddleware from '@TenshiJS/middlewares/RouteNotFoundMiddleware';
import { CorsHandlerMiddleware } from '@TenshiJS/middlewares/CorsHandlerMiddleware';
import LoggingHandlerMiddleware from '@TenshiJS/middlewares/LoggingHandlerMiddleware';


//*************************************** */
//              EXPORTS
//*************************************** */
export { Router, Request, Response, NextFunction };
export { express, cors, bodyParser };

//Objects
export { default as JWTObject } from '@TenshiJS/objects/JWTObject';

//Utils & helpers
export { default as Validations } from '@TenshiJS/helpers/Validations';
export { default as HttpAction } from '@TenshiJS/helpers/HttpAction';

export { debuggingMessage, insertLogBackend, insertLogTracking, config };



//*************************************** */
//           Started Variables
//*************************************** */
//add necessary variables
const app = express();
export let httpServer: ReturnType<typeof http.createServer>;


//*************************************** */
//           Started FUNCTION
//*************************************** */
export const TenshiMain = () => {

    //Cors handler middle ware
    app.use(CorsHandlerMiddleware);
    app.use(cors());
    app.use(bodyParser.json());


    //*************************************** */
    //              MIDDLEWARES
    //*************************************** */
    //MiddleWare to set content type to json
    app.use((req : Request, res : Response, next : NextFunction) => {
      res.setHeader(ConstGeneral.HEADER_TYPE, ConstGeneral.HEADER_JSON);
      next();
    });

    if(config.SERVER.IS_DEBUGGING === false) {
      //security helmet headers middleware
      app.use(helmet());
      //rate limit fo dos attack middleware
      app.use(RateLimitMiddleware);
    }

    //middleware to validate JWT and secret key
    app.use(StartMiddleware);
    //logging handler 
    app.use(LoggingHandlerMiddleware);



    //*************************************** */
    //              ROUTES
    //*************************************** */
    //Add Routers
    app.use(new UserRoutes().getRouter());
    app.use(new RoleRoutes().getRouter());
    app.use(new UdcRoutes().getRouter());
    app.use(new NotificationRoutes().getRouter());
    app.use(new UserNotificationRoutes().getRouter());
    app.use(new LogRoutes().getRouter());
    app.use(new EmailRoutes().getRouter());
    app.use(new DocumentRoutes().getRouter());

    //*************************************** */
    //       NOT FOUND ROUTE MIDDLEWARE
    //*************************************** */
    app.use(RouteNotFoundMiddleware);


    //*************************************** */
    //              LISTENER
    //*************************************** */
    httpServer = http.createServer(app);
    httpServer.listen(config.SERVER.PORT, () => {
      debuggingMessage(`${config.COMPANY.NAME} - TenshiJS Service Start in Port ${config.SERVER.PORT}`);
    });
};
  

/**
 * Function to close the TenshiJS service. This function is
 * useful when you want to close the service programmatically.
 * @param callback - Callback function that will be executed
 * when the service is closed.
 */
export const Shutdown = (callback: any) => {
  if (httpServer) {
    /**
     * Close the http server and then close the database
     * connection.
     */
    httpServer.close(() => {
      Database.closeConnection();
    });
  } else {
    /**
     * If there is no http server, then just close the database
     * connection.
     */
    Database.closeConnection();
  }
};


//*************************************** */
//              START SERVER
//*************************************** */
TenshiMain();