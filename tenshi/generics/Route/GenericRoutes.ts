import { Router } from "express";
import { default as GenericController} from "tenshi/generics/Controller/GenericController";

abstract class GenericRoutes {
    protected router: Router;
    private controller: GenericController;
    private routerName: string;

    constructor(controller: GenericController, routerName: string | null = null) {
        // Init Router
        this.router = Router();

        // Assign the controller
        this.controller = controller;

        if(routerName === null) {
            this.routerName = this.controller.getControllerObj().route;
        }else {
            this.routerName = routerName;
        }
        
        // Init Routes method
        this.initializeRoutes();
    }

    // Abstract method to init routes
    protected abstract initializeRoutes(): void;

    public getRouter(): Router {
        return this.router;
    }

    public getController(): GenericController {
        return this.controller;
    }

    public getRouterName(): string {
        return this.routerName;
    }
}

export default GenericRoutes;
