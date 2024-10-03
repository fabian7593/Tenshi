import { HttpAction, Validations, config} from "@index/index";

import { GenericController, RequestHandler, JWTObject, RoleRepository } from "@modules/index";

import { UserRepository, hashPassword, 
        verifyPassword, JWTService, UserDTO, 
        User} from "@modules/user";
        
import { blockToken } from "@TenshiJS/utils/nodeCacheUtils";
import { insertLogTracking } from "@TenshiJS/utils/logsUtils";
import { getEmailTemplate, getMessageEmail } from "@TenshiJS/utils/htmlTemplateUtils";
import EmailService from "@TenshiJS/services/EmailServices/EmailService";
import { ConstGeneral, ConstHTTPRequest, ConstLogs, ConstMessagesJson, ConstRoles, ConstStatusJson } from "@TenshiJS/consts/Const";
import { ConstTemplate, ConstUrls } from "@index/consts/Const";
import { AccountStatusEnum } from "@TenshiJS/enums/AccountStatusEnum";
import { getIpAddress } from "@TenshiJS/utils/httpUtils";
const jwt = require('jsonwebtoken');

export default class UserController extends GenericController{
    
    constructor() {
        super(User, new UserRepository);
    }
   
    async update(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            let validateId: number | null = null;
            if(jwtData.role == ConstRoles.ADMIN){
                try {
                    // Initialize the ID variable to null
                    // Check if the ID is present in the query string
                    if (reqHandler.getRequest().query[ConstGeneral.ID] != undefined) {
                        // Try to parse the ID from the query string as a number
                        validateId = parseInt(reqHandler.getRequest().query[ConstGeneral.ID] as string, 10);
                    }
                } catch (error: any) {} 
            }else{
                validateId = jwtData.id;
            }

            // Validate the id
            if(validateId === null){ return httpExec.paramsError(); }

             //Get data From Body
             const userBody = reqHandler.getAdapter().entityFromPutBody();
             try{
                 if(userBody.password != undefined && userBody.password != null){
                     //Password encryption
                     userBody.password = await hashPassword(userBody.password);
                 }
                 
                 //Execute Action DB
                 const user = await this.getRepository().update(validateId, userBody, reqHandler.getLogicalDelete());
                 return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.UPDATE_SUCCESS);
             
             }catch(error : any){
                 return await httpExec.databaseError(error, jwtData.id.toString(), 
                 reqHandler.getMethod(), this.getControllerName());
             }
        });
    }


    async insert(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {
            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
                
            try{
                //Password encryption
                userBody.password = await hashPassword(userBody.password);
                //Execute Action DB
                const user = await this.getRepository().add(userBody);
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.INSERT_SUCESS);
            
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData!.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });   
    }


    //Logic to register user
    async register(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
    
            //Password encryption
            userBody.password = await hashPassword(userBody.password);
            userBody.role_code = config.SERVER.CUSTOMER_REGULAR_ROLE;

            const jwtObj : JWTObject = {
                id: 0,
                email: userBody!.email,
                role: config.SERVER.CUSTOMER_REGULAR_ROLE
            }
            
            const registerToken = JWTService.generateRegisterToken(jwtObj); 
            userBody.active_register_token = registerToken;

            //set the language
            userBody.language = userBody.language == null ? reqHandler.getRequest().headers[ConstGeneral.HEADER_LANGUAGE] : config.SERVER.DEFAULT_LANGUAGE;
        
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
                    reqHandler.getMethod(), this.getControllerName());
            }
        });  
    }


    //Logic to login user
    async loginUser(reqHandler: RequestHandler){
        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            //Get data From Body
            const userBody =  (reqHandler.getAdapter() as UserDTO).userFromBodyLogin();
    
            let user;
            try{
                
                //Execute Action DB
                user = await (this.getRepository() as UserRepository).getUserByEmail(userBody);
                let isSuccess = false;

                if(user != null){

                    //fail login validation, suspendend account and send unathorized message
                    if(config.SERVER.FAIL_LOGIN_MAX_NUMBER <= user.fail_login_number || user.is_active_from_email == false){
                        user.account_status = AccountStatusEnum.Suspended;
                        user = await this.getRepository().update(user.id, user, reqHandler.getLogicalDelete());

                        await insertLogTracking(reqHandler, `Trying to Start Session In Suspended Mode ${userBody.email}`, ConstStatusJson.UNAUTHORIZED,
                            null, user.id, ConstLogs.LOGIN_TRACKING);

                        return httpExec.dynamicError(ConstStatusJson.UNAUTHORIZED, ConstMessagesJson.USER_FAIL_LOGIN_ERROR);
                    }
                    
                    //decrypt password with server salt
                    isSuccess = await verifyPassword(userBody.password, user.password);
                    
                    //validate the decrypted pass to the pass in the body json
                    if(!isSuccess){
                        user.fail_login_number += 1;
                        user = await this.getRepository().update(user.id, user, reqHandler.getLogicalDelete());

                        await insertLogTracking(reqHandler, `Incorrect Password Login ${userBody.email}`, ConstStatusJson.UNAUTHORIZED,
                            null, user.id, ConstLogs.LOGIN_TRACKING);
                        //incorrect user or password
                        return httpExec.dynamicError(ConstStatusJson.UNAUTHORIZED, ConstMessagesJson.USER_PASS_ERROR);
                    }
                }else{
                    await insertLogTracking(reqHandler, `Email or Username ${userBody.email} not found`, ConstStatusJson.NOT_FOUND, null,
                                      null, ConstLogs.LOGIN_TRACKING);
                    //email not exist
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
                }
    
                if(isSuccess){
                    const roleRepository : RoleRepository = await RoleRepository.getInstance();
                    const screens = await roleRepository.getScreensByRole(user.role_code);
                    
                    const jwtObj : JWTObject = {
                        id: user.id,
                        email: user.email,
                        role: user.role_code
                    }

                    user.fail_login_number = 0;
                    user.is_active_from_email = true;
                    user.account_status = AccountStatusEnum.Active;
                    user.last_login_at = new Date();
                    user.login_ip_address = getIpAddress(reqHandler.getRequest());
                    user = await this.getRepository().update(user.id, user, reqHandler.getLogicalDelete());

                    const token = JWTService.generateToken(jwtObj); 
                    const refreshToken = JWTService.generateRefreshToken(jwtObj); 

                    await insertLogTracking(reqHandler, `Last Login ${userBody.email}`, ConstStatusJson.SUCCESS,
                        token, user.id, ConstLogs.LOGIN_TRACKING);

                    return httpExec.successAction((reqHandler.getAdapter() as UserDTO).tokenToResponse(token, refreshToken, screens), ConstHTTPRequest.LOGIN_SUCCESS);
    
                }else{
                    return httpExec.unauthorizedError(ConstMessagesJson.ROLE_AUTH_ERROR);
                }
    
            }catch(error : any){
                return await httpExec.databaseError(error, null, 
                    reqHandler.getMethod(), this.getControllerName());
            }
        });
    }


    async logoutUser(reqHandler: RequestHandler){

        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
        const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

        try{
            try {
               const jwtAuth = reqHandler.getRequest().headers[ConstGeneral.HEADER_AUTH];
               if (typeof jwtAuth === 'string') {
                   await blockToken(jwtAuth);
                   await insertLogTracking(reqHandler, `Logout ${jwtData.email}`, ConstStatusJson.SUCCESS,
                    null, String(jwtData.id), ConstLogs.LOGIN_TRACKING);
                   return httpExec.successAction(null, ConstHTTPRequest.LOGOUT_SUCCESS);
               } 
            } catch (error) {
                return httpExec.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }




    //Logic to refresh token
    async refreshToken(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
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
            return httpExec.successAction((reqHandler.getAdapter() as UserDTO).refreshToResponse(accessToken), ConstHTTPRequest.REFRESH_TOKEN_SUCCESS);
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
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

                user.is_active_from_email = true;
                user.account_status = AccountStatusEnum.Active;
                user.fail_login_number = 0;
                user.verified_at = new Date();
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
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }

   
    async recoverUserByEmail(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
            if(!this.validateRegex(reqHandler, validation)){ return; };
    
            //Get data From Body
            const userBody = (reqHandler.getAdapter() as UserDTO).userFromBodyRecoverUserByEmail();
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
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
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
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
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
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
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

                    user.password = await hashPassword(password)!;
                    await (this.getRepository() as UserRepository).update(user.id, user, reqHandler.getLogicalDelete());
                    return httpExec.successAction(user.email, ConstMessagesJson.RESET_PASSWORD);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
                }
            }catch(error : any){
                return await httpExec.databaseError(error, null, 
                    reqHandler.getMethod(), this.getControllerName());
            }
            
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }
}