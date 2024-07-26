import { Request, Response, GenericRoutes,
         RequestHandler, RequestHandlerBuilder} from "@modules/index";
import { default as UserNotificationController } from '@notification/controllers/UserNotificationController';
import { UserNotification, UserNotificationDTO } from '@notification/index';
import { injectable } from 'inversify';

@injectable()
class UserNotificationRoutes extends GenericRoutes {
    constructor() {
        super(new UserNotificationController(UserNotification));
    }

    protected initializeRoutes() {
        this.router.get(`${this.routerName}/get`, async (req: Request, res: Response) => {
  
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotificationById")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getById(requestHandler);
        });
        
        
        
        this.router.get(`${this.routerName}/get_by_filters`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotification")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getByFilters(requestHandler);
        });
        
        this.router.post(`${this.routerName}/add`, async (req: Request, res: Response) => {
        
            const requiredBodyList:  Array<string> = 
                    [req.body.id_user_receive, req.body.notification_code];
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("insertUserNotification")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole()
                                    .build();
        
            this.controller.insert(requestHandler);
        });
        
        
        this.router.put(`${this.routerName}/is_read`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("updateUserNotification")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.controller.update(requestHandler);
        });
        
        
        this.router.delete(`${this.routerName}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("deleteUserNotification")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.delete(requestHandler);
        });
    }
}

export default UserNotificationRoutes;
