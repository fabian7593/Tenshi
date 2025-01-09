import { Response } from 'express';
import { insertLogBackend  } from 'tenshi/utils/logsUtils';
import { responseStruct } from 'tenshi/objects/BodyResObject'
import { getErrorDBbySqlState, getStatus, getMessage } from 'tenshi/utils/jsonUtils';
import {  ConstStatusJson, ConstGeneral, ConstMessagesJson } from "tenshi/consts/Const";

/*
    HttpAction is a class for return res status for success and general errors
    This class obtain the data from statusResponse.json &&
    Return to the front end the response struct object with the respective status
    Some of those methods are aync
*/
export default class HttpAction{
    private res: Response;

    constructor(res: Response) {
        this.res = res;
    }

    getHtml(htmlContent : string){
        this.res.header(ConstGeneral.HEADER_TYPE, ConstGeneral.HEADER_HTML);
        return this.res.send(htmlContent);
    }

    successAction(responseJson : any | null, message : string){
        const status = getStatus(ConstStatusJson.SUCCESS);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, responseJson, getMessage(message))
        ); 
    }

    paramsError() {
        // Get the message
        const status = getStatus(ConstStatusJson.ERROR);
        const message = getMessage(ConstMessagesJson.REQUIRED_URL_PARAMS);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, null, message)
        );
    }

    dynamicError(statusCode : string , errorMessage : string = "") {
        // Get the message
        const status = getStatus(statusCode);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, null, getMessage(errorMessage))
        );
    }

    async generalError(error : any, method : string = "", controller : string = "", id : string | null = null) {
        // Get the message
        const status = getStatus(ConstStatusJson.ERROR);
        await insertLogBackend(method, controller, error.message, 
                            status.httpStatus, ConstStatusJson.ERROR, id, 
                            getMessage(ConstMessagesJson.ERROR_GENERAL));

        return this.res.status(status.httpStatus).json(
            responseStruct(status, error.message, getMessage(ConstMessagesJson.ERROR_GENERAL))
        ); 
    }

    async databaseError(error : any, id: string | null = null, method : string = "", controller : string = "") {
        const status = getStatus(ConstStatusJson.ERROR);
        let messageError;

        if(error.message != undefined){
            messageError = error.message;
        }else{
            messageError = error;
        }

        await insertLogBackend(method, controller, messageError, 
                        status.httpStatus, ConstMessagesJson.DATA_BASE_ERROR, id, 
                        getMessage(ConstMessagesJson.DATA_BASE_ERROR));

        let errorJson =  getErrorDBbySqlState(messageError);
        /*if(errorJson != null){
            getErrorDBbyNo
        }*/

        return this.res.status(status.httpStatus).json(
            responseStruct(status, errorJson || messageError, getMessage(ConstMessagesJson.DATA_BASE_ERROR))
        ); 
    }

    unauthorizedError(errorName:string){
      const status = getStatus(ConstStatusJson.UNAUTHORIZED);
      const message = getMessage(errorName);
      return this.res.status(status.httpStatus).json(
          responseStruct(status, null, message)
      );
    }

    validationError(errorName:string){
        const status = getStatus(ConstStatusJson.VALIDATIONS);
        const message = getMessage(errorName);
        return this.res.status(status.httpStatus).json(
            responseStruct(status, null, message)
        );
      }
}

