import { HttpAction, Validations,
        sendMail, replaceCompanyInfoEmails} from "@index/index";

import { GenericController, RequestHandler,JWTObject, fs, path } from "@modules/index";

import { UserRepository, encryptPassword, 
        decryptPassword, generateToken, generateRefreshToken, 
        generateRegisterToken, generateForgotPasswordToken,
        UserDTO } from "@user/index";
        
import {default as config} from "@root/unbreakable-config";

const templatesDir = path.join(__dirname, '../../../templates');

const htmlRegisterTemplate : string = fs.readFileSync(path.join(templatesDir, 'register_email.html'), 'utf8');
const htmlActiveAccountTemplate : string = fs.readFileSync(path.join(templatesDir, 'active_account_page.html'), 'utf8');
const htmlforgotPassTemplate: string = fs.readFileSync(path.join(templatesDir, 'forgot_password_email.html'), 'utf8');

const jwt = require('jsonwebtoken');

export default class UserController extends GenericController{
    
    async update(reqHandler: RequestHandler) : Promise<any>{

        const successMessage : string = "UPDATE_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
            const id = validation.validateIdFromQueryUsers(jwtData);

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
                const user = await this.getRepository().update(id, userBody, reqHandler.getLogicalDelete());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), successMessage);
            
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }


    async insert(reqHandler: RequestHandler) : Promise<any>{
        const successMessage : string = "INSERT_SUCCESS";
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
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), successMessage);
            
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

        const successMessage : string = "INSERT_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;

            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
            if(!this.validateRequiredFields(reqHandler, validation)){ return; }
            if(!this.validateRegex(reqHandler, validation)){ return; }
    
            try{
                //Password encryption
                userBody.password = encryptPassword(userBody.password, config.SERVER.PASSWORD_SALT);

                const jwtObj : JWTObject = {
                    id: 0,
                    email: userBody!.email,
                    role: userBody!.role_code
                }
                
                const registerToken = generateRegisterToken(jwtObj); 
                userBody.active_register_token = registerToken;
    
                //Execute Action DB
                const user = await this.getRepository().add(userBody);

                let htmlBody = replaceCompanyInfoEmails(htmlRegisterTemplate);

                htmlBody = htmlBody
                .replace(/\{\{ userName \}\}/g, userBody!.firstName + " " + userBody!.lastName)
                .replace(/\{\{ confirmationLink \}\}/g,  config.COMPANY.BACKEND_HOST + 'confirmation_register/'+ registerToken);
            
                await sendMail(userBody!.email, config.EMAIL.CONTENT.REGISTER_SUBJECT, htmlBody);

                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), successMessage);
            
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
        const successMessage : string = "LOGIN_SUCCESS";
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
                    if(config.GENERAL.FAIL_LOGIN_MAX_NUMBER <= user.fail_login_number || user.is_active == false){
                        return httpExec.dynamicError("UNAUTHORIZED","USER_FAIL_LOGIN_ERROR");
                    }
                    
                    //decrypt password with server salt
                    const decryptedPass = decryptPassword(user.password, config.SERVER.PASSWORD_SALT);
                    
                    //validate the decrypted pass to the pass in the body json
                    if(decryptedPass == userBody.password){
                        isSuccess = true;
                    }else{

                        user.fail_login_number += 1;
                        user = await this.getRepository().update(user.id, user, reqHandler.getLogicalDelete());

                        //incorrect user or password
                        return httpExec.dynamicError("UNAUTHORIZED","USER_PASS_ERROR");
                    }
                }else{
                    //email not exist
                    return httpExec.dynamicError("NOT_FOUND","EMAIL_NOT_EXISTS_ERROR");
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
                    
                    const token = generateToken(jwtObj); 
                    const refreshToken = generateRefreshToken(jwtObj); 
                    return httpExec.successAction(userDTO.tokenToResponse(token, refreshToken, screens), successMessage);
    
                }else{
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
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
        const successMessage : string = "REFRESH_TOKEN_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const userDTO = new UserDTO(reqHandler.getRequest());
            const refreshToken = reqHandler.getRequest().params.refreshToken;

            let verify = null;
            try {
                  verify =  jwt.verify(refreshToken, config.JWT.REFRESH_TOKEN.SECRET_KEY);
            } catch (error) {
                return httpExec.unauthorizedError("INVALID_TOKEN");
            }

            const jwtObj : JWTObject = {
                id: verify!.id,
                email: verify!.email,
                role: verify!.role_code
            }
        
            const accessToken = generateToken(jwtObj);   
            return httpExec.successAction(userDTO.refreshToResponse(accessToken), successMessage);
        } catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }



    //Logic to refresh token
    async activeRegisterUser(reqHandler: RequestHandler){
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            
            const registerToken = reqHandler.getRequest().params.registerToken;
            let verify = null;
            try {
                verify =  jwt.verify(registerToken, config.JWT.REGISTER_TOKEN.SECRET_KEY);
            } catch (error) {
                return httpExec.unauthorizedError("INVALID_TOKEN");
            }

            const user = await (this.getRepository() as UserRepository).getUserByEmailParam(verify!.email);

            if(user != undefined && user != null){

                user!.is_active = true;
                await (this.getRepository() as UserRepository).update(user!.id, user!, reqHandler.getLogicalDelete());
                
                let htmlBody = replaceCompanyInfoEmails(htmlActiveAccountTemplate);
                htmlBody = htmlBody.replace(/\{\{ userName \}\}/g, user!.first_name + " " +user!.last_name);
            
                return httpExec.getHtml(htmlBody);
            }else{
                return httpExec.dynamicError("NOT_FOUND", "EMAIL_NOT_EXISTS_ERROR");
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
                const forgotUserPasswordToken = generateForgotPasswordToken(email); 
                user.forgot_password_token = forgotUserPasswordToken!;
    
                await (this.getRepository() as UserRepository).update(user.id, user, reqHandler.getLogicalDelete());

                let htmlBody = replaceCompanyInfoEmails(htmlforgotPassTemplate);

                htmlBody = htmlBody
                .replace(/\{\{ userName \}\}/g, user!.first_name + " " + user!.last_name)
                .replace(/\{\{ resetLink \}\}/g, config.COMPANY.FRONT_END_HOST + 'verify_forgot_password/' + forgotUserPasswordToken);
            
                await sendMail(user!.email, config.EMAIL.CONTENT.FORGOT_PASS_SUBJECT, htmlBody);

                return httpExec.successAction(null, "EMAIL_SENT_SUCCESS");
            }else{
                return httpExec.dynamicError("NOT_FOUND", "EMAIL_NOT_EXISTS_ERROR");
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
                return httpExec.unauthorizedError("INVALID_TOKEN");
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
                return httpExec.unauthorizedError("INVALID_TOKEN");
            }

            try{
                const user = await (this.getRepository() as UserRepository).getUserByEmailParam(verify.email!);

                if(user != undefined && user != null){

                    user.password = encryptPassword(password, config.SERVER.PASSWORD_SALT)!;
                    await (this.getRepository() as UserRepository).update(user.id, user, reqHandler.getLogicalDelete());
                    return httpExec.successAction(user.email, "RESET_PASSWORD");
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "EMAIL_NOT_EXISTS_ERROR");
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