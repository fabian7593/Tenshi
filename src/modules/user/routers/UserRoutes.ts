import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
          GenericRoutes } from "@modules/index";
import { UserController, UserDTO, User } from "@user/index";
import { injectable } from "inversify";

@injectable()
class UserRoutes extends GenericRoutes {
    constructor() {
        super(new UserController(User));
    }

    protected initializeRoutes() {
        this.router.get(`${this.routerName}/get`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("getUserById")
                .isLogicalRemove()
                .isValidateRole()
                .build();

            this.controller.getById(requestHandler);
        });

        this.router.get(`${this.routerName}/get_all`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("get_all")
                .isLogicalRemove()
                .isValidateRole()
                .build();

            this.controller.getAll(requestHandler);
        });

        /*
            POST METHODS
        */
        this.router.post(`${this.routerName}/add`, async (req: Request, res: Response) => {
            const regexValidationList: [string, string][] = [
                ['EMAIL_REGEX', req.body.email as string],
                ['PASSWORD_REQUIRED_REGEX', req.body.password as string]
            ];

            const requiredBodyList: string[] = 
                                [req.body.first_name, req.body.last_name, 
                                req.body.email, req.body.password, 
                                req.body.role_code];

            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("insertUser")
                .setRegexValidation(regexValidationList)
                .setRequiredFiles(requiredBodyList)
                .isValidateRole()
                .build();

            this.controller.insert(requestHandler);
        });

        this.router.post(`${this.routerName}/register`, async (req: Request, res: Response) => {
            const regexValidationList: [string, string][] = [
                ['EMAIL_REGEX', req.body.email as string],
                ['PASSWORD_REQUIRED_REGEX', req.body.password as string]
            ];

            const requiredBodyList: string[] = 
                                [req.body.first_name, req.body.last_name, 
                                req.body.email, req.body.password, 
                                req.body.role_code];

            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("registerUser")
                .setRegexValidation(regexValidationList)
                .setRequiredFiles(requiredBodyList)
                .build();

            (this.controller as UserController).register(requestHandler);
        });

        this.router.post(`${this.routerName}/login`, async (req: Request, res: Response) => {
            const regexValidationList: [string, string][] = [
                ['EMAIL_REGEX', req.body.email],
                ['PASSWORD_REQUIRED_REGEX', req.body.password]
            ];

            const requestHandler: RequestHandler = 
                new RequestHandlerBuilder(res, req)
                    .setAdapter(new UserDTO(req))
                    .setMethod("loginUser")
                    .setRegexValidation(regexValidationList)
                    .build();

            (this.controller as UserController).loginUser(requestHandler);
        });

        /*
            ANOTHER METHODS
        */
        this.router.put(`${this.routerName}/edit`, async (req: Request, res: Response) => {
            const regexValidationList: [string, string][] = [
                ['EMAIL_REGEX', req.body.email as string],
                ['PASSWORD_REQUIRED_REGEX', req.body.password as string]
            ];

            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("updateUser")
                .setRegexValidation(regexValidationList)
                .isValidateRole()
                .build();

            this.controller.update(requestHandler);
        });

        this.router.delete(`${this.routerName}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("deleteUser")
                .isValidateRole()
                .isLogicalRemove()
                .build();

            this.controller.delete(requestHandler);
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

            (this.controller as UserController).refreshToken(requestHandler);
        });

        this.router.get(`/confirmation_register/:registerToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("confirmationRegister")
                .build();

            (this.controller as UserController).activeRegisterUser(requestHandler);
        });

        /*
            Forgot Password Logic
        */
        this.router.post(`/forgot_password`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("forgotPassword")
                .build();

            (this.controller as UserController).forgotPassword(requestHandler);
        });

        // Verify the forgot password token and redirect to reset password URL front end
        this.router.get(`/verify_forgot_password/:forgotPassToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("VerifyForgotPassword")
                .build();

            (this.controller as UserController).verifyForgotPassToken(requestHandler);
        });

        // Reset the password with the pass on the body
        this.router.post(`/reset_password/:forgotPassToken`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
            new RequestHandlerBuilder(res, req)
                .setAdapter(new UserDTO(req))
                .setMethod("resetPassword")
                .build();

            (this.controller as UserController).resetPassword(requestHandler);
        });
    }
}

export default UserRoutes;
