import { FindManyOptions} from 'tenshi/generics/index';

interface IGenericRepository {
   
    add(entity: any): Promise<any>;
    update(id: number, newData: Partial<any>, hasLogicalDeleted : boolean): Promise<any | undefined>;

    remove(id: number): Promise<any>;
    logicalRemove(id: number): Promise<any>;

    findById(id: number, hasLogicalDeleted : boolean): Promise<any | undefined>;
    findByCode(code: string, hasLogicalDeleted : boolean): Promise<any | undefined>;
    findByFilters(options: FindManyOptions, hasLogicalDeleted: boolean, page: number, size: number): Promise<any | undefined>;
    findAll(hasLogicalDeleted: boolean, page: number, size: number): Promise<any[] | null>;
}

export default IGenericRepository;