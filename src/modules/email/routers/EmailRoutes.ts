import { getUrlParam } from "@TenshiJS/utils/generalUtils";

import { Request, Response, GenericRoutes,
    RequestHandler, RequestHandlerBuilder, 
    FindManyOptions } from "@modules/index";
import { User, EmailController } from '@modules/email/index';

class EmailRoutes extends GenericRoutes {
    constructor() {
        super(new EmailController(User));
    }

    /**
     * Initializes the routes for the email module.
     *
     * @private
     */
    protected initializeRoutes() {
        // Route for sending a single email to a specific user
        this.router.post(`${this.getRouterName()}/send_email`, async (req: Request, res: Response) => {
            
            // List of required fields in the request body
            const requiredBodyList: Array<string> = [
                req.body.email, 
                req.body.subject, 
                req.body.body_message
            ];

            // Create a request handler object with the necessary data
            const requestHandler: RequestHandler = new RequestHandlerBuilder(res, req)
                .setMethod("sendEmail") // Set the method to be executed
                .setRequiredFiles(requiredBodyList) // Set the required fields in the request body
                .isValidateRole() // Validate the role of the user
                .build(); // Build the request handler object

            // Execute the sendMail method of the EmailController with the request handler object
            (this.getController() as EmailController).sendMailController(requestHandler);
        });

        // Route for sending an email to multiple users based on specified filters
        this.router.post(`${this.getRouterName()}/send_email_all_users`, async (req: Request, res: Response) => {
            // Get the filter parameters from the URL
            const gender: string | null = getUrlParam("gender", req) || null;
            const country: string | null = getUrlParam("country_code", req) || null;
            const role: string | null = getUrlParam("role", req) || null;
            const firstName: string | null = getUrlParam("first_name", req) || null;
            const lastName: string | null = getUrlParam("last_name", req) || null;

            // Create an options object for the findMany method of the UserRepository
            const options: FindManyOptions = {};
            if (gender != "") {
                options.where = { ...options.where, gender: gender };
            }

            if (country != "") {
                options.where = { ...options.where, countryIsoCode: country };
            }

            if (role != "") {
                options.where = { ...options.where, role: role };
            }

            if (firstName != "") {
                options.where = { ...options.where, firstName: firstName };
            }

            if (lastName != "") {
                options.where = { ...options.where, lastName: lastName };
            }

            // Create a request handler object with the necessary data
            const requestHandler: RequestHandler = new RequestHandlerBuilder(res, req)
                .setMethod("sendEmail") // Set the method to be executed
                .isValidateRole() // Validate the role of the user
                .isLogicalDelete() // Set the logical delete flag
                .setFilters(options) // Set the filters for the findMany method
                .build(); // Build the request handler object

            // Execute the sendMailByFilters method of the EmailController with the request handler object
            (this.getController() as EmailController).sendMailByFilters(requestHandler);
        });
    }
  
}
export default EmailRoutes;
