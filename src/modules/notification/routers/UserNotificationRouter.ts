
import { Router, Request, Response, 
         RequestHandler, RequestHandlerBuilder,
         ControllerObject } from "@modules/index";

import { UserNotification, UserNotificationController, UserNotificationDTO } from '@notification/index'

const route = Router();

const controllerObj: ControllerObject = {
    create: "USER_NOTIFICATION_CREATE",
    update: "NOTIFICATION_UPDATE",
    delete: "NOTIFICATION_DELETE",
    getAll: "NOTIFICATION_READ",
    getById: "NOTIFICATION_GET_BY_ID",
    controller: "UserNotificationController"
};

const controller = new UserNotificationController(UserNotification, controllerObj);

//get by id
//get by notification code
//get by user receive
//get by user send
//insert
//delete with is deleted
//update is read


route.get("/user_notification/get", async (req: Request, res: Response) => {
  
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UserNotificationDTO(req))
                            .setMethod("getUserNotificationById")
                            .isValidateRole()
                            .isLogicalRemove()
                            .build();

    controller.getById(requestHandler);
});



route.get("/user_notification/get_by_filters", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UserNotificationDTO(req))
                            .setMethod("getUserNotification")
                            .isValidateRole()
                            .isLogicalRemove()
                            .build();

    controller.getByFilters(requestHandler);
});

route.post("/user_notification/add", async (req: Request, res: Response) => {

    const requiredBodyList:  Array<string> = 
            [req.body.id_user_receive, req.body.notification_code];

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UserNotificationDTO(req))
                            .setMethod("insertUserNotification")
                            .setRequiredFiles(requiredBodyList)
                            .isValidateRole()
                            .build();

    controller.insert(requestHandler);
});


route.put("/user_notification/is_read", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UserNotificationDTO(req))
                            .setMethod("updateUserNotification")
                            .isValidateRole()
                            .isLogicalRemove()
                            .isValidateWhereByUserId()
                            .build();

    controller.update(requestHandler);
});


route.delete("/user_notification/delete", async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setAdapter(new UserNotificationDTO(req))
                            .setMethod("deleteUserNotification")
                            .isValidateRole()
                            .isLogicalRemove()
                            .build();

    controller.delete(requestHandler);
});
export default route;