import { HttpAction, Validations } from "@index/index";
import { GenericController, RequestHandler, JWTObject } from "@modules/index";
import { User, UserRepository } from '@modules/email/index';
import { getEmailTemplate } from "@TenshiJS/utils/htmlTemplateUtils";
import {  ConstHTTPRequest, ConstStatusJson,  ConstMessagesJson, ConstFunctions } from "@TenshiJS/consts/Const";
import EmailService from "@TenshiJS/services/EmailServices/EmailService";
import { ConstTemplate } from "@index/consts/Const";

export default  class EmailController extends GenericController{

    constructor() {
        super(User, new UserRepository);
    }

    /**
     * Sends an email to a user based on the provided email address.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @returns {Promise<any>} A promise that resolves with the result of the email sending operation.
     */
    async sendMailController(reqHandler: RequestHandler) : Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {
       
            // Get the email structure from the request body
            const emailStructure  = {
                email: reqHandler.getRequest().body.email,
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            try {
                // Get the user based on the email address
                const user = await (this.getRepository() as UserRepository).getUserByEmailParam(emailStructure.email);

                if (user != undefined && user != null) {
                    // Prepare the email variables
                    const variables = {
                        userName: user.first_name + " " + user.last_name,
                        emailSubject: emailStructure.subject,
                        emailContent: emailStructure.body
                    };

                    // Generate the HTML body of the email using the email template
                    const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, user.language, variables);

                    // Send the email to the user
                    const emailService = EmailService.getInstance();
                    await emailService.sendEmail({
                        toMail: user.email,
                        subject: emailStructure.subject,
                        message: htmlBody,
                        attachments: [] 
                    });

                    // Return success response
                    return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);
                } else {
                    // Return error response if the user does not exist
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
                }
            } catch (error : any) {
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        } );
    }


    /**
     * Sends an email to users based on specified filters.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @return {Promise<any>} - A promise that resolves to the response object.
     */
    async sendMailByFilters(reqHandler: RequestHandler): Promise<any> {
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            // Check if filters are provided
            if(this.validateHaveFilters(reqHandler, httpExec) !== true){ return; }

            // Validate role
            if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.CREATE, httpExec) !== true){ 
                return; 
            }

            // Validate required fields
            if(!this.validateRequiredFields(reqHandler, validation)){ 
                return; 
            }
         
            // Prepare email structure
            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            try{
                // Get users based on filters
                const users : User[] = await (this.getRepository() as UserRepository).findByFilters(reqHandler.getFilters()!,
                                                                reqHandler.getLogicalDelete());

                if(users != undefined && users != null){
                    // Iterate over each user and send email
                    users.forEach(async (user) => {
                        const variables = {
                            userName: user.first_name + " " + user.last_name,
                            emailSubject: emailStructure.subject,
                            emailContent: emailStructure.body
                        };
                        const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, user.language, variables);
                        const emailService = EmailService.getInstance();
                        await emailService.sendEmail({
                            toMail: user.email,
                            subject: emailStructure.subject,
                            message: htmlBody,
                            attachments: [] 
                        });
    
                    });

                }else{
                    // Return error response if no users found
                    return await httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.THERE_ARE_NOT_INFO);
                }

                // Return success response
                return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);

            }catch(error : any){
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        }catch(error : any){
            // Return general error response if any exception occurs
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }
}

