import { Request, IAdapterFromBody } from "@modules/index";
import { Notification } from '@modules/notification/index';

export default  class NotificationDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    entityFromPostBody() : Notification{
        const entity = new Notification();
        entity.code = this.req.body.code;
        entity.type = this.req.body.type || null;
        entity.subject = this.req.body.subject;
        entity.message = this.req.body.message;
        entity.required_send_email = this.req.body.required_send_email || null;
        entity.is_delete_after_read = this.req.body.is_delete_after_read || null;
        entity.action_url = this.req.body.action_url || null;
        entity.language = this.req.body.language;
        entity.created_date = new Date();
        return entity;
    }


    entityToResponse(entity: Notification) : any{
    
        return  {
            id : entity.id,
            code: entity.code,
            type: entity.type,
            subject: entity.subject,
            message: entity.message,
            required_send_email: entity.required_send_email,
            is_delete_after_read: entity.is_delete_after_read,
            action_url: entity.action_url,
            language: entity.language,
            created_date: entity.created_date
        };
    }

    entitiesToResponse(entities: Notification[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : Notification{
        const entity = new Notification();
        entity.code = this.req.body.code;
        entity.type = this.req.body.type || null;
        entity.subject = this.req.body.subject;
        entity.message = this.req.body.message;
        entity.required_send_email = this.req.body.required_send_email || null;
        entity.is_delete_after_read = this.req.body.is_delete_after_read || null;
        entity.action_url = this.req.body.action_url || null;
        entity.language = this.req.body.language || null;
        return entity;
    }
}
