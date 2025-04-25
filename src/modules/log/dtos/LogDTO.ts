import { Request, IAdapterFromBody } from "@modules/index";
import { Log } from '@modules/log/index'

export default  class LogDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    entityFromPostBody() : Log{
        const entity = new Log();
        entity.method = this.req.body.method;
        entity.class = this.req.body.class;
        entity.type = this.req.body.type;
        entity.action = this.req.body.action;
        entity.https = this.req.body.https;
        entity.message = this.req.body.message;
        entity.data = this.req.body.data;
        entity.created_date = new Date();
        entity.environment = this.req.body.environment;
        entity.user_id = this.req.body.user_id;
        entity.ip_address = this.req.body.ip_address;

        return entity;
    }


    entityToResponse(entity: Log) : any{
        return  {
            id : entity.id,
            method: entity.method,
            class: entity.class,
            type: entity.type,
            action: entity.action,
            https: entity.https,
            message: entity.message,
            data: entity.data,
            created_date: entity.created_date,
            environment: entity.environment,
            ip_address: entity.ip_address,
            user_id: entity.user_id
        };
    }

    entitiesToResponse(entities: Log[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : Log{
        const entity = new Log();
        return entity;
    }
}
