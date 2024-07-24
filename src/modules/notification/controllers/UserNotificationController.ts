import { Validations, HttpAction, 
         sendMail, replaceCompanyInfoEmails,
         executeQuery } from "@index/index";

import { GenericRepository, 
         GenericController, RequestHandler,
         RoleFunctionallity,
         JWTObject, fs } from "@modules/index";

import { UserNotification, Notification, User, 
         UserNotificationDTO } from "@notification/index";

import {default as config} from "@root/unbreakable-config";

const htmlGenericTemplate : string = fs.readFileSync('src/templates/generic_template_email.html', 'utf-8');

export default  class UserNotificationController extends GenericController{

    async insert(reqHandler: RequestHandler) : Promise<any>{
        const successMessage : string = "INSERT_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse());
    
        try{
            const repositoryUser = new GenericRepository(User);
            const repositoryNotification = new GenericRepository(Notification);
            const repositoryUserNotification = new GenericRepository(UserNotification);

            const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;

            await this.validateRole(reqHandler,  jwtData.role, this.controllerObj.create, httpExec);
            this.validateRequiredFields(reqHandler, validation);

             //Get data From some tables
             const userNotifications : UserNotification = reqHandler.getAdapter().entityFromPostBody();
             const notification : Notification =
                 await repositoryNotification.findByCode(
                    userNotifications.notification_code, 
                    reqHandler.getNeedLogicalRemove());
             
             if(notification != undefined && notification != null){
                if(notification.required_send_email){
                    const user : User = await repositoryUser.findById(userNotifications.id_user_receive, true);
                    let htmlBody = replaceCompanyInfoEmails(htmlGenericTemplate);
                    htmlBody = htmlBody.replace(/\{\{ userName \}\}/g, user!.first_name + " " +user!.last_name);
                    htmlBody = htmlBody.replace(/\{\{ emailSubject \}\}/g, notification.subject);
                    htmlBody = htmlBody.replace(/\{\{ emailContent \}\}/g, notification.message);
                
                    await sendMail(user.email, notification.subject, htmlBody);
                 }
             }else{
                return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
             }
            

            try{
                //Execute Action DB
                const userNotificationAdded: UserNotification = await repositoryUserNotification.add(userNotifications);
                const responseWithNewAdapter = (reqHandler.getAdapter() as UserNotificationDTO).entityToResponseCompleteInformation(userNotificationAdded, notification);
                return httpExec.successAction(responseWithNewAdapter, successMessage);
            
            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
    }




    async update(reqHandler: RequestHandler): Promise<any>{
        const successMessage : string = "UPDATE_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse());

        try{
             //This is for use the basic CRUD
             const repository = new GenericRepository(UserNotification);

             const repositoryNotification = new GenericRepository(Notification);

             //This is for do validations
             const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
             //get the id from URL params
             const id =  (this.getIdFromQuery(validation, httpExec) as number); 

            await this.validateRole(reqHandler,  jwtData.role, this.controllerObj.create, httpExec);

            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            let userNotification : UserNotification;
            userNotification = await repository.findById(id, reqHandler.getNeedLogicalRemove());

            if(userNotification != undefined && userNotification != null){}
            else{
                return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
            }

            if(reqHandler.getRequireValidWhereByUserId()){
                if(jwtData.role != "ADMIN"){
                    userId = jwtData.id;
                }
             
                if(userNotification != undefined && userNotification != null){
                    if(userId != null && userNotification.id_user_receive != userId){
                        return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                    }
                }else{
                    return httpExec.dynamicError("NOT_FOUND", "DONT_EXISTS");
                }
            }

            userNotification.is_read = true;

            try{
                //Execute Action DB
                const updateEntity = await repositoryNotification.update(id, userNotification,  
                                                             reqHandler.getNeedLogicalRemove());
                const notification : Notification = await repositoryNotification.findByCode(updateEntity.notificationCode, false);

                const responseWithNewAdapter = (reqHandler.getAdapter() as UserNotificationDTO).entityToResponseCompleteInformation(updateEntity, notification);
                return httpExec.successAction(responseWithNewAdapter, successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }


     async getByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse());

        try{
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;

            await this.validateRole(reqHandler,  jwtData.role, this.controllerObj.create, httpExec);

            let userReceive : string | null = null;
            if(reqHandler.getRequest().query['user_receive'] != undefined){
                userReceive = reqHandler.getRequest().query['user_receive'] as string;
            }

            let userSend : string | null = null;
            if(reqHandler.getRequest().query['user_send'] != undefined){
                userSend = reqHandler.getRequest().query['user_send'] as string;
            }

            try{
                //get by url params the page and the size of the response
                const page : number = reqHandler.getRequest().query.page ? 
                            parseInt(reqHandler.getRequest().query.page as string) : 
                            config.HTTP_REQUEST.PAGE_OFFSET;

                const size : number = reqHandler.getRequest().query.size ? 
                            parseInt(reqHandler.getRequest().query.size as string) : 
                            config.HTTP_REQUEST.PAGE_SIZE;

                //Execute Action DB
                const entities = await this.getAllUserNotifications(userReceive, userSend, page, size);

                // Filtrar el OkPacket
                const data = entities.filter((item: any) => !('affectedRows' in item));

                //const entities = await this.getAllUserNotifications();
                return httpExec.successAction(data, successMessage);
            }catch(error : any){
                console.log(error);
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }

 
     async getAllUserNotifications(userReceive : string | null, userSend : string | null,
                                   page: number, size : number ): Promise<any>{
            return await executeQuery(async (conn) => {
                const result = await conn.query(
                    "CALL GetUserNotifications(?, ?, ?, ?)",
                    [userSend, userReceive, size, page] // Valores de los parámetros en el mismo orden que en la consulta
                );
               
             return result;
         });
     }

}