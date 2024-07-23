import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes} from "@modules/index";
import { UnitDynamicCentral, UdcDTO } from '@udc/index';
import { injectable } from 'inversify';

@injectable()
class UdcRoutes extends GenericRoutes{
    constructor() {
        super(new GenericController(UnitDynamicCentral));
    }

    protected initializeRoutes() {
        this.router.get(`${this.routerName}/get`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcById")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getById(requestHandler);
        });
        
        this.router.get(`${this.routerName}/get_by_code`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcByCode")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getByCode(requestHandler);
        });
        
        this.router.get(`${this.routerName}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcs")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getAll(requestHandler);
        });
        
        this.router.post(`${this.routerName}/add`, async (req: Request, res: Response) => {
        
            const requiredBodyList:  Array<string> = 
                                    [req.body.code, req.body.name, 
                                    req.body.value1];
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("insertUdc")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole()
                                    .build();
        
            this.controller.insert(requestHandler);
        });
        
        this.router.put(`${this.routerName}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("updateUdc")
                                    .isValidateRole()
                                    .build();
        
            this.controller.update(requestHandler);
        });
        
        this.router.delete(`${this.routerName}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("deleteUdc")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.controller.delete(requestHandler);
        });
    }
}
export default UdcRoutes;