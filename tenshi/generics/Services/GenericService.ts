import HttpAction from 'tenshi/helpers/HttpAction';
import { RequestHandler } from 'tenshi/generics/index';
import JWTObject from 'tenshi/objects/JWTObject';
import Validations from 'tenshi/helpers/Validations';
import GenericValidation from 'tenshi/generics/Validation/GenericValidation';
import ConfigManager from 'tenshi/config/ConfigManager';
import { ConstFunctions } from 'tenshi/consts/Const';
import IGenericService from './IGenericService';

export default  class GenericService extends GenericValidation implements IGenericService {
   

    private controllerName : string = "";

     /**
     * Sets the name of the controller associated with this service.
     * This value is required for the service to work properly.
     * @param {string} controllerName - The name of the controller.
     */
    setControllerName(controllerName: string){ 
        this.controllerName = controllerName;
    }
  
    
    /**
     * Returns the name of the controller associated with this service.
     * This value is set by the constructor of the controller.
     * @returns {string} The name of the controller.
     */

    protected getControllerName():string{ 
        return this.controllerName;
    }

    /**
     * This function is used to insert a new entity into the database.
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
     * @param {Function} executeFunction - The function to be executed after validating the role and fields of the entity.
     * @return {Promise<any>} A promise that resolves to the success response if the insertion is successful.
     */
    async insertService(reqHandler: RequestHandler, executeInsertFunction: (jwtData : JWTObject | null, httpExec: HttpAction) => void): Promise<any> {
        // Execute the returns structure
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            // Validate the role of the user
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(jwtData != null){
                if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.CREATE, httpExec) !== true){ return; }
            }
            
            // Validate the required fields of the entity
            if(!this.validateRequiredFields(reqHandler, validation)){ return; }

            // Validate the regex of the entity
            if(!this.validateRegex(reqHandler, validation)){ return; }

            executeInsertFunction(jwtData, httpExec);

        }catch(error : any){
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }

    /**
     * This function is used to update an existing entity in the database.
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
            // Validate the role of the user
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            if(jwtData != null){
                // Validate the role of the user
                if (await this.validateRole(reqHandler, jwtData.role, ConstFunctions.UPDATE, httpExec) !== true) {
                    return;
                }
            }

            // Validate the regex of the entity
            if (!this.validateRegex(reqHandler, validation)) {
                return;
            }

            // Get the id from the URL params
            const validateId = this.getIdFromQuery(validation, httpExec);
            if(validateId === null){ return; }
            const id = validateId as number; 

            // If you need to validate if the user id of the table 
            // should be the user id of the user request (JWT)
            if(await this.validateUserIdEntityFindByCodeOrId(reqHandler, httpExec, jwtData, id) !== true){ return; }

            executeUpdateFunction(jwtData, httpExec, id);

        } catch (error: any) {
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }

    /**
     * This function is used to delete an entity from the database.
     * It performs the following steps:
     * 1. Validates the role of the user.
     * 2. Validates the required fields of the entity.
     * 3. Validates the regex of the entity.
     * 4. Sets the user id of the entity.
     * 5. Executes the delete action in the database.
     * 6. Returns a success response if the deletion is successful.
     * 7. Returns a database error response if there is an error while deleting the entity.
     * 8. Returns a general error response if there is an error while performing the above steps.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {Function} executeDeleteFunction - The function to be executed after validating the role and fields of the entity.
     * @return {Promise<any>} A promise that resolves to the success response if the insertion is successful.
     */
    async deleteService(reqHandler: RequestHandler, executeDeleteFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number) => void): Promise<any> {

        // Get the HTTP action object from the response
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            // Get the validations object from the response
            const validation : Validations = reqHandler.getResponse().locals.validation;
            // Get the JWT object from the response
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
            // Get the id from URL params
            const validateId = this.getIdFromQuery(validation, httpExec);
            if(validateId === null){ return; }
            const id = validateId as number; 

            if(jwtData != null){
                // Validate the role of the user
                if(await this.validateRole(reqHandler, jwtData.role, ConstFunctions.DELETE, httpExec) !== true){ return; }
                // Validate the user id
                if(await this.validateUserIdEntityFindByCodeOrId(reqHandler, httpExec, jwtData, id) !== true){ return; }
            }
            // Execute the delete action in the database
            executeDeleteFunction(jwtData, httpExec, id);
        }catch(error : any){
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }

    async getByIdService(reqHandler: RequestHandler, executeGetByIdFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number) => void): Promise<any> {
        // Get the HTTP action object from the response
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             // Get the validations object from the response
             const validation : Validations = reqHandler.getResponse().locals.validation;
             // Get the JWT object from the response
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             // Get the id from URL params
             const validateId = this.getIdFromQuery(validation, httpExec);
             if(validateId === null){ return; }
             const id = validateId as number; 

             if(jwtData != null){
                // Validate the role of the user
                if(await this.validateRole(reqHandler, jwtData.role, ConstFunctions.GET_BY_ID, httpExec) !== true){ return; }
                // Validate the user id
                if(await this.validateUserIdEntityFindByCodeOrId(reqHandler, httpExec, jwtData, id) !== true){ return; }
             }

             // Execute the get by id action in the database
             executeGetByIdFunction(jwtData, httpExec, id);
        }catch(error : any){
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }


    /**
     * This function is used to get an entity by its code from the database.
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
     * @param {Function} executeGetByCodeFunction - The function to be executed after validating the role and fields of the entity.
     * @return {Promise<any>} A promise that resolves to the success response if the insertion is successful.
     */
    async getByCodeService(reqHandler: RequestHandler, executeGetByCodeFunction: (jwtData : JWTObject, httpExec: HttpAction, code: string) => void): Promise<any> {
       
         // Get the HTTP action object from the response
         const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

         try{
              // Get the validations object from the response
              const validation : Validations = reqHandler.getResponse().locals.validation;
              // Get the JWT object from the response
              const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
              // Get the code from URL params
              const validateCode = this.getCodeFromQuery(validation, httpExec);
              if(validateCode === null){ return; }
              const code = validateCode as string; 
 
              if(jwtData != null){
                // Validate the role of the user
                if(await this.validateRole(reqHandler, jwtData.role, ConstFunctions.GET_BY_ID, httpExec) !== true){ return; }
                // Validate the user id
                if(await this.validateUserIdEntityFindByCodeOrId(reqHandler, httpExec, jwtData, code) !== true){ return; }
              }

              executeGetByCodeFunction(jwtData, httpExec, code);
           
         }catch(error : any){
             // Return the general error response
             return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
         }
    }


    /**
     * This function is used to get all entities from the database.
     * It performs the following steps:
     * 1. Validates the role of the user.
     * 2. Gets the page and size from the URL query parameters.
     * 3. Executes the get all action in the database.
     * 4. Returns a success response if the operation is successful.
     * 5. Returns a database error response if there is an error while getting the entities.
     * 6. Returns a general error response if there is an error while performing the above steps.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {Function} executeGetAllFunction - The function to be executed after validating the role and getting the page and size.
     * @return {Promise<any>} A promise that resolves to the success response if the operation is successful.
     */
    async getAllService(reqHandler: RequestHandler, executeGetAllFunction: (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => void): Promise<any> {
        const config = ConfigManager.getInstance().getConfig();
        // Get the HTTP action object from the response
        const httpExec: HttpAction = reqHandler.getResponse().locals.httpExec;

        try {
            const jwtData: JWTObject = reqHandler.getResponse().locals.jwtData;

            if(jwtData != null){
                // Validate the role of the user
                if (await this.validateRole(reqHandler, jwtData.role, ConstFunctions.GET_ALL, httpExec) !== true) {
                    return;
                }
            }

             // Get the page and size from the URL query parameters
             const page: number = reqHandler.getRequest().query.page ?
             parseInt(reqHandler.getRequest().query.page as string) :
             config.HTTP_REQUEST.PAGE_OFFSET;

            const size: number = reqHandler.getRequest().query.size ?
             parseInt(reqHandler.getRequest().query.size as string) :
             config.HTTP_REQUEST.PAGE_SIZE;

             // Execute the get all action in the database
             executeGetAllFunction(jwtData, httpExec, page, size);
           
        } catch (error: any) {
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
   }

   /**
     * This function is used to get entities by applying filters specified in the request parameters.
     * It performs the following steps:
     * 1. Validates the role of the user.
     * 2. Checks if filters are provided in the request parameters.
     * 3. Gets the page and size from the URL query parameters.
     * 4. Executes the find by filters action in the database.
     * 5. Returns a success response if the operation is successful.
     * 6. Returns a database error response if there is an error while getting the entities.
     * 7. Returns a general error response if there is an error while performing the above steps.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @param {Function} executeGetByFiltersFunction - The function to be executed after validating the role and getting the page and size.
     * @return {Promise<any>} A promise that resolves to the success response if the operation is successful.
     */
    async getByFiltersService(reqHandler: RequestHandler, executeGetByFiltersFunction: (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => void): Promise<any> {
        const config = ConfigManager.getInstance().getConfig();
        // Get the HTTP action object from the response
        const httpExec: HttpAction = reqHandler.getResponse().locals.httpExec;

        try {
            // Get the JWT data from the response
            const jwtData: JWTObject = reqHandler.getResponse().locals.jwtData;

            if(jwtData != null){
                // Validate the role of the user
                await this.validateRole(reqHandler, jwtData.role, ConstFunctions.GET_BY_ID, httpExec);
            }

            // Check if filters are provided in the request parameters
            if (reqHandler.getFilters() == null) {
                return httpExec.paramsError(); // Return error response if filters are not provided
            }

             // Get the page and size from the URL query parameters
             const page: number = reqHandler.getRequest().query.page ?
             parseInt(reqHandler.getRequest().query.page as string) :
             config.HTTP_REQUEST.PAGE_OFFSET;

            const size: number = reqHandler.getRequest().query.size ?
             parseInt(reqHandler.getRequest().query.size as string) :
             config.HTTP_REQUEST.PAGE_SIZE;

             // Execute the find by filters action in the database
             executeGetByFiltersFunction(jwtData, httpExec, page, size);
        } catch (error: any) {
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }


    async validateAll(reqHandler: RequestHandler, httpExec: HttpAction, jwtData: JWTObject | null, action: string | null = null): Promise<string> {
        try {
            const validation: Validations = reqHandler.getResponse().locals.validation;

            if (jwtData != null && action != null) {
                if (await this.validateRole(reqHandler, jwtData.role, action, httpExec) !== true) {
                    return "validateRole";
                }
            }

            const validateCode = this.getCodeFromQuery(validation, httpExec);
            if (validateCode === null) {
                return "validateCode";
            }
            
            const validateId = this.getIdFromQuery(validation, httpExec);
            if (validateId === null) {
                return "validateId";
            }
            
            if (reqHandler.getFilters() == null) {
                return "validateFilters";
            }

            if(!this.validateRequiredFields(reqHandler, validation)){ 
                return "validateRequiredFields"; 
            }

            if(!this.validateRegex(reqHandler, validation)){ 
                return "validateRegex"; 
            }

            return "OK";
        } catch (error: any) {
            await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
            return "generalError";
        }
    }
}