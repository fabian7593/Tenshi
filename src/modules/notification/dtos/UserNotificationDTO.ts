
import {  Request, IAdapterFromBody } from "@modules/index";
import { Notification, UserNotification } from '@modules/notification/index';

export default  class UserNotificationDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    entityFromPostBody() : UserNotification{
        const entity = new UserNotification();
        entity.user_send = this.req.body.user_send_id || null;
        entity.user_receive = this.req.body.user_receive_id;
        entity.notification = this.req.body.notification_code;
        entity.created_date = new Date();
        return entity;
    }

   

    entityToResponse(entity: UserNotification) : any{
    
        return  {
            id : entity.id,
            user_send: entity.user_send,
            user_receive: entity.user_receive,
            notification: entity.notification,
            is_read: entity.is_read,
            created_date: entity.created_date
        };
    }

    entityToResponseCompleteInformation(entity: UserNotification, notification: Notification) : any{
       
        return  {
            id : entity.id,
            user_send: entity.user_send,
            user_receive: entity.user_receive,
            notification: entity.notification,
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
                    if(entity.notification.code == notif.code){
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
