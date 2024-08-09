
import { Request, Response, NextFunction,
    Validations, HttpAction, JWTObject, debuggingMessage, config } from "@index/index";
import DeviceInfo from '@objects/DeviceInfo';
import { ConstGeneral, ConstMessages } from "@index/consts/Const";

/**
 * Start Middleware function is the first middleware to be executed in the application.
 * It is responsible for validating the authorization of the request in specific paths.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {NextFunction} next - The next middleware function.
 */
function StartMiddleware(req : Request, res: Response, next: NextFunction) {
    // Create HttpAction object to handle the response
    const httpExec = new HttpAction(res);

    // Create Validations object to handle the request validation
    const validation = new Validations(req, httpExec);

    // Initialize variables
    let jwtData : JWTObject | null = null;
    let nextMethod = false;

    // Check if the request path is excluded from JWT validation
    const isPageOutJwt = config.HTTP_REQUEST.PAGE_OUT_JWT.some(path => req.path.includes(path));

    // Check if the request path is excluded from API Key validation
    const isPageOutApiKey = config.HTTP_REQUEST.PAGE_OUT_API_KEY.some(path => req.path.includes(path));

    // Validate JWT if the request path is not excluded
    if (!isPageOutJwt) {
        jwtData = validation.validateRequireJWT();

        // If JWT validation fails, send the response and stop the execution
        if (jwtData == null) { 
            nextMethod = false;
            return; 
        } else {
            nextMethod = true;
        }
    } else {
        nextMethod = true;
    }

    // Validate API Key if the request path is not excluded and API Key validation is enabled
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

    // Get the IP address of the request
    const ipAddress = req.ip || req.headers[ConstGeneral.HEADER_X_FORWARDED_FOR] || req.connection.remoteAddress;

    // Get the device information from the request headers
    const deviceInfo : DeviceInfo | null = getDeviceInfo(req);

    // Set the local variables to be used in all subsequent middleware
    res.locals.jwtData = jwtData;
    res.locals.httpExec = httpExec;
    res.locals.validation = validation;
    res.locals.ipAddress = ipAddress;
    res.locals.deviceInfo = deviceInfo;

    // Execute the next middleware if the request can proceed
    if(nextMethod){
        next();
    }
}



/**
 * Retrieves the device information from the request headers.
 *
 * @param {Request} req - The request object.
 * @return {DeviceInfo | null} The device information object if available, otherwise null.
 */
function getDeviceInfo(req: Request): DeviceInfo | null {
    // Get the device-info header from the request headers
    const deviceInfoHeader = req.headers[ConstGeneral.HEADER_DEVICE_INFO];

    // Check if the device-info header is a string
    if (typeof deviceInfoHeader === 'string') {
        try {
            // Parse the device-info header as JSON
            const deviceInfo: DeviceInfo = JSON.parse(deviceInfoHeader);
            
            // If parsing is successful, return the device information object
            return deviceInfo;
        } catch (error) {
            // If parsing fails, log an error message and return null
            debuggingMessage(ConstMessages.ERROR_PARSING_DEVIDE_INFO + error);
            return null;
        }
    } else {
        // If the device-info header is not a string, return null
        return null;
    }
}


export default StartMiddleware;