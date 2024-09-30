import { ConstFunctions, ConstRoles } from "@TenshiJS/consts/Const";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import GenericService from "@TenshiJS/generics/Services/GenericService";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import Validations from "@TenshiJS/helpers/Validations";
import JWTObject from "@TenshiJS/objects/JWTObject";

export default class UserService extends GenericService{

    /**
     * This function is used to update an existing user in the database.
     * It performs the following steps:
     * 1. Validates the role of the user.
     * 2. Validates the required fields of the entity.
     * 3. Validates the regex of the entity.
     * 4. Executes the function provided as a parameter.
     * 5. Returns a success response if the insertion is successful.
     * 6. Returns a database error response if there is an error while inserting the entity.
     * 7. Returns a general error response if there is an error while performing the above steps.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {Function} executeUpdateFunction - The function to be executed after validating the role and fields of the entity.
     * @return {Promise<any>} A promise that resolves to the success response if the insertion is successful.
     */
    async updateService(reqHandler: RequestHandler, executeUpdateFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number) => void): Promise<any> {
        // Execute the returns structure
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try {

            // Get the validations object from the response
            const validation : Validations = reqHandler.getResponse().locals.validation;
            // Get the JWT object from the response
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            //If the role is admin, get the id from query url
            //If the role is not admin, get the id from JWT
            let validateId : number | null = null;
            if(jwtData.role == ConstRoles.ADMIN){
                // Validate the id from query url
                validateId = this.getIdFromQuery(validation, httpExec);
            }else{
                // Validate the id from JWT
                validateId = jwtData.id;
            }

            // Validate the id
            if(validateId === null){ return; }
            const id = validateId as number; 

            // Validate the role of the user
            if (await this.validateRole(reqHandler, jwtData.role, ConstFunctions.UPDATE, httpExec) !== true) {
                return;
            }

            // Validate the regex of the entity
            if (!this.validateRegex(reqHandler, validation)) {
                return;
            }

            executeUpdateFunction(jwtData, httpExec, id);

        } catch (error: any) {
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }
}