import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
          GenericRoutes } from "@modules/index";
import {  UserDTO, UserController, 
          regexValidationList, requiredBodyList, 
        } from "@modules/user/index";

class UserRoutes extends GenericRoutes {

    /**
     * Constructor for the UserRoutes class.
     * This class is responsible for initializing the routes for the User module.
     * It creates a new instance of the UserController class, passing in the User entity and
     * UserRepository as parameters.
     */
    constructor() {
        // Call the parent class constructor and pass in a new instance of the UserController
        // class, along with the User entity and UserRepository as parameters.
        super(new UserController());
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("getUserById")
                .isLogicalDelete()
                .isValidateRole("USER")
                .build();

            this.getController().getById(requestHandler);
        });

        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("get_all")
                .isLogicalDelete()
                .isValidateRole("USER")
                .build();

                this.getController().getAll(requestHandler);
        });

        /*
            POST METHODS
        */
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("insertUser")
                .setRegexValidation(regexValidationList(req))
                .setRequiredFiles(requiredBodyList(req))
                .isValidateRole("USER")
                .build();

                (this.getController() as UserController).insert(requestHandler);
        });

        /*
            ANOTHER METHODS
        */
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
           
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("updateUser")
                .setRegexValidation(regexValidationList(req))
                .isValidateRole("USER")
                .build();

                this.getController().update(requestHandler);
        });

        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("deleteUser")
                .isValidateRole("USER")
                .isLogicalDelete()
                .build();

                this.getController().delete(requestHandler);
        });
    }
}

export default UserRoutes;
