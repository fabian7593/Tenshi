import RequestHandler from "tenshi/generics/RequestHandler/RequestHandler";

interface IGenericController {
    insert(reqHandler: RequestHandler): Promise<any>;
    update(reqHandler: RequestHandler): Promise<any>;
    delete(reqHandler: RequestHandler): Promise<any>;
    getById(reqHandler: RequestHandler): Promise<any>;
    getByCode(reqHandler: RequestHandler): Promise<any>;
    getByFilters(reqHandler: RequestHandler): Promise<any>;
    getAll(reqHandler: RequestHandler): Promise<any>;
}

export default IGenericController;