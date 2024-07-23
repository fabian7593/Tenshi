
import { Request, Response, GenericRoutes,
    RequestHandler, RequestHandlerBuilder } from "@modules/index";
import { Log, LogDTO, LogController } from '@log/index';

class LogRoutes extends GenericRoutes {
    constructor() {
        super(new LogController(Log));
    }

    protected initializeRoutes() {
        this.router.get(`${this.routerName}/get_by_filters`, async (req: Request, res: Response) => {

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new LogDTO(req))
                                    .setMethod("getLogsByFilter")
                                    .isValidateRole()
                                    .build();
        
            this.controller.getByFilters(requestHandler);
        });
        
        this.router.post(`${this.routerName}/add`, async (req: Request, res: Response) => {
        
            const requiredBodyList:  Array<string> = 
                                        [req.body.method, req.body.class, 
                                        req.body.message];
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new LogDTO(req))
                                    .setMethod("insertLog")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole()
                                    .build();
        
            this.controller.insert(requestHandler);
        });
    }
}
export default LogRoutes;