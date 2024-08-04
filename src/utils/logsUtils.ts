
import { Log } from '@entity/Log'
import GenericRepository from '@generics/Repository/GenericRepository';
import { RequestHandler } from '@index/generics';
import {default as config} from "@root/unbreakable-config";
import { getStatus } from '@utils/jsonUtils';
import  logger  from '@utils/logger';

/*
    Logs Utils class is for logs in console for debbuging &
    In Logs for a DB traceabillity for errors, use of information and others
*/
export function debuggingMessage(message : any) {
    if(config.SERVER.IS_DEBUGGING == true){
        console.log("\n");
        console.log(message);
    }
}

export async function insertLogBackend(method: string, className: string, message: string, 
                                https: number | null,  type: string | null, userId: string | null, 
                                data: string | null) 
{

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
        log.environment = "BACKEND";
        log.platform = "SERVER";

        await saveLog(log, "BACKEND");
    }
}


export async function insertLogTracking(reqHandler: RequestHandler, 
                                        message:string, statusCode : string, 
                                        data: string | null,
                                        userId: string | null, action: string | null,
                                        ) {

    if(config.LOG.LOG_TRACEABILLITY == true){

        const log : Log = new Log();
        log.method = reqHandler.getMethod();
        log.type = statusCode;
        log.action = action;
        log.https = getStatus(statusCode).httpStatus;
        log.message = message;
        log.data = data;
        log.app_guid = reqHandler.getResponse().locals.appGuid;
        log.ip_address = reqHandler.getResponse().locals.ipAddress;
        log.user_id = userId;
        if(reqHandler.getResponse().locals.deviceInfo != null){
            log.environment = reqHandler.getResponse().locals.deviceInfo.environment;
            log.platform = reqHandler.getResponse().locals.deviceInfo.platform;
            log.device_information = JSON.stringify(reqHandler.getResponse().locals.deviceInfo);
        }

        await saveLog(log, "TRACKING");
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
        // If the setting in the config file allows it, save the log to the database.
        if(config.LOG.LOG_DATABASE == true){
            const genericRepository = new GenericRepository(Log);
            await genericRepository.add(log);
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


