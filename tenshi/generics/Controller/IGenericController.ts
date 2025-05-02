import RequestHandler from "tenshi/generics/RequestHandler/RequestHandler";

interface IGenericController {
    insert(reqHandler: RequestHandler): Promise<any>;
    update(reqHandler: RequestHandler): Promise<any>;
    delete(reqHandler: RequestHandler): Promise<any>;
    getById(reqHandler: RequestHandler): Promise<any>;
    getByCode(reqHandler: RequestHandler): Promise<any>;
    getAll(reqHandler: RequestHandler): Promise<any>;
    insertMultiple(reqHandler: RequestHandler): Promise<any>;
    updateMultiple(reqHandler: RequestHandler): Promise<any>;
    deleteMultiple(reqHandler: RequestHandler): Promise<any>;
    updateMultipleByIds(reqHandler: RequestHandler): Promise<any>;
}

export default IGenericController;