import { Router, Request, Response, 
         RequestHandler, RequestHandlerBuilder,
         ControllerObject } from "@modules/index";

import { UserController, UserDTO, User } from "@user/index";

const route = Router();

const controllerObj: ControllerObject = {
    create: "USER_REGISTER",
    update: "USERS_UPDATE",
    delete: "USERS_DELETE",
    getAll: "USERS_READ",
    getById: "USER_GET_BY_ID",
    controller: "UserController"
};

const controller = new UserController(User, controllerObj);

/*
        GET METHODS
*/
route.get("/user/get", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("getUserById")
        .isLogicalRemove()
        .isValidateRole()
        .build();

    controller.getById(requestHandler);
});

route.get("/user/get_all", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("getUsers")
        .isLogicalRemove()
        .isValidateRole()
        .build();

    controller.getAll(requestHandler);
});


/*
        POST METHODS
*/
route.post("/user/add", async (req: Request, res: Response) => {

    const regexValidationList: [string, string][] = [
        ['EMAIL_REGEX', req.body.email as string],
        ['PASSWORD_REQUIRED_REGEX', req.body.password as string]
    ];

    const requiredBodyList:  Array<string> = 
                            [req.body.first_name, req.body.last_name, 
                            req.body.email, req.body.password, 
                            req.body.role_code];

    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("insertUser")
        .setRegexValidation(regexValidationList)
        .setRequiredFiles(requiredBodyList)
        .isValidateRole()
        .build();

    controller.insert(requestHandler);
});

route.post("/user/register", async (req: Request, res: Response) => {

    const regexValidationList: [string, string][] = [
        ['EMAIL_REGEX', req.body.email as string],
        ['PASSWORD_REQUIRED_REGEX', req.body.password as string]
    ];

    const requiredBodyList:  Array<string> = 
                            [req.body.first_name, req.body.last_name, 
                             req.body.email, req.body.password, 
                             req.body.role_code];

    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("registerUser")
        .setRegexValidation(regexValidationList)
        .setRequiredFiles(requiredBodyList)
        .build();

    controller.register(requestHandler);
});

route.post("/user/login", async (req: Request, res: Response) => {
    const regexValidationList: [string, string][] = [
        ['EMAIL_REGEX', req.body.email],
        ['PASSWORD_REQUIRED_REGEX', req.body.password]
    ];

    const requestHandler : RequestHandler = 
        new RequestHandlerBuilder(res,req)
            .setAdapter(new UserDTO(req))
            .setMethod("loginUser")
            .setRegexValidation(regexValidationList)
            .build();

    controller.loginUser(requestHandler, "USER_LOGIN");

});



/*
        ANOTHER METHODS
*/
route.put("/user/edit", async (req: Request, res: Response) => {

    const regexValidationList: [string, string][] = [
        ['EMAIL_REGEX', req.body.email as string],
        ['PASSWORD_REQUIRED_REGEX', req.body.password as string]
    ];

    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("updateUser")
        .setRegexValidation(regexValidationList)
        .isValidateRole()
        .build();

    controller.update(requestHandler);
});

route.delete("/user/delete", async (req: Request, res: Response) => {

    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("deleteUser")
        .isValidateRole()
        .isLogicalRemove()
        .build();

    controller.delete(requestHandler);
});



/*
        Correct Functionallity Login
*/
route.get('/refresh_token/:refreshToken', async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("refreshToken")
        .build();

    controller.refreshToken(requestHandler);
});


route.get('/confirmation_register/:registerToken', async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("confirmationRegister")
        .build();

    controller.activeRegisterUser(requestHandler);
});



/*
        Forgot Password Logic
*/
route.post('/forgot_password', async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("forgotPassword")
        .build();

    controller.forgotPassword(requestHandler);
});

//verifiy the forgot password token and redirect to reset password url front end
route.get('/verify_forgot_password/:forgotPassToken', async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("VerifyForgotPassword")
        .build();

    controller.verifyForgotPassToken(requestHandler);
});

//reset the password with the pass on the body
route.post('/reset_password/:forgotPassToken', async (req: Request, res: Response) => {
    const requestHandler : RequestHandler = 
    new RequestHandlerBuilder(res,req)
        .setAdapter(new UserDTO(req))
        .setMethod("resetPassword")
        .build();

    controller.resetPassword(requestHandler);
});


export default route;