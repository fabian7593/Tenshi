import { HttpAction, Validations } from "@index/index";
import { GenericController, RequestHandler, fs,JWTObject } from "@modules/index";
import { User, UserRepository, sendMail, replaceCompanyInfoEmails } from '@email/index';

const htmlGenericTemplate : string = fs.readFileSync('src/templates/genericTemplateEmail.html', 'utf-8');


export default  class EmailController extends GenericController{


    async sendMail(reqHandler: RequestHandler) : Promise<any>{
        const successMessage : string = "SEND_MAIL_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(await this.validateRole(reqHandler,  jwtData.role, "SEND_MAIL", httpExec) !== true){ return; }
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
            if(!this.validateRegex(reqHandler, validation)){ return; };

            //Get data From Body
            const emailStructure  = {
                email: reqHandler.getRequest().body.email,
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }
            
            try{

                const user = await (this.getRepository() as UserRepository).getUserByEmailParam(emailStructure.email);

                if(user != undefined && user != null){
                    let htmlBody = replaceCompanyInfoEmails(htmlGenericTemplate);
                    htmlBody = htmlBody.replace(/\{\{ userName \}\}/g, user!.first_name + " " +user!.last_name);
                    htmlBody = htmlBody.replace(/\{\{ emailSubject \}\}/g, emailStructure.subject);
                    htmlBody = htmlBody.replace(/\{\{ emailContent \}\}/g, emailStructure.body);
                
                    await sendMail(emailStructure.email, emailStructure.subject, htmlBody);

                    return httpExec.successAction(null, successMessage);
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "EMAIL_NOT_EXISTS_ERROR");
                }
            }catch(error : any){
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }



    async sendMailByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "SEND_MAIL_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(reqHandler.getFilters() == null){
                return httpExec.paramsError();
            }

            if(await this.validateRole(reqHandler,  jwtData.role, "SEND_MAIL", httpExec) !== true){ return; }
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };
          
            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }


            try{
                //Execute Action DB
                const users : User[] = await (this.getRepository() as UserRepository).findByFilters(reqHandler.getFilters()!,
                                                                reqHandler.getLogicalDelete());

                if(users != undefined && users != null){
                    users.forEach(async user => {
                        let htmlBody = replaceCompanyInfoEmails(htmlGenericTemplate);
                        htmlBody = htmlBody.replace(/\{\{ userName \}\}/g, user!.first_name + " " +user!.last_name);
                        htmlBody = htmlBody.replace(/\{\{ emailSubject \}\}/g, emailStructure.subject);
                        htmlBody = htmlBody.replace(/\{\{ emailContent \}\}/g, emailStructure.body);
                    
                        await sendMail(user.email, emailStructure.subject, htmlBody);
                    });

                }else{
                    return await httpExec.dynamicError("NOT_FOUND", "THERE_ARE_NOT_INFO");
                }

                return httpExec.successAction(null, successMessage);

            }catch(error : any){
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }
}

