import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
          GenericRoutes } from "@modules/index";
import {  UserDTO, UserController, 
          regexValidationList, requiredBodyList, 
          regexValidationRecoverUserAndPassList, requiredBodyRecoverUserAndPassList
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

        this.router.post(`${this.getRouterName()}/register`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("registerUser")
                .setRegexValidation(regexValidationList(req))
                .setRequiredFiles(requiredBodyList(req))
                .build();

              (this.getController() as UserController).register(requestHandler);
        });

        this.router.post(`${this.getRouterName()}/login`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                new RequestHandlerBuilder(res, req)
                    .setAdapter(new UserDTO(req))
                    .setMethod("loginUser")
                    .setRegexValidation(regexValidationList(req))
                    .build();

            (this.getController() as UserController).loginUser(requestHandler);
        });

        
        this.router.post(`${this.getRouterName()}/logout`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                new RequestHandlerBuilder(res, req)
                    .setMethod("logoutUser")
                    .build();

            (this.getController() as UserController).logoutUser(requestHandler);
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


        /* RECOVER USER */
         // Send email to recover the user in case of inactive account
         this.router.post(`${this.getRouterName()}/recover_user`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("recoverUser")
                .setRegexValidation(regexValidationRecoverUserAndPassList(req))
                .setRequiredFiles(requiredBodyRecoverUserAndPassList(req))
                .build();

            (this.getController() as UserController).recoverUserByEmail(requestHandler);
        });


        this.router.get(`/active_user/:registerToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("ActiveRegisterUser")
                .build();

            (this.getController() as UserController).activeRegisterUser(requestHandler);
        });


        /*
            Correct Functionality Login
        */
        this.router.get(`/refresh_token/:refreshToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("refreshToken")
                .build();

            (this.getController() as UserController).refreshToken(requestHandler);
        });

        this.router.get(`/confirmation_register/:registerToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("confirmationRegister")
                .build();

            (this.getController() as UserController).activeRegisterUser(requestHandler);
        });

        /*
            Forgot Password Logic
        */
        this.router.post(`/forgot_password`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("forgotPassword")
                .setRegexValidation(regexValidationRecoverUserAndPassList(req))
                .setRequiredFiles(requiredBodyRecoverUserAndPassList(req))
                .build();

            (this.getController() as UserController).forgotPassword(requestHandler);
        });

        // Verify the forgot password token and redirect to reset password URL front end
        this.router.get(`/verify_forgot_password/:forgotPassToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("VerifyForgotPassword")
                .build();

            (this.getController() as UserController).verifyForgotPassToken(requestHandler);
        });

        // Reset the password with the pass on the body
        this.router.post(`/reset_password/:forgotPassToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("resetPassword")
                .build();

            (this.getController() as UserController).resetPassword(requestHandler);
        });
    }
}

export default UserRoutes;
