import { getUrlParam } from "@utils/generalUtils";

import { Router, Request, Response, 
    RequestHandler, RequestHandlerBuilder,
    ControllerObject, FindManyOptions } from "@modules/index";

import { User, EmailController } from '@email/index';

const route = Router();
const controllerObj: ControllerObject = {
    create: "",
    update: "",
    delete: "",
    getAll: "EMAIL_SEND_BY_ALL_USERS",
    getById: "EMAIL_SEND_BY_USER",
    controller: "EmailController"
};

const controller = new EmailController(User, controllerObj);

route.post("/email/send_email", async (req: Request, res: Response) => {

    const requiredBodyList:  Array<string> = 
    [req.body.email, req.body.subject, 
    req.body.body_message];

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setMethod("sendEmail")
                            .setRequiredFiles(requiredBodyList)
                            .isValidateRole()
                            .build();

    controller.sendMail(requestHandler);
});


route.post("/email/send_email_all_users", async (req: Request, res: Response) => {
    const gender : string | null = getUrlParam("gender", req) || null;
    const country : string | null = getUrlParam("country_code", req) || null;
    const role : string | null = getUrlParam("role", req) || null;
    const firstName : string | null = getUrlParam("first_name", req) || null;
    const lastName : string | null = getUrlParam("last_name", req) || null;

    const options: FindManyOptions = {};
    if(gender != ""){
        options.where = { ...options.where, gender: gender};
    }

    if(country != ""){
        options.where = { ...options.where, countryIsoCode: country};
    }

    if(role != ""){
        options.where = { ...options.where, role: role};
    }

    if(firstName != ""){
        options.where = { ...options.where, firstName: firstName};
    }

    if(lastName != ""){
        options.where = { ...options.where, lastName: lastName};
    }

    const requestHandler : RequestHandler = 
                            new RequestHandlerBuilder(res,req)
                            .setMethod("sendEmail")
                            .isValidateRole()
                            .isLogicalRemove()
                            .setFilters(options)
                            .build();

    controller.getByFilters(requestHandler);
});


export default route;