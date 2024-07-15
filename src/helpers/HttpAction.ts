import {  Response } from 'express';
import { insertLog } from '../utils/logsUtils';
import { responseStruct } from '../objects/BodyResObject'
import { getErrorDBbySqlState, getStatus, getMessage } from '../utils/jsonUtils';

/*
    HttpAction is a class for return res status for success and general errors
    This class obtain the data from statusResponse.json &&
    Return to the front end the response struct object with the respective status
    Some of those methods are aync
*/
export default class HttpAction{
    res: Response;
    controllerName: string;
    methodName: string;

    constructor(res: Response, controllerName: string, methodName: string = "") {
        this.res = res;
        this.controllerName = controllerName;
        this.methodName = methodName;

        if(methodName == ""){
            methodName = controllerName;
        }
    }

    getHtml(htmlContent : string){
        this.res.header("Content-Type", "text/html");
        return this.res.send(htmlContent);
    }

    successAction(responseJson : any | null, message : string){
        const status = getStatus("SUCCESS");
        return this.res.status(status.httpStatus).json(
            responseStruct(status, responseJson, getMessage(message))
        ); 
    }

    paramsError() {
        // Get the message
        const status = getStatus("ERROR");
        const message = getMessage("REQUIRED_URL_PARAMS");
        return this.res.status(status.httpStatus).json(
            responseStruct(status, null, message)
        );
    }

    dynamicError(statusCode : string , errorMessage : string) {
        // Get the message
        const status = getStatus(statusCode);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, null, getMessage(errorMessage) )
        );
    }

    async generalError(error : any) {
        // Get the message
        const status = getStatus("ERROR");
        await insertLog(this.methodName, this.controllerName, error.message, 
                            status.httpStatus, "ERROR", null, 
                            getMessage("ERROR_GENERAL"));

        return this.res.status(status.httpStatus).json(
            responseStruct(status, error.message, getMessage("ERROR_GENERAL"))
        ); 
    }

    async databaseError(error : any, id: string | null = null){
        const status = getStatus("ERROR");
        await insertLog(this.methodName, this.controllerName, error.message, 
                        status.httpStatus, "ERROR", id, 
                        getMessage("DATA_BASE_ERROR"));

        const errorJson =  getErrorDBbySqlState(error.message);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, errorJson || error.message, getMessage("DATA_BASE_ERROR"))
        ); 
    }

    unauthorizedError(errorName:string){
      const status = getStatus("UNAUTHORIZED");
      const message = getMessage(errorName);
      return this.res.status(status.httpStatus).json(
          responseStruct(status, null, message)
      );
    }

    validationError(errorName:string){
        console.log("validation");
        const status = getStatus("VALIDATIONS");
        const message = getMessage(errorName);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, null, message)
        );
      }
}

