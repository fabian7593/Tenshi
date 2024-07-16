
import { Router, Request, Response, 
    RequestHandler, RequestHandlerBuilder,
    ControllerObject } from "@modules/index";

import { Log, LogDTO, LogController } from '@log/index'

const route = Router();

const controllerObj: ControllerObject = {
    create: "LOG_CREATE",
    update: "LOG_UPDATE",
    delete: "LOG_DELETE",
    getAll: "LOG_READ",
    getById: "LOG_GET_BY_ID",
    controller: "LogController"
};

const controller = new LogController(Log, controllerObj);

route.get("/log/get_by_filters", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new LogDTO(req))
                            .setMethod("getLogsByFilter")
                            .isValidateRole()
                            .build();

    controller.getByFilters(requestHandler);
});

route.post("/log/add", async (req: Request, res: Response) => {

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

    controller.insert(requestHandler);
});

export default route;