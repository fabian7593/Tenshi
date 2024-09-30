import { Request, IAdapterFromBody } from "@modules/index";
import { UnitDynamicCentral } from '@modules/udc';

export default  class UdcDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    //POST
    entityFromPostBody() : UnitDynamicCentral{
        const entity = new UnitDynamicCentral();
        entity.code = this.req.body.code;
        entity.name = this.req.body.name;
        entity.type = this.req.body.type;
        entity.description = this.req.body.description;
        entity.value1 = this.req.body.value1;
        entity.value2 = this.req.body.value2;
        entity.value3 = this.req.body.value3;
        entity.value4 = this.req.body.value4;
        entity.value5 = this.req.body.value5;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.created_date = new Date();
        return entity;
    }

    entityToResponse(entity: UnitDynamicCentral) : any{
    
        return  {
            id : entity.id,
            code: entity.code,
            name: entity.name,
            type: entity.type,
            description: entity.description ,
            value1: entity.value1,
            value2: entity.value2,
            value3: entity.value3,
            value4: entity.value4,
            value5: entity.value5,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
            user_id: entity.user_id,
            user_updated_id: entity.user_updated_id
        };
    }

    entitiesToResponse(entities: UnitDynamicCentral[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : UnitDynamicCentral{
        const entity = new UnitDynamicCentral();
        entity.name = this.req.body.name;
        entity.type = this.req.body.type;
        entity.description = this.req.body.description;
        entity.value1 = this.req.body.value1;
        entity.value2 = this.req.body.value2;
        entity.value3 = this.req.body.value3;
        entity.value4 = this.req.body.value4;
        entity.value5 = this.req.body.value5;
        entity.country_iso_code = this.req.body.country_iso_code;
        entity.updated_date = new Date();
        entity.user_updated_id = this.req.body.user_updated_id;
        return entity;
    }
}
