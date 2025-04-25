import { Request, IAdapterFromBody } from "@modules/index";
import { UnitDynamicCentral } from '@modules/udc';

export default  class UdcDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

     private getEntity(isCreating: boolean): UnitDynamicCentral {
        const entity = new UnitDynamicCentral();
        entity.code = this.req.body.code;
        entity.name = this.req.body.name;
        entity.type = this.req.body.type;
        entity.father_code = this.req.body.father_code;
        entity.description = this.req.body.description;
        entity.value1 = this.req.body.value1;
        entity.value2 = this.req.body.value2;
        entity.country_iso_code = this.req.body.country_iso_code;

        if (isCreating) {
            entity.created_date = new Date();
        } 

        return entity;
    }

    //POST
    entityFromPostBody() : UnitDynamicCentral{
        return this.getEntity(true);
    }

     //PUT
     entityFromPutBody() : UnitDynamicCentral{
        return this.getEntity(false);
    }

    entityToResponse(entity: UnitDynamicCentral) : any{
    
        return  {
            id : entity.id,
            code: entity.code,
            name: entity.name,
            type: entity.type,
            father_code: entity.father_code,
            description: entity.description ,
            value1: entity.value1,
            value2: entity.value2,
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
    
}
