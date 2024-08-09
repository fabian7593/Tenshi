
import { Request, Response, NextFunction,
    Validations, HttpAction, JWTObject, debuggingMessage, config } from "@index/index";
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
   

    const isPageOutJwt = config.HTTP_REQUEST.PAGE_OUT_JWT.some(path => req.path.includes(path));
    const isPageOutApiKey = config.HTTP_REQUEST.PAGE_OUT_API_KEY.some(path => req.path.includes(path));

    // The endpoints that don't need JWT
    if (!isPageOutJwt) {
        // JWT validation
        jwtData = validation.validateRequireJWT();
        if (jwtData == null) { 
            // Send the response res, of the validateRequireJWT function.
            nextMethod = false;
            return; 
        } else {
            nextMethod = true;
        }
    } else {
        nextMethod = true;
    }

    // The endpoints that need SECRET API KEY Validation
    if (config.SERVER.VALIDATE_API_KEY) {
        if (!isPageOutApiKey) {
            if (validation.validateRequireSecretApiKey() === true) {
                nextMethod = true;
            } else {
                nextMethod = false;
                return; 
            }
        }
    }

    //get the ip address
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const deviceInfo : DeviceInfo | null = getDeviceInfo(req);

    //Set in local variables to use in all request
    res.locals.jwtData = jwtData;
    res.locals.httpExec = httpExec;
    res.locals.validation = validation;
    res.locals.ipAddress = ipAddress;
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