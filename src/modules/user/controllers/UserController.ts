import { HttpAction, Validations, config} from "@index/index";

import { GenericController, RequestHandler, JWTObject } from "@modules/index";

import { UserRepository, encryptPassword, 
        decryptPassword, JWTService, UserDTO, 
        User} from "@modules/user";
        
import { insertLogTracking } from "@TenshiJS/utils/logsUtils";
import { getEmailTemplate, getMessageEmail } from "@TenshiJS/utils/htmlTemplateUtils";
import EmailService from "@TenshiJS/services/EmailServices/EmailService";
import { ConstGeneral, ConstHTTPRequest, ConstLogs, ConstMessagesJson, ConstRoles, ConstStatusJson } from "@TenshiJS/consts/Const";
import { ConstTemplate, ConstUrls } from "@index/consts/Const";
const jwt = require('jsonwebtoken');

export default class UserController extends GenericController{
    
    constructor() {
        super(User, new UserRepository);
    }
   
    async update(reqHandler: RequestHandler) : Promise<any>{
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            let id : number | null = null;
            if(jwtData.role == ConstRoles.ADMIN){
                id = validation.validateIdFromQuery();
            }else{
                id = jwtData.id;
            }
             

            if(await this.validateRole(reqHandler,  jwtData.role, this.getControllerObj().update, httpExec) !== true){ return; }
            if(!this.validateRegex(reqHandler, validation)){ return; };
    
            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPutBody();
    
            try{

                if(userBody.password != undefined && userBody.password != null){
                    //Password encryption
                    userBody.password = encryptPassword(userBody.password, config.SERVER.PASSWORD_SALT);
                }
                
                //Execute Action DB
                const user = await this.getRepository().update(id!, userBody, reqHandler.getLogicalDelete());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.UPDATE_SUCCESS);
            
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    async insert(reqHandler: RequestHandler) : Promise<any>{
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(await this.validateRole(reqHandler,  jwtData.role, this.getControllerObj().create, httpExec) !== true){ return; }
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
            if(!this.validateRegex(reqHandler, validation)){ return; };

            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
    
            try{
                //Password encryption
                userBody.password = encryptPassword(userBody.password,  config.SERVER.PASSWORD_SALT);
                userBody.isActive = 1;
    
                //Execute Action DB
                const user = await this.getRepository().add(userBody);
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.INSERT_SUCESS);
            
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    //Logic to register user
    async register(reqHandler: RequestHandler) : Promise<any>{

        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;

            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
            if(!this.validateRequiredFields(reqHandler, validation)){ return; }
            if(!this.validateRegex(reqHandler, validation)){ return; }
    
            
                //Password encryption
                userBody.password = encryptPassword(userBody.password, config.SERVER.PASSWORD_SALT);

                const jwtObj : JWTObject = {
                    id: 0,
                    email: userBody!.email,
                    role: userBody!.role_code
                }
                
                const registerToken = JWTService.generateRegisterToken(jwtObj); 
                userBody.active_register_token = registerToken;

                //set the language
                userBody.language = userBody.language == null ? reqHandler.getRequest().headers[ConstGeneral.HEADER_LANGUAGE] : userBody.language
           
            try{
                //Execute Action DB
                const user = await this.getRepository().add(userBody);

                await insertLogTracking(reqHandler, `Register User ${user.email}`, ConstStatusJson.SUCCESS,
                    JSON.stringify(user), user.id, ConstLogs.LOGIN_TRACKING);

                const variables = {
                    userName: user.first_name + " " + user.last_name,
                    confirmationLink: config.COMPANY.BACKEND_HOST + ConstUrls.CONFIRMATION_REGISTER + registerToken
                };
                const htmlBody = await getEmailTemplate(ConstTemplate.REGISTER_EMAIL, user.language, variables);
                
                const subject = getMessageEmail(ConstTemplate.REGISTER_EMAIL, user.language);
                const emailService = EmailService.getInstance();
                await emailService.sendEmail({
                    toMail: user.email,
                    subject: subject,
                    message: htmlBody,
                    attachments: [] 
                });
             
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.INSERT_SUCESS);
            
            }catch(error : any){
                return await httpExec.databaseError(error, null, 
                    reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    //Logic to login user
    async loginUser(reqHandler: RequestHandler){

        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const userDTO = new UserDTO(reqHandler.getRequest());
            const validation : Validations = reqHandler.getResponse().locals.validation;
            
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
            if(!this.validateRegex(reqHandler, validation)){ return; };
    
            //Get data From Body
            const userBody = userDTO.userFromBodyLogin();
    
            let user;
            try{
                //Execute Action DB
                user = await (this.getRepository() as UserRepository).getUserByEmail(userBody);
                let isSuccess = false;

                if(user != null){

                    //fail login validation
                    if(config.SERVER.FAIL_LOGIN_MAX_NUMBER <= user.fail_login_number || user.is_active == false){
                        return httpExec.dynamicError(ConstStatusJson.UNAUTHORIZED, ConstMessagesJson.USER_FAIL_LOGIN_ERROR);
                    }
                    
                    //decrypt password with server salt
                    const decryptedPass = decryptPassword(user.password, config.SERVER.PASSWORD_SALT);
                    
                    //validate the decrypted pass to the pass in the body json
                    if(decryptedPass == userBody.password){
                        isSuccess = true;
                    }else{

                        user.fail_login_number += 1;
                        user = await this.getRepository().update(user.id, user, reqHandler.getLogicalDelete());

                        await insertLogTracking(reqHandler, `Incorrect Password Login ${userBody.email}`, ConstStatusJson.UNAUTHORIZED,
                            null, user.id, ConstLogs.LOGIN_TRACKING);
                        //incorrect user or password
                        return httpExec.dynamicError(ConstStatusJson.UNAUTHORIZED, ConstMessagesJson.USER_PASS_ERROR);
                    }
                }else{
                    await insertLogTracking(reqHandler, `Email ${userBody.email} not found`, ConstStatusJson.NOT_FOUND, null,
                                      null, ConstLogs.LOGIN_TRACKING);
                    //email not exist
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
                }
    
                if(isSuccess){
                    const screens = await this.getRoleRepository().getScreensByRole(user.role_code);
                    
                    const jwtObj : JWTObject = {
                        id: user.id,
                        email: user.email,
                        role: user.role_code
                    }

                    user.fail_login_number = 0;
                    user.is_active = true;
                    user = await this.getRepository().update(user.id, user, reqHandler.getLogicalDelete());

                    const token = JWTService.generateToken(jwtObj); 
                    const refreshToken = JWTService.generateRefreshToken(jwtObj); 

                    await insertLogTracking(reqHandler, `Last Login ${userBody.email}`, ConstStatusJson.SUCCESS,
                        token, user.id, ConstLogs.LOGIN_TRACKING);

                    return httpExec.successAction(userDTO.tokenToResponse(token, refreshToken, screens), ConstHTTPRequest.LOGIN_SUCCESS);
    
                }else{
                    return httpExec.unauthorizedError(ConstMessagesJson.ROLE_AUTH_ERROR);
                }
    
            }catch(error : any){
                return await httpExec.databaseError(error, null, 
                    reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }



    //Logic to refresh token
    async refreshToken(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const userDTO = new UserDTO(reqHandler.getRequest());
            const refreshToken = reqHandler.getRequest().params.refreshToken;

            let verify = null;
            try {
                  verify =  jwt.verify(refreshToken, config.JWT.REFRESH_TOKEN.SECRET_KEY);
            } catch (error) {
                return httpExec.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
            }

            const jwtObj : JWTObject = {
                id: verify!.id,
                email: verify!.email,
                role: verify!.role_code
            }
        
            const accessToken = JWTService.generateToken(jwtObj);   
            return httpExec.successAction(userDTO.refreshToResponse(accessToken), ConstHTTPRequest.REFRESH_TOKEN_SUCCESS);
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    //Logic active register user
    async activeRegisterUser(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            
            const registerToken = reqHandler.getRequest().params.registerToken;
            let verify = null;
            try {
                verify =  jwt.verify(registerToken, config.JWT.REGISTER_TOKEN.SECRET_KEY);
            } catch (error) {
                return httpExec.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
            }

            const user = await (this.getRepository() as UserRepository).getUserByEmailParam(verify!.email);

            if(user != undefined && user != null){

                user.is_active = true;
                user.fail_login_number = 0;
                await (this.getRepository() as UserRepository).update(user.id, user, reqHandler.getLogicalDelete());


                const variables = {
                    userName: user.first_name + " " + user.last_name,
                    loginUrl: config.COMPANY.LOGIN_URL

                };
                const htmlBody = await getEmailTemplate(ConstTemplate.ACTIVE_ACCOUNT_PAGE, user.language, variables);
                
                return httpExec.getHtml(htmlBody);
            }else{
                return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
            }
            
            
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }

   
    async recoverUserByEmail(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const userDTO = new UserDTO(reqHandler.getRequest());
            const validation : Validations = reqHandler.getResponse().locals.validation;
            
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
            if(!this.validateRegex(reqHandler, validation)){ return; };
    
            //Get data From Body
            const userBody = userDTO.userFromBodyRecoverUserByEmail();
            const user = await (this.getRepository() as UserRepository).getUserByEmailParam(userBody.email);

            if(user != undefined && user != null){

                const jwtObj : JWTObject = {
                    id: 0,
                    email: user.email,
                    role: user.role_code
                }
                
                const recoverEmailToken = JWTService.generateRegisterToken(jwtObj); 

                const variables = {
                    userName: user.first_name + " " + user.last_name,
                    recoverLink: config.COMPANY.BACKEND_HOST + ConstUrls.ACTIVE_USER + recoverEmailToken
                };
                const htmlBody = await getEmailTemplate(ConstTemplate.RECOVER_USER_EMAIL, user.language, variables);

                const subject = getMessageEmail(ConstTemplate.RECOVER_USER_EMAIL,user.language!);
                const emailService = EmailService.getInstance();
                await emailService.sendEmail({
                    toMail: user.email,
                    subject: subject,
                    message: htmlBody,
                    attachments: [] 
                });

                await insertLogTracking(reqHandler, `Recover User ${user.email}`, ConstStatusJson.SUCCESS,
                    null, user.id.toString(), ConstLogs.LOGIN_TRACKING);

                return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);
            }else{
                return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
            }
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    //Sen the email for forgot password
    async forgotPassword(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const email = reqHandler.getRequest().body.email;
            const user = await (this.getRepository() as UserRepository).getUserByEmailParam(email);

            if(user != undefined && user != null){
                const forgotUserPasswordToken = JWTService.generateForgotPasswordToken(email); 
                user.forgot_password_token = forgotUserPasswordToken!;
    
                await (this.getRepository() as UserRepository).update(user.id, user, reqHandler.getLogicalDelete());

                const variables = {
                    userName: user.first_name + " " + user.last_name,
                    resetLink: config.COMPANY.FRONT_END_HOST + ConstUrls.FORGOT_PASSWORD_VERIFICATION + forgotUserPasswordToken
                };
                const htmlBody = await getEmailTemplate(ConstTemplate.FORGOT_PASSWORD_EMAIL, user.language, variables);
                const subject = getMessageEmail(ConstTemplate.FORGOT_PASSWORD_EMAIL, user.language!);

                const emailService = EmailService.getInstance();
                await emailService.sendEmail({
                    toMail: user.email,
                    subject: subject,
                    message: htmlBody,
                    attachments: [] 
                });

                await insertLogTracking(reqHandler, `Forgot passsword ${email}`, ConstStatusJson.SUCCESS,
                    null, user.id.toString(), ConstLogs.LOGIN_TRACKING);

                return httpExec.successAction(null, ConstMessagesJson.EMAIL_SENT_SUCCESS);
            }else{
                return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
            }
            
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    //Logic to verify the forgot password token
    async verifyForgotPassToken(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const forgotPassToken = reqHandler.getRequest().params.forgotPassToken;
            try {
                jwt.verify(forgotPassToken, config.JWT.FORGOT_PASS_TOKEN.SECRET_KEY);
            } catch (error) {
                return httpExec.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
            }

            return reqHandler.getResponse().redirect( config.COMPANY.FRONT_END_HOST + config.COMPANY.RESET_PASSWORD_URL+ forgotPassToken);
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    async resetPassword(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const forgotPassToken = reqHandler.getRequest().params.forgotPassToken;
            const password = reqHandler.getRequest().body.password;

            let verify = null;
            try {
                verify =  jwt.verify(forgotPassToken, config.JWT.FORGOT_PASS_TOKEN.SECRET_KEY);
            } catch (error) {
                return httpExec.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
            }

            try{
                const user = await (this.getRepository() as UserRepository).getUserByEmailParam(verify.email!);

                if(user != undefined && user != null){

                    user.password = encryptPassword(password, config.SERVER.PASSWORD_SALT)!;
                    await (this.getRepository() as UserRepository).update(user.id, user, reqHandler.getLogicalDelete());
                    return httpExec.successAction(user.email, ConstMessagesJson.RESET_PASSWORD);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
                }
            }catch(error : any){
                return await httpExec.databaseError(error, null, 
                    reqHandler.getMethod(), this.getControllerObj().controller);
            }
            
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }
}