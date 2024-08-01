
import { Request, Response, NextFunction,
        Validations, HttpAction, JWTObject, debuggingMessage } from "@index/index";
import {default as config} from "@root/unbreakable-config";
import DeviceInfo from '../objects/DeviceInfo';

/*
    Start Middleware class has the function to start the rest before the next function
    You can validate the autorization rest in some paths of the appliation rest
*/
function StartMiddleware(req : Request, res: Response, next: NextFunction) {
    const httpExec = new HttpAction(res);
    const validation = new Validations(req, httpExec);
    let jwtData : JWTObject | null = null;
    let nextMethod = false;

    
    //The endpoints that doesnt needs JWT
    if (req.path != '/user/login' && 
        !req.path.includes('refresh_token') &&
        !req.path.includes('register') &&
        !req.path.includes('confirmation_register') &&
        !req.path.includes('forgot_password') &&
        !req.path.includes('verify_forgot_password') &&
        !req.path.includes('reset_password') &&
        !req.path.includes('recover_user')  &&
        !req.path.includes('active_user')
    ){
        //TODO just for testing
       // if(parseInt(process.env.IS_DEBUGGING || '0', 10) == 0){
            //JWT validation
            jwtData = validation.validateRequireJWT();
            if (jwtData == null) { 
                //send the response res, of the validateRequireJWT function.
                nextMethod = false;
                return; 
            }else{
                nextMethod = true;
            }
        //}
    }else{
        nextMethod = true;
    }
    
    //The endpoints that needs SECRET API KEY Validation
    if(config.SERVER.VALIDATE_API_KEY){
        if (
            !req.path.includes('confirmation_register') &&
            !req.path.includes('verify_forgot_password') &&
            !req.path.includes('active_user')
        ){
            if(validation.validateRequireSecretApiKey() === true){
                nextMethod = true;
            }else{
                nextMethod = false;
                return; 
            }
        }
    }

    //get the ip address
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //get App GUID
    const appGuid = req.headers['app_guid'] || config.GENERAL.APP_GUID;

    const deviceInfo : DeviceInfo | null = getDeviceInfo(req);

    //Set in local variables to use in all request
    res.locals.jwtData = jwtData;
    res.locals.httpExec = httpExec;
    res.locals.validation = validation;
    res.locals.ipAddress = ipAddress;
    res.locals.appGuid = appGuid;
    res.locals.deviceInfo = deviceInfo;

    if(nextMethod){
        next();
    }
}


function getDeviceInfo(req: Request): DeviceInfo | null {
    const deviceInfoHeader = req.headers['device-info'];

    if (typeof deviceInfoHeader === 'string') {
        try {
            // Parse the device-info header
            const deviceInfo: DeviceInfo = JSON.parse(deviceInfoHeader);
            
            // Return the object if parsing was successful
            return deviceInfo;
        } catch (error) {
            //return null if error parsing
            debuggingMessage("Error parsing device-info:" + error);
            return null;
        }
    } else {
        // Return null if header is not a string
        return null;
    }
}
    
export default StartMiddleware;