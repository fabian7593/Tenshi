
import { Request, Response, GenericRoutes,
    RequestHandler, RequestHandlerBuilder } from "@modules/index";
import { Log, LogDTO, LogController } from '@modules/log/index';

class LogRoutes extends GenericRoutes {
    constructor() {
        super(new LogController());
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get_by_filters`, async (req: Request, res: Response) => {

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new LogDTO(req))
                                    .setMethod("getLogsByFilter")
                                    .isValidateRole("LOG")
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
        
            const requiredBodyList:  Array<string> = 
                                        [req.body.method, req.body.class, 
                                        req.body.message];
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new LogDTO(req))
                                    .setMethod("insertLog")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("LOG")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
    }
}
export default LogRoutes;