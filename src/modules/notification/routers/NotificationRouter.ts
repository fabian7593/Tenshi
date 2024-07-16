
import { Router, Request, Response, 
    RequestHandler, RequestHandlerBuilder,
    ControllerObject, GenericController } from "@modules/index";

import { NotificationDTO, Notification } from '@notification/index'


const route = Router();

const controllerObj: ControllerObject = {
    create: "NOTIFICATION_CREATE",
    update: "NOTIFICATION_UPDATE",
    delete: "NOTIFICATION_DELETE",
    getAll: "NOTIFICATION_READ",
    getById: "NOTIFICATION_GET_BY_ID",
    controller: "NotificationController"
};

const controller = new GenericController(Notification, controllerObj);


route.get("/notification/get", async (req: Request, res: Response) => {
  
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new NotificationDTO(req))
                            .setMethod("getNotificationById")
                            .isValidateRole()
                            .build();

    controller.getById(requestHandler);
});

route.get("/notification/get_by_code", async (req: Request, res: Response) => {
  
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new NotificationDTO(req))
                            .setMethod("getNotificationByCode")
                            .isValidateRole()
                            .build();

    controller.getByCode(requestHandler);
});

route.get("/notification/get_all", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new NotificationDTO(req))
                            .setMethod("getNotifications")
                            .isValidateRole()
                            .build();

    controller.getAll(requestHandler);
});

route.post("/notification/add", async (req: Request, res: Response) => {


    const requiredBodyList:  Array<string> = 
                                [req.body.code, req.body.subject, 
                                req.body.message];

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new NotificationDTO(req))
                            .setMethod("insertNotification")
                            .setRequiredFiles(requiredBodyList)
                            .isValidateRole()
                            .build();

    controller.insert(requestHandler);
});

route.put("/notification/edit",  async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new NotificationDTO(req))
                            .setMethod("updateNotification")
                            .isValidateRole()
                            .isValidateWhereByUserId()
                            .build();

    controller.update(requestHandler);
});


route.delete("/notification/delete", async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new NotificationDTO(req))
                            .setMethod("deleteNotification")
                            .isValidateRole()
                            .build();

    controller.delete(requestHandler);
});
export default route;