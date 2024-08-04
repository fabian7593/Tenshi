import { Request, Response, GenericRoutes,
         RequestHandler, RequestHandlerBuilder} from "@modules/index";
import { default as UserNotificationController } from '@notification/controllers/UserNotificationController';
import { UserNotification, UserNotificationDTO, requiredBodyListUserNotifications } from '@notification/index';

class UserNotificationRoutes extends GenericRoutes {
    constructor() {
        super(new UserNotificationController(UserNotification));
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
  
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotificationById")
                                    .isValidateRole()
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        
        
        this.router.get(`${this.getRouterName()}/get_by_filters`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotification")
                                    .isValidateRole()
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getByFilters(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("insertUserNotification")
                                    .setRequiredFiles(requiredBodyListUserNotifications(req))
                                    .isValidateRole()
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        
        this.router.put(`${this.getRouterName()}/is_read`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("updateUserNotification")
                                    .isValidateRole()
                                    .isLogicalDelete()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("deleteUserNotification")
                                    .isValidateRole()
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default UserNotificationRoutes;
