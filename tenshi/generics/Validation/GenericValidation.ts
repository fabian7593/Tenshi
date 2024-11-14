import JWTObject  from 'tenshi/objects/JWTObject';
import Validations  from 'tenshi/helpers/Validations';
import HttpAction from 'tenshi/helpers/HttpAction';
import RoleRepository from "tenshi/generics/Role/RoleRepository"
import IGenericRepository from 'tenshi/generics/Repository/IGenericRepository';
import {  RequestHandler } from 'tenshi/generics/index';
import { ConstStatusJson, ConstMessagesJson, ConstGeneral } from "tenshi/consts/Const";

import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();


export default  class GenericValidation{

    private repository : IGenericRepository;

    public setRepository(repository: IGenericRepository){ 
        this.repository = repository;
    }

    public getValidationRepository(): IGenericRepository {
        return this.repository;
    }

    /**
         * This function validates the role of the user.
         * 
         * @param {RequestHandler} reqHandler - The request handler object.
         * @param {string} role - The role of the user.
         * @param {string} action - The action to be performed.
         * @param {HttpAction} httpAction - The HTTP action object.
         * @return {Promise<any>} - A promise that resolves to the result of the validation.
         */
    public async validateRole(reqHandler: RequestHandler, role: string, action: string,  httpAction: HttpAction): Promise<any> {
        /**
         * Validates the role of the user.
         * If the user's role is required to be validated, it checks if the user has the permission for the specified action.
         * If the user does not have the permission, it returns an unauthorized error.
         * 
         * @returns {Promise<any>} A promise that resolves to the result of the validation.
         */
        if(reqHandler.getRoleValidation()){

            // If the module is empty, return an error.
            if(reqHandler.getModule() == ""){
                return httpAction.dynamicError(ConstStatusJson.ERROR, ConstMessagesJson.ROLE_MODULE_ERROR);
            }

            const roleRepository : RoleRepository = await RoleRepository.getInstance();
            // Get the permission for the specified action and role from the role repository.
            const roleFunc = await roleRepository.getPermissionByFuncAndRole(role, reqHandler.getModule(), action);

            // If the user does not have the permission, return an unauthorized error.
            if (roleFunc == false) {
                return httpAction.unauthorizedError(ConstMessagesJson.ROLE_AUTH_ERROR);
            }
        }

        return true;
    }

    /**
     * Validates the required fields of the body JSON.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {Validations} validation - The validations object.
     * @return {boolean} - Returns true if all the required fields are present, false otherwise.
     */
    public validateRequiredFields(reqHandler: RequestHandler, validation: Validations): boolean {
        // Check if the required fields list is not null
        if (reqHandler.getRequiredFieldsList() != null) {
            // Validate the required fields
            if (!validation.validateRequiredFields(reqHandler.getRequiredFieldsList())) {
                // If any of the required fields are missing, return false
                return false;
            }
        }

        // If all the required fields are present, return true
        return true;
    }

    /**
     * Validates the regex of any fields.
     * It checks if the request handler object contains a list of regex validators.
     * If it does, it validates the multiple regex using the validation object.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {Validations} validation - The validations object.
     * @returns {boolean} - Returns true if all the regex validations pass, false otherwise.
     */
    public validateRegex(reqHandler: RequestHandler, validation: Validations): boolean {
        // Check if the request handler object contains a list of regex validators
        if (reqHandler.getRegexValidatorList() != null) {
            // Validate the multiple regex using the validation object
            return validation.validateMultipleRegex(reqHandler.getRegexValidatorList());
        }

        // If all the regex validations pass, return true
        return true;
    }

    /**
     * Sets the user ID in the body object if the ID is not present.
     * This function checks if the user ID is present in the body object.
     * If it is not present, it sets the user ID with the provided ID.
     *
     * @param {any} body - The body object containing the user ID
     * @param {number} id - The ID to set in the user ID field if it is not present in the body object
     * @return {any} - The modified body object with the user ID field set
     */
    public setUserId(body: any, id: number | string): any {
        // Check if the user ID is not present in the body object
        if (!(ConstGeneral.USER_ID in body)) {
            // If the user ID is not present, set the user ID with the provided ID
            body.user_id = id;
        }

        // Return the modified body object with the user ID field set
        return body;
    }

    /**
     * This is a function that need to have user_id in the table, to valid just the current user linked and the admin can be modify it.
     * Validates the user ID by ID or code entity.
     * This function checks if the request handler object requires validation of the where clause by user ID.
     * If it does, it checks the role of the JWT and sets the user ID accordingly.
     * Then, it calls the appropriate entity retrieval function based on the type of the ID or code.
     * Finally, it checks if the entity exists and if the user ID of the entity is different from the user ID of the JWT.
     * If any of these conditions are not met, it returns an unauthorized error.
     *
     * @async
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {HttpAction} httpExec - The HTTP action object.
     * @param {JWTObject} jwtData - The JWT object.
     * @param {number | string} idOrCode - The ID or code of the entity.
     * @return {Promise<any>} - Returns a promise that resolves to the result of the HTTP action object.
     */
    protected async validateUserIdEntityFindByCodeOrId(reqHandler: RequestHandler, httpExec: HttpAction, jwtData: JWTObject, idOrCode: number | string) {
        let userId: number | string | null = null; // Initialize user ID

    

        // Check if the request handler object requires validation of the where clause by user ID
        if (reqHandler.getRequireValidWhereByUserId()) {
            // Check if the role of the JWT is not admin
            if (jwtData.role != config.SUPER_ADMIN.ROLE_CODE) {
                userId = jwtData.id; // Set the user ID with the ID of the JWT
            }

            // Call the appropriate entity retrieval function based on the type of the ID or code
            let entity: any = null; // Initialize entity
            if (typeof idOrCode === 'number') {
                entity = await this.repository.findById(idOrCode, reqHandler.getLogicalDelete(), reqHandler.getFilters()); // Call findById function
            } else {
                entity = await this.repository.findByCode(idOrCode, reqHandler.getLogicalDelete(), reqHandler.getFilters()); // Call findByCode function
            }

            // Check if the entity exists and if the user ID of the entity is different from the user ID of the JWT
            if (entity != undefined && entity != null ) {
                if (userId != null && entity.user_id != userId) {
                    httpExec.unauthorizedError(ConstMessagesJson.ROLE_AUTH_ERROR); // Return unauthorized error if conditions are not met
                    return false;
                }
                
            } else {
                httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS); // Return dynamic error if entity does not exist
                return false;
            }
        }

        return true;
    }

    /**
     * Validates if the request handler has filters.
     * This function checks if the filters are set in the request handler.
     * If filters are not provided, it returns an error response.
     *
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {HttpAction} httpExec - The HTTP action object.
     * @return {boolean | any} - Returns true if filters are present, otherwise returns an error response.
     */
    public validateHaveFilters(reqHandler: RequestHandler, httpExec: HttpAction): any {
        if (reqHandler.getFilters() == null) {
            return httpExec.paramsError(); // Return error response if filters are not provided
        }
        return true;
    }

    /**
     * Retrieves the ID from the query parameters.
     * 
     * @param {Validations} validation - The validation object.
     * @param {HttpAction} httpExec - The HTTP action object.
     * @return {number | null} - The ID from the query parameters or null if validation fails.
     */
    public getIdFromQuery(validation: Validations, httpExec: HttpAction): number | null {
        // Validate the ID from the query parameters
        const id = validation.validateIdFromQuery();

        // If the ID is null (validation failed), return a parameter error
        if(id == null){
            httpExec.paramsError();
            return null;
        }

        // Return the ID from the query parameters
        return id;
    }


    /**
     * Retrieves the code from the query parameters.
     * 
     * @param {Validations} validation - The validation object.
     * @param {HttpAction} httpExec - The HTTP action object.
     * @return {string | null} - The code from the query parameters or null if validation fails.
     */
    public getCodeFromQuery(validation: Validations, httpExec: HttpAction): string | null {
        // Validate the code from the query parameters
        const code = validation.validateCodeFromQuery();

        // If the code is null (validation failed), return a parameter error
        if(code == null){
            // Return a parameter error
            httpExec.paramsError();
            return null;
        }

        // Return the code from the query parameters
        return code;
    }
}