
import { Log } from '@entity/Log'
import GenericRepository from '@generics/Repository/GenericRepository';
import {config} from "@index/index"

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

export async function insertLog(method: string, className: string, message: string, 
                                https: number | null,  type: string | null, userId: string | null, 
                                description: string | null) {
    const log = new Log();
    log.method = method;
    log.class = className;
    log.message = message;
    log.https = https;
    log.type = type;
    log.user_id = userId;
    log.description = description;
    log.created_date = new Date();
    log.environment = "BACKEND";

    const genericRepository = new GenericRepository(Log);
    await genericRepository.add(log);
}





