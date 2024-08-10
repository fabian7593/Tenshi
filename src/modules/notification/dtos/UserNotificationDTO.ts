
import {  Request, IAdapterFromBody } from "@modules/index";
import { Notification, UserNotification } from '@modules/notification/index';

export default  class UserNotificationDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    entityFromPostBody() : UserNotification{
        const entity = new UserNotification();
        entity.id_user_send = this.req.body.id_user_send || null;
        entity.id_user_receive = this.req.body.id_user_receive;
        entity.notification_code = this.req.body.notification_code;
        entity.created_date = new Date();
        return entity;
    }

   

    entityToResponse(entity: UserNotification) : any{
    
        return  {
            id : entity.id,
            id_user_send: entity.id_user_send,
            id_user_receive: entity.id_user_receive,
            notification_code: entity.notification_code,
            is_read: entity.is_read,
            created_date: entity.created_date
        };
    }

    entityToResponseCompleteInformation(entity: UserNotification, notification: Notification) : any{
       
        return  {
            id : entity.id,
            id_user_send: entity.id_user_send,
            id_user_receive: entity.id_user_receive,
            code: entity.notification_code,
            is_read: entity.is_read,
            type: notification.type,
            message: notification.message,
            subject: notification.subject,
            action_url: notification.action_url,
            created_date: entity.created_date,
        };
    }

    entitiesToResponse(entities: UserNotification[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }

    entitiesToResponseCompleteInformation(entities: UserNotification[] | null, notifications: Notification[] | null): any {
        const response: any[] = [];
    
        if(entities != null && notifications != null){
            for (const entity of entities) {
                for (const notif of notifications) {
                    if(entity.notification_code == notif.code){
                        response.push(this.entityToResponseCompleteInformation(entity, notif));
                    }
                }
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : Notification{
        const entity = new Notification();
        return entity;
    }
}
