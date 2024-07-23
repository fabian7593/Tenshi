import { getUrlParam } from "@utils/generalUtils";

import { Request, Response, GenericRoutes,
    RequestHandler, RequestHandlerBuilder, 
    FindManyOptions } from "@modules/index";
import { User, EmailController } from '@email/index';
import { injectable } from 'inversify';

@injectable()
class EmailRoutes extends GenericRoutes {
    constructor() {
        super(new EmailController(User));
    }

    protected initializeRoutes() {
        this.router.post(`${this.routerName}/send_email`, async (req: Request, res: Response) => {

            const requiredBodyList:  Array<string> = 
            [req.body.email, req.body.subject, 
            req.body.body_message];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setMethod("sendEmail")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole()
                                    .build();

            (this.controller as EmailController).sendMail(requestHandler);
        });


        this.router.post(`${this.routerName}/send_email_all_users`, async (req: Request, res: Response) => {
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

            (this.controller as EmailController).getByFilters(requestHandler);
        });
    }
}
export default EmailRoutes;
