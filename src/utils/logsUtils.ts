
import { Log } from '@entity/Log'
import GenericRepository from '@generics/Repository/GenericRepository';
import { RequestHandler } from '@index/generics';
import {default as config} from "@root/unbreakable-config";
import { getStatus } from '@utils/jsonUtils';

/*
    Logs Utils class is for logs in console for debbuging &
    In Logs for a DB traceabillity for errors, use of information and others
*/
export function debuggingMessage(message : any) {
    if(config.GENERAL.IS_DEBUGGING == true){
        console.log("\n");
        console.log(message);
    }
}

export async function insertLogBackend(method: string, className: string, message: string, 
                                https: number | null,  type: string | null, userId: string | null, 
                                data: string | null) {
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
    const genericRepository = new GenericRepository(Log);
    await genericRepository.add(log);
}


export async function insertLogTracking(reqHandler: RequestHandler, 
                                        message:string, statusCode : string, 
                                        data: string | null,
                                        userId: string | null, action: string | null,
                                        ) {
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

    const genericRepository = new GenericRepository(Log);
    await genericRepository.add(log);
}





