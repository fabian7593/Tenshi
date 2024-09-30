import JWTObject from "tenshi/objects/JWTObject";
import RequestHandler from "../RequestHandler/RequestHandler";
import HttpAction from "tenshi/helpers/HttpAction";

interface IGenericService {
    
    insertService(reqHandler: RequestHandler, executeInsertFunction: (jwtData : JWTObject | null, httpExec: HttpAction) => void): Promise<any>;
    updateService(reqHandler: RequestHandler, executeUpdateFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number) => void): Promise<any>;
    deleteService(reqHandler: RequestHandler, executeDeleteFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number) => void): Promise<any>;
    getByIdService(reqHandler: RequestHandler, executeGetByIdFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number) => void): Promise<any>;
    getByCodeService(reqHandler: RequestHandler, executeGetByCodeFunction: (jwtData : JWTObject, httpExec: HttpAction, code: string) => void): Promise<any>;
    getAllService(reqHandler: RequestHandler, executeGetAllFunction: (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => void): Promise<any>;
    getByFiltersService(reqHandler: RequestHandler, executeGetByFiltersFunction: (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => void): Promise<any>;
    setControllerName(controllerName: string):void;
}

export default IGenericService;