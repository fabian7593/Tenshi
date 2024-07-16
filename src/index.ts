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

//Import classes
import userRouter from '@user/routers/UserRouter';
import StartMiddleware from '@middlewares/StartMiddleware';

//Import functions
import { debuggingMessage } from '@utils/logsUtils';



//*************************************** */
//              EXPORTS
//*************************************** */
export { Router, Request, Response, NextFunction };
export { express, cors, bodyParser };



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
app.use(userRouter);



//*************************************** */
//              LISTENER
//*************************************** */
//Open port and listen API
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  debuggingMessage(`UNBREAKABLE Express TypeScript Service Start in Port ${PORT}`);
});