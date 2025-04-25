import { structPagination } from '@TenshiJS/objects/BodyResObject';
import { FindManyOptions} from 'tenshi/generics/index';

interface IGenericRepository {
   
    add(entity: any): Promise<any>;
    update(id: number|string, newData: Partial<any>, hasLogicalDeleted : boolean): Promise<any | undefined>;

    remove(id: number|string): Promise<any>;
    removeByOptions(options: FindManyOptions | null): Promise<any>;
    logicalRemove(id: number|string): Promise<any>;

    findByOptions(hasLogicalDeleted: boolean, isFindAll : boolean, options: FindManyOptions | null): Promise<any | undefined>;
    findById(id: number|string, hasLogicalDeleted: boolean, options: FindManyOptions | null): Promise<any | undefined>;
    findByCode(code: string, hasLogicalDeleted: boolean, options: FindManyOptions | null): Promise<any | undefined>;
    findAll(hasLogicalDeleted: boolean, options: FindManyOptions | null, page: number, size: number): Promise<any[] | null>;
    count(hasLogicalDeleted: boolean, options: FindManyOptions | null, page: number, size: number): Promise<structPagination | null>;
}

export default IGenericRepository;