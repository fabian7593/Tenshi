
import { Request, Response, NextFunction,
        Validations, HttpAction, JWTObject,
        config } from "@index/index";


/*
    Start Middleware class has the function to start the rest before the next function
    You can validate the autorization rest in some paths of the appliation rest
*/
function StartMiddleware(req : Request, res: Response, next: NextFunction) {
    const httpExec = new HttpAction(res, "StartMiddleware");
    const validation = new Validations(req, res, httpExec);
    let jwtData : JWTObject | null = null;
    let nextMethod = false;
    
    //The endpoints that doesnt needs JWT
    if (req.path != '/user/login' && 
        req.path != '/user/add' &&
        !req.path.includes('refresh_token') &&
        !req.path.includes('register') &&
        !req.path.includes('confirmation_register') &&
        !req.path.includes('forgot_password') &&
        !req.path.includes('verify_forgot_pass') &&
        !req.path.includes('reset_password') 
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
    
    //Set in local variables the JWT
    req.app.locals = {
        jwtData
    }

    if(config.SERVER.VALIDATE_API_KEY){
        if(validation.validateRequireSecretApiKey() === true){
            nextMethod = true;
        }else{
            nextMethod = false;
            return; 
        }
    }

    if(nextMethod){
        next();
    }
}
    
export default StartMiddleware;