import { Validations, HttpAction, 
         sendMail, executeQuery, config } from "@index/index";

import { GenericRepository, 
         GenericController, RequestHandler,
         JWTObject } from "@modules/index";

import { UserNotification, Notification, User, 
         UserNotificationDTO } from "@modules/notification/index";

import { getEmailTemplate } from "@TenshiJS/utils/htmlTemplateUtils";

export default  class UserNotificationController extends GenericController{

    async insert(reqHandler: RequestHandler) : Promise<any>{
        const successMessage : string = "INSERT_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try{
            const repositoryUser = new GenericRepository(User);
            const repositoryNotification = new GenericRepository(Notification);
            const repositoryUserNotification = new GenericRepository(UserNotification);

            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(await this.validateRole(reqHandler,  jwtData.role, this.getControllerObj().create, httpExec) !== true){ return; }
            if(!this.validateRequiredFields(reqHandler, validation)){ return; };

             //Get data From some tables
             const userNotifications : UserNotification = reqHandler.getAdapter().entityFromPostBody();
             const notification : Notification =
                 await repositoryNotification.findByCode(
                    userNotifications.notification_code, 
                    reqHandler.getLogicalDelete());
             
             if(notification != undefined && notification != null){
                if(notification.required_send_email){
                    const user : User = await repositoryUser.findById(userNotifications.id_user_receive, true);
                    
                    const variables = {
                        userName: user.first_name + " " + user.last_name,
                        emailSubject: notification.subject,
                        emailContent: notification.message
                    };
                    const htmlBody = await getEmailTemplate("genericTemplateEmail", user.language, variables);
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
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }




    async update(reqHandler: RequestHandler): Promise<any>{
        const successMessage : string = "UPDATE_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             //This is for use the basic CRUD
             const repository = new GenericRepository(UserNotification);

             const repositoryNotification = new GenericRepository(Notification);

             //This is for do validations
             const validation : Validations = reqHandler.getResponse().locals.validation;
             //This calls the jwt data into JWTObject
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             //get the id from URL params
             const id =  (this.getIdFromQuery(validation, httpExec) as number); 

            if(await this.validateRole(reqHandler,  jwtData.role, this.getControllerObj().update, httpExec) !== true){ return; }

            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            let userNotification : UserNotification;
            userNotification = await repository.findById(id, reqHandler.getLogicalDelete());

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
                                                             reqHandler.getLogicalDelete());
                const notification : Notification = await repositoryNotification.findByCode(updateEntity.notificationCode, false);

                const responseWithNewAdapter = (reqHandler.getAdapter() as UserNotificationDTO).entityToResponseCompleteInformation(updateEntity, notification);
                return httpExec.successAction(responseWithNewAdapter, successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
     }


     async getByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(await this.validateRole(reqHandler,  jwtData.role, this.getControllerObj().getById, httpExec) !== true){ return; }

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
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
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