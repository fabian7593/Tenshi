import { ConstMessagesJson, ConstStatusJson } from 'tenshi/consts/Const';
import { getMessage } from 'tenshi/utils/jsonUtils';
import { insertLogBackend } from 'tenshi/utils/logsUtils';
import { Request, Response, NextFunction } from 'express';
import { formatDate } from 'tenshi/utils/formatDateUtils';
import ConfigManager from 'tenshi/config/ConfigManager';

export default async function LoggingHandlerMiddleware(req: Request, res: Response, next: NextFunction) {

    try{
        const config = ConfigManager.getInstance().getConfig();
        if(config.LOG.LOG_MIDDLEWARE == true){
            await insertLogBackend(req.method, "LoggingHandlerMiddleware", `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - DATE: [${formatDate(new Date())}]`, 
                                    res.statusCode, ConstMessagesJson.LOGGING_MIDDLEWARE, null, 
                                    getMessage(ConstMessagesJson.LOGGING_MIDDLEWARE));
    
            res.on('finish', async ()  => {
                await insertLogBackend(req.method, "LoggingHandlerMiddleware", `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}] - DATE: [${formatDate(new Date())}]`, 
                    res.statusCode, ConstMessagesJson.LOGGING_MIDDLEWARE, null, 
                    getMessage(ConstMessagesJson.LOGGING_MIDDLEWARE));
            });
        }
    }catch(error:any){}
   
    next();
}