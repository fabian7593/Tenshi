import { Request, IAdapterFromBody } from "@modules/index";
import { Log } from '@log/index'

export default  class LogDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    entityFromPostBody() : Log{
        const entity = new Log();
        entity.method = this.req.body.method;
        entity.class = this.req.body.class;
        entity.type = this.req.body.type || null;
        entity.https = this.req.body.https || null;
        entity.message = this.req.body.message;
        entity.description = this.req.body.description || null;
        entity.created_date = new Date();
        entity.app_guid = this.req.body.app_guid || null;
        entity.environment = this.req.body.environment || null;
        entity.user_id = null;
        return entity;
    }


    entityToResponse(entity: Log) : any{
        return  {
            id : entity.id,
            method: entity.method,
            class: entity.class,
            type: entity.type,
            https: entity.https,
            message: entity.message,
            description: entity.description,
            created_date: entity.created_date,
            app_guid: entity.app_guid,
            environment: entity.environment,
            user_id: entity.user_id
        };
    }

    entitiesToResponse(entities: Log[] | null): any {
        const response: any[] = [];  
        return response;
    }
    
    //PUT
    entityFromPutBody() : Log{
        const entity = new Log();
        return entity;
    }
}
