
import { Router, Request, Response, 
         RequestHandler, RequestHandlerBuilder,
         ControllerObject, GenericController } from "@modules/index";

import { UnitDynamicCentral, UdcDTO } from '@udc/index'

const route = Router();

const controllerObj: ControllerObject = {
    create: "UDC_CREATE",
    update: "UDC_UPDATE",
    delete: "UDC_DELETE",
    getAll: "UDC_READ",
    getById: "UDC_GET_BY_ID",
    controller: "UdcController"
};

const controller = new GenericController(UnitDynamicCentral, controllerObj);

route.get("/udc/get", async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UdcDTO(req))
                            .setMethod("getUdcById")
                            .isValidateRole()
                            .isLogicalRemove()
                            .build();

    controller.getById(requestHandler);
});

route.get("/udc/get_by_code", async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UdcDTO(req))
                            .setMethod("getUdcByCode")
                            .isValidateRole()
                            .isLogicalRemove()
                            .build();

    controller.getByCode(requestHandler);
});

route.get("/udc/get_all", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UdcDTO(req))
                            .setMethod("getUdcs")
                            .isValidateRole()
                            .isLogicalRemove()
                            .build();

    controller.getAll(requestHandler);
});

route.post("/udc/add", async (req: Request, res: Response) => {

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

    controller.insert(requestHandler);
});

route.put("/udc/edit", async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UdcDTO(req))
                            .setMethod("updateUdc")
                            .isValidateRole()
                            .build();

    controller.update(requestHandler);
});

route.delete("/udc/delete", async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UdcDTO(req))
                            .setMethod("deleteUdc")
                            .isValidateRole()
                            .isLogicalRemove()
                            .isValidateWhereByUserId()
                            .build();

    controller.delete(requestHandler);
});

export default route;