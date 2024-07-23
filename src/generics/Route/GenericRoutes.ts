import { Router } from "express";
import { default as GenericController} from "@generics/Controller/GenericController";

abstract class GenericRoutes {
    protected router: Router;
    protected controller: GenericController;
    protected routerName: string;

    constructor(controller: GenericController) {
        // Init Router
        this.router = Router();

        // Assign the controller
        this.controller = controller;

        this.routerName = this.controller.controllerObj.route;

        // Init Routes method
        this.initializeRoutes();
    }

    // Abstract method to init routes
    protected abstract initializeRoutes(): void;

    public getRouter(): Router {
        return this.router;
    }
}

export default GenericRoutes;
