import { Request, Response, GenericRoutes,
         RequestHandler, RequestHandlerBuilder} from "@modules/index";
import { default as UserNotificationController } from '@modules/notification/controllers/UserNotificationController';
import { UserNotification, UserNotificationDTO, requiredBodyListUserNotifications } from '@modules/notification/index';

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
                                    .isValidateRole("NOTIFICATION")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        
        
        this.router.get(`${this.getRouterName()}/get_by_filters`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("getUserNotification")
                                    .isValidateRole("NOTIFICATION")
                                    .isLogicalDelete()
                                    .build();
        
          //TODO JUST WORK AFTER RUN STORED PROCEDURE src\data\db_scripting\01_db_stored_procedures.sql
          //this.getController().getByFilters(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("insertUserNotification")
                                    .setRequiredFiles(requiredBodyListUserNotifications(req))
                                    .isValidateRole("NOTIFICATION")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        
        this.router.put(`${this.getRouterName()}/is_read`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UserNotificationDTO(req))
                                    .setMethod("updateUserNotification")
                                    .isValidateRole("NOTIFICATION")
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
                                    .isValidateRole("NOTIFICATION")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default UserNotificationRoutes;
