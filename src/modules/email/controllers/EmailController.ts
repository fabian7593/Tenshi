import { HttpAction, Validations } from "@index/index";

import { GenericController, RequestHandler,
         RoleFunctionallity, fs,
         JWTObject, RoleRepository } from "@modules/index";

import { User, UserRepository, sendMail, replaceCompanyInfoEmails } from '@email/index';

const htmlGenericTemplate : string = fs.readFileSync('src/templates/generic_template_email.html', 'utf-8');


export default  class EmailController extends GenericController{


    async sendMail(reqHandler: RequestHandler) : Promise<any>{
        const successMessage : string = "SEND_MAIL_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());
    
        try{
            const repository = new UserRepository();
            const roleRepository = new RoleRepository();
            const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;

            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.getById);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

              //validate required fields of body json
              if(reqHandler.getRequiredFieldsList() != null){
                if(!validation.validateRequiredFields(reqHandler.getRequiredFieldsList())){
                    return;
                }
            }

            //Get data From Body
            const emailStructure  = {
                email: reqHandler.getRequest().body.email,
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }
            
    
            if(reqHandler.getRegexValidatorList() != null){
                if(validation.validateMultipleRegex(reqHandler.getRegexValidatorList()) != null){
                    return;
                }
            }
    
            try{

                const user = await repository.getUserByEmailParam(emailStructure.email);

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
                return await httpExec.dynamicError("ERROR",error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
    }



    async getByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "SEND_MAIL_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse(), this.controllerObj.controller, reqHandler.getMethod());

        try{
            const repository = new UserRepository();
            const roleRepository = new RoleRepository();
            const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
           

            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.getById);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

            if(reqHandler.getFilters() == null){
                return httpExec.paramsError();
            }

            //validate required fields of body json
            if(reqHandler.getRequiredFieldsList() != null){
                if(!validation.validateRequiredFields(reqHandler.getRequiredFieldsList())){
                    return;
                }
            }


            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }


            try{
                //Execute Action DB
                const users : User[] = await repository.findByFilters(reqHandler.getFilters()!,
                                                                reqHandler.getNeedLogicalRemove());

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
                return await httpExec.dynamicError("ERROR",error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
    }
}

