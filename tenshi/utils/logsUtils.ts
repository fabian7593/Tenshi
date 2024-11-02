
import { Log } from 'tenshi/entity/Log'
import GenericRepository from 'tenshi/generics/Repository/GenericRepository';
import RequestHandler from 'tenshi/generics/RequestHandler/RequestHandler';
import ConfigManager  from "tenshi/config/ConfigManager";
import { getStatus } from 'tenshi/utils/jsonUtils';
import logger from 'tenshi/utils/logger';

import { ConstLogs } from "tenshi/consts/Const";

/*
    Logs Utils class is for logs in console for debbuging &
    In Logs for a DB traceabillity for errors, use of information and others
*/
export function debuggingMessage(message : any) {
    try{
        const config = ConfigManager.getInstance().getConfig();
        if(config.SERVER.IS_DEBUGGING == true){
            console.log("\n");
            console.log(message);
        }
    }catch(err){
        logger(ConstLogs.LOG_ERROR, `debuggingMessage: ` + err);
    }
    
}

export async function insertLogBackend(method: string, className: string, message: string, 
                                https: number | null,  type: string | null, userId: string | null, 
                                data: string | null) 
{
    try{
        const config = ConfigManager.getInstance().getConfig();
        if(config.LOG.LOG_SERVER == true){
            const log = new Log();
            log.method = method;
            log.class = className;
            log.message = message;
            log.https = https;
            log.type = type;
            log.user_id = userId;
            log.data = data;
            log.created_date = new Date();
            log.environment = ConstLogs.BACKEND;
            log.platform = ConstLogs.SERVER;

            await saveLog(log, ConstLogs.BACKEND);
        }
    }catch(err){
        await logger(ConstLogs.LOG_ERROR, `insertLogBackend: ` + err);
    }
}


export async function insertLogTracking(reqHandler: RequestHandler, 
                                        message:string, statusCode : string, 
                                        data: string | null,
                                        userId: string | null, action: string | null,
                                        ) {
    try{
        const config = ConfigManager.getInstance().getConfig();
        if(config.LOG.LOG_TRACEABILLITY == true){

            const log : Log = new Log();
            log.method = reqHandler.getMethod();
            log.type = statusCode;
            log.action = action;
            log.https = getStatus(statusCode).httpStatus;
            log.message = message;
            log.data = data;
            log.ip_address = reqHandler.getResponse().locals.ipAddress;
            log.user_id = userId;
            if(reqHandler.getResponse().locals.deviceInfo != null){
                log.environment = reqHandler.getResponse().locals.deviceInfo.environment;
                log.platform = reqHandler.getResponse().locals.deviceInfo.platform;
                log.device_information = JSON.stringify(reqHandler.getResponse().locals.deviceInfo);
            }

            await saveLog(log, ConstLogs.TRACKING);
        }
    }catch(err){
        await logger(ConstLogs.LOG_ERROR, `insertLogTracking: ` + err);
    }
}



/**
 * This function saves a log to the database and file, if the settings in the config file
 * allow it.
 *
 * @param {Log} log - The log object to be saved.
 * @param {string} title - The title of the log.
 * @return {Promise<void>} Promise that resolves when the log is saved.
 */
async function saveLog(log: Log, title: string) {
    try{
        const config = ConfigManager.getInstance().getConfig();
        // If the setting in the config file allows it, save the log to the database.
        if(config.LOG.LOG_DATABASE == true){
            const genericRepository = new GenericRepository(Log);
            if(await genericRepository){
                await genericRepository.add(log);
            }
        }

        // If the setting in the config file allows it, save the log to a file.
        if(config.LOG.LOG_FILE == true){
            // Call the logger function to save the log to a file.
            // The logger function takes two parameters: the title of the log and
            // the log object, converted to a JSON string.
            await logger(title, JSON.stringify(log));
        }
    }catch(error){
       debuggingMessage(error);
    }
 }


