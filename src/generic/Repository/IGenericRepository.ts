import { EntityTarget, FindManyOptions } from "typeorm";
interface IGenericRepository {
   
    add(entity: any): Promise<any>;
    update(entityType: EntityTarget<any>, id: number, 
           newData: Partial<any>, hasLogicalDeleted : boolean): Promise<any | undefined>;

    remove(entityType: EntityTarget<any>, id: number): Promise<any>;
    logicalRemove(entityType: EntityTarget<any>, id: number): Promise<any>;

    findById(entityType: EntityTarget<any>, id: number, hasLogicalDeleted : boolean): Promise<any | undefined>;
    findByCode(entityType: EntityTarget<any>, code: string, hasLogicalDeleted : boolean): Promise<any | undefined>;
    findByFilters(entityType: EntityTarget<any>, options: FindManyOptions, hasLogicalDeleted: boolean, page: number, size: number): Promise<any | undefined>;
    findAll(entityType: EntityTarget<any>, hasLogicalDeleted: boolean, page: number, size: number): Promise<any[] | null>;
}

export default IGenericRepository;