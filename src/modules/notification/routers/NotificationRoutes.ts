import { Request, Response, GenericRoutes,
        RequestHandler, RequestHandlerBuilder, 
        GenericController } from "@modules/index";

import { NotificationDTO, Notification } from '@notification/index';

class NotificationRoutes extends GenericRoutes {
    constructor() {
        super(new GenericController(Notification));
    }

    protected initializeRoutes() {
        this.router.get(`${this.routerName}/get`, async (req: Request, res: Response) => {
  
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("getNotificationById")
                                    .isValidateRole()
                                    .build();
        
            this.controller.getById(requestHandler);
        });
        
        this.router.get(`${this.routerName}/get_by_code`, async (req: Request, res: Response) => {
          
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("getNotificationByCode")
                                    .isValidateRole()
                                    .build();
        
            this.controller.getByCode(requestHandler);
        });
        
        this.router.get(`${this.routerName}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("getNotifications")
                                    .isValidateRole()
                                    .build();
        
            this.controller.getAll(requestHandler);
        });
        
        this.router.post(`${this.routerName}/add`, async (req: Request, res: Response) => {
        
        
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
        
            this.controller.insert(requestHandler);
        });
        
        this.router.put(`${this.routerName}/edit`,  async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("updateNotification")
                                    .isValidateRole()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.controller.update(requestHandler);
        });
        
        
        this.router.delete(`${this.routerName}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new NotificationDTO(req))
                                    .setMethod("deleteNotification")
                                    .isValidateRole()
                                    .build();
        
            this.controller.delete(requestHandler);
        });
    }
}

export default NotificationRoutes;