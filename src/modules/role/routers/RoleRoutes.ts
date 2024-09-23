import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
          GenericRoutes } from "@modules/index";
import { RoleController } from "@modules/user/index";

class RoleRoutes extends GenericRoutes {

    /**
     * Constructor for the UserRoutes class.
     * This class is responsible for initializing the routes for the User module.
     * It creates a new instance of the UserController class, passing in the User entity and
     * UserRepository as parameters.
     */
    constructor() {
        // Call the parent class constructor and pass in a new instance of the UserController
        // class, along with the User entity and UserRepository as parameters.
        super(new RoleController(), "/role");
    }


    protected initializeRoutes() {
        console.log(this.getRouterName());
        // Get all the roles of the users
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setMethod("GetAllRoles")
                .isValidateRole("ROLE")
                .build();

            this.getController().getAll(requestHandler);
        });
    }
}

export default RoleRoutes;
