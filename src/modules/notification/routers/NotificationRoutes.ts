import { Request, Response, GenericRoutes,
        RequestHandler, RequestHandlerBuilder, 
        GenericController } from "@modules/index";

import { NotificationDTO, Notification, requiredBodyListNotifications, regexValidationList } from '@notification/index';

class NotificationRoutes extends GenericRoutes {
    constructor() {
        super(new GenericController(Notification));
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
  
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("getNotificationById")
                                    .isValidateRole()
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_by_code`, async (req: Request, res: Response) => {
          
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("getNotificationByCode")
                                    .isValidateRole()
                                    .build();
        
            this.getController().getByCode(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("getNotifications")
                                    .isValidateRole()
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("insertNotification")
                                    .setRequiredFiles(requiredBodyListNotifications(req))
                                    .setRegexValidation(regexValidationList(req))
                                    .isValidateRole()
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`,  async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("updateNotification")
                                    .isValidateRole()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("deleteNotification")
                                    .isValidateRole()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default NotificationRoutes;