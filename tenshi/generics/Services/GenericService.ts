import HttpAction from 'tenshi/helpers/HttpAction';
import { RequestHandler } from 'tenshi/generics/index';
import JWTObject from 'tenshi/objects/JWTObject';
import Validations from 'tenshi/helpers/Validations';
import GenericValidation from 'tenshi/generics/Validation/GenericValidation';
import ConfigManager from 'tenshi/config/ConfigManager';
import { ConstFunctions, ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from 'tenshi/consts/Const';
import IGenericService from './IGenericService';
import IGenericRepository from '../Repository/IGenericRepository';
import { getMessage } from '@TenshiJS/utils/jsonUtils';

export default  class GenericService extends GenericValidation implements IGenericService {
   
    private controllerName : string = "";

    constructor(){  
        super();
    }

    setRepositoryServiceValidation(repository: IGenericRepository){
        this.setRepository(repository);
    }

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
            return true;
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
    async updateService(reqHandler: RequestHandler, 
        executeUpdateFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number | string | null) => void): Promise<any> {
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
            if (!this.validateRegex(reqHandler, validation)) { return; }

            if(reqHandler.getRequiredIdFromQuery()){
                // Get the id from the URL params
                const validateId = this.getIdFromQuery(validation, httpExec);
                if(validateId === null){ return; }
                const id = validateId; 

                // If you need to validate if the user id of the table 
                // should be the user id of the user request (JWT)
                if(await this.validateDynamicRoleAccess(reqHandler, httpExec, jwtData, id) !== true){ return; }

                executeUpdateFunction(jwtData, httpExec, id);
            }else{
                executeUpdateFunction(jwtData, httpExec, null);
            }

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
    async deleteService(reqHandler: RequestHandler, 
        executeDeleteFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number | string) => void): Promise<any> {

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
            const id = validateId; 

            if(jwtData != null){
                // Validate the role of the user
                if(await this.validateRole(reqHandler, jwtData.role, ConstFunctions.DELETE, httpExec) !== true){ return; }
                // Validate the user id
                if(await this.validateDynamicRoleAccess(reqHandler, httpExec, jwtData, id) !== true){ return; }
            }
            // Execute the delete action in the database
            executeDeleteFunction(jwtData, httpExec, id);
        }catch(error : any){
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }

    async getByIdService(reqHandler: RequestHandler, 
        executeGetByIdFunction: (jwtData : JWTObject, httpExec: HttpAction, id: number | string) => void): Promise<any> {
        // Get the HTTP action object from the response
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
             // Get the validations object from the response
             const validation : Validations = reqHandler.getResponse().locals.validation;
             // Get the JWT object from the response
             const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
             // Get the id from URL params
             const validateId = this.getIdFromQuery(validation, httpExec);

             //validate params is not null
             if(validateId === null){ return; }

             const id = validateId; 

             if(jwtData != null){
                // Validate the role of the user
                if(await this.validateRole(reqHandler, jwtData.role, ConstFunctions.GET_BY_ID, httpExec) !== true){ return; }
                // Validate the user id
                if(await this.validateDynamicRoleAccess(reqHandler, httpExec, jwtData, id) !== true){ return; }
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
                if(await this.validateDynamicRoleAccess(reqHandler, httpExec, jwtData, code) !== true){ return; }
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
                if (await this.validateRole(reqHandler, jwtData.role, ConstFunctions.GET_ALL, httpExec) !== true) { return; }
                reqHandler.getFilters()!!.where = await this.validateDynamicRoleAccessGetByFiltering(reqHandler, jwtData);
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


   /**************************************************** */
   //                    ADD MULTIPLE
   /**************************************************** */

    /**************************************************** */
    /*
        This function is used to insert multiple entities into the database.
        It performs the following steps:
        1. Validates the role of the user.
        2. Validates the required fields of each entity in the array.
        3. Executes the function provided as a parameter for each entity.
        4. Returns a success response if all insertions are successful.
        5. Returns an error response if any insertion fails.
    /**************************************************** */
    async insertMultipleService(
        reqHandler: RequestHandler,
        executeInsertFunction: (jwtData: JWTObject | null, httpExec: HttpAction, item: any) => Promise<any>
    ): Promise<any> {
        const httpExec: HttpAction = reqHandler.getResponse().locals.httpExec;
    
        try {
            const validation: Validations = reqHandler.getResponse().locals.validation;
            const jwtData: JWTObject = reqHandler.getResponse().locals.jwtData;
    
            // Validate role only once before loop
            if (jwtData != null) {
                if (await this.validateRole(reqHandler, jwtData.role, ConstFunctions.CREATE, httpExec) !== true) {
                    return;
                }
            }

    
            // Check if the request body is an array
            const data: any[] = reqHandler.getRequest().body;
            if (!Array.isArray(data)) {

                return httpExec.dynamicError(ConstStatusJson.ERROR, ConstMessagesJson.DONT_EXISTS);
            }
    
            const successList: any[] = [];
            const errorList: any[] = [];
    
            for (const [index, item] of data.entries()) {
                try {
                    // Temporarily replace the request body for current validation
                    const originalBody = reqHandler.getRequest().body;
                    reqHandler.getRequest().body = item;
    
                    // Validate required fields
                    /*if (!this.validateMultipleRequiredFields(reqHandler.getRequiredFieldsList(), item)) {
                        errorList.push({ index, error: getMessage(ConstMessagesJson.REQUIRED_FIELDS) });
                        continue;
                    }*/
    
                    // Validate regex patterns
                    const regexCheck = this.validateMultipleRegexPerItem(
                        reqHandler,
                        validation,
                        item
                      );
                      if (regexCheck !== true) {
                        errorList.push({ index, error: regexCheck });
                        continue;
                      }
                    
    
                    // Add user_id if not present
                    const newItem = this.setUserId(item, jwtData?.id);
    
                    // Try to execute the actual insert
                    const inserted = await executeInsertFunction(jwtData, httpExec, newItem);
                    successList.push(inserted);
    
                    // Restore original body after insert
                    reqHandler.getRequest().body = originalBody;
    
                } catch (error: any) {
                    errorList.push({ index, error: error.message || "Unknown error" });
                }
            }
    
            return httpExec.successAction(
                { success: successList, errors: errorList },
                ConstHTTPRequest.INSERT_ENTRIES_SUCCESS
            );
        } catch (error: any) {
            return await httpExec.generalError(error, reqHandler.getMethod(), this.controllerName);
        }
    }
    


    async updateMultipleService(
        reqHandler: RequestHandler,
        executeUpdateFunction: (jwtData: JWTObject, httpExec: HttpAction, id: number | string, item: any
        ) => Promise<any>
      ): Promise<any> {
        const httpExec = reqHandler.getResponse().locals.httpExec;
        const validation = reqHandler.getResponse().locals.validation;
        const jwtData = reqHandler.getResponse().locals.jwtData;
      
        // 1) Validate user role once before looping
        if (jwtData != null) {
          if (await this.validateRole(reqHandler, jwtData.role, ConstFunctions.UPDATE, httpExec ) !== true) {
            return;
          }
        }
      
        // 2) Ensure request body is an array
     


        const data: any[] = reqHandler.getRequest().body;
        if (!Array.isArray(data)) {
            return httpExec.dynamicError(
            ConstStatusJson.ERROR,
            ConstMessagesJson.DONT_EXISTS
            );
        }
      
        const successList: any[] = [];
        const errorList: any[] = [];
      
        // 3) Iterate over each item
        for (const [index, item] of data.entries()) {

          // temporarily swap in the current item as req.body
          const originalBody = reqHandler.getRequest().body;
      
          // 4) Check that an identifier is present
          if (item.id == null) {
            errorList.push({ index, error: 'Missing identifier (id)' });
            reqHandler.getRequest().body = originalBody;
            continue;
          }
      
          // 5) Validate required fields for this item
          /*if (!this.validateMultipleRequiredFields(reqHandler.getRequiredFieldsList(), item)) {
            errorList.push({index, error: getMessage(ConstMessagesJson.REQUIRED_FIELDS)});
            reqHandler.getRequest().body = originalBody;
            continue;
          }*/
      
          // 6) Validate regex constraints per item
          const regexCheck = this.validateMultipleRegexPerItem(reqHandler, validation, item.id);
          if (regexCheck !== true) {
            errorList.push({ index, error: regexCheck });
            reqHandler.getRequest().body = originalBody;
            continue;
          }
      
          // 7) Enforce dynamic-role access for this item
          if ( jwtData != null && (await this.validateDynamicRoleAccess(reqHandler,httpExec,jwtData, item.id)) !== true ) {
            errorList.push({ index, error: 'Unauthorized' });
            reqHandler.getRequest().body = originalBody;
            continue;
          }
      
          try {
            // 8) Perform the actual update
            const updated = await executeUpdateFunction(jwtData, httpExec, item.id, item);
            successList.push(updated);
          } catch (e: any) {
            errorList.push({ index, error: e.message || 'Unknown error' });
          }
      
          // 9) Restore original request body
          reqHandler.getRequest().body = originalBody;
        }
      
        // 10) Return combined result
        return httpExec.successAction( { success: successList, errors: errorList }, ConstHTTPRequest.UPDATE_ENTRIES_SUCCESS);
      }



/**
   * Bulk partial update:
   * - Validates role once.
   * - Expects body.ids: number[].
   * - Uses the rest of body as patch payload.
   * - For each id:
   *     • checks dynamic role access
   *     • runs per-item regex (if configured)
   *     • calls `executeUpdateFunction`
   * - Returns 200 with { success: [...], errors: [...] }.
   */
async updateMultipleByIdsService(
    reqHandler: RequestHandler,
    executeUpdateFunction: (jwtData: JWTObject | null, httpExec: HttpAction, id: number | string, payload: any) => Promise<any>
  ): Promise<any> {
    const httpExec = reqHandler.getResponse().locals.httpExec;
    const validation: Validations = reqHandler.getResponse().locals.validation;
    const jwtData: JWTObject = reqHandler.getResponse().locals.jwtData;

    try {
      // 1) Global role validation
      if (jwtData) {
        const validateRole = await this.validateRole(reqHandler, jwtData.role, ConstFunctions.UPDATE, httpExec);
        if (validateRole !== true) return;
      }

      // 2) Extract ids + payload (everything except ids)
      const body = reqHandler.getRequest().body;
      const ids = body.ids;
      const payload = { ...body };
      delete payload.ids;

      if (!Array.isArray(ids)) {
        return httpExec.dynamicError(ConstStatusJson.ERROR, ConstMessagesJson.INVALID_BODY_REQUEST);
      }

      const successList: any[] = [];
      const errorList: { index: number; error: string }[] = [];

      // 3) Loop over each id
      for (const [index, id] of ids.entries()) {
        // backup original body so later loops still see full body
        const originalBody = reqHandler.getRequest().body;
        reqHandler.getRequest().body = payload;

        try {
          // 3a) ID must exist
          if (id == null) {
            errorList.push({ index, error: "Missing id" });
            continue;
          }

          // 3b) Dynamic per‐item access control
          if (jwtData) {
            const accessOk = await this.validateDynamicRoleAccess(reqHandler, httpExec, jwtData, id);
            if (accessOk !== true) {
              errorList.push({ index, error: `Unauthorized for id ${id}` });
              continue;
            }
          }

          // 3c) Per‐item regex validation
          const regexCheck = this.validateMultipleRegexPerItem(reqHandler, validation, payload);
          if (regexCheck !== true) {
            errorList.push({ index, error: regexCheck as string });
            continue;
          }

          // 3d) Perform the update
          const updated = await executeUpdateFunction(jwtData, httpExec, id, payload);
          successList.push(updated);
        } catch (err: any) {
          errorList.push({ index, error: err.message || "Unknown error" });
        } finally {
          // restore for next iteration
          reqHandler.getRequest().body = originalBody;
        }
      }

      // 4) Return combined success/errors
      return httpExec.successAction(
        { success: successList, errors: errorList },
        ConstHTTPRequest.UPDATE_ENTRIES_SUCCESS
      );
    } catch (err: any) {
      return await httpExec.generalError(err, reqHandler.getMethod(), this.getControllerName());
    }
  }
  

    /**
   * Deletes multiple entities by their IDs.
   * 
   * 1. Validates role once.
   * 2. Ensures body.ids is an array.
   * 3. Loops over each id, attempts delete, collects successes & errors.
   */
    async deleteMultipleService(
        reqHandler: RequestHandler,
        executeDeleteFunction: (jwtData: JWTObject | null, httpExec: HttpAction, id: number|string) => Promise<any>
    ): Promise<any> {
        const httpExec = reqHandler.getResponse().locals.httpExec;
        try {
        const validation = reqHandler.getResponse().locals.validation;
        const jwtData     = reqHandler.getResponse().locals.jwtData;

        // 1) role check once
        if (jwtData && await this.validateRole(reqHandler, jwtData.role, ConstFunctions.DELETE, httpExec) !== true) {
            return;
        }

        // 2) get ids[]
        const body = reqHandler.getRequest().body;
        if (!Array.isArray(body.ids)) {
            return httpExec.paramsError();
        }

        const success: any[] = [];
        const errors: { index:number, error:string }[] = [];

        // 3) loop
        for (const [i, id] of body.ids.entries()) {
            try {
            if (id == null) {
                throw new Error('Invalid or missing id');
            }

            if ( jwtData != null &&!this.validateDynamicRoleAccess(reqHandler, httpExec, jwtData, id)) {
              errors.push({ index: i, error: 'Unauthorized' });
              continue;
            }
            
            // actual delete (logical vs hard based on handler)
            const result = await executeDeleteFunction(jwtData, httpExec, id);
            success.push({ id, result });
            } catch (err: any) {
            errors.push({ index: i, error: err.message || 'Unknown error' });
            }
        }

        // 4) respond 200 with per-item outcome
        return httpExec.successAction(
            { success, errors },
            ConstHTTPRequest.DELETE_ENTRIES_SUCCESS
        );

        } catch (err: any) {
        return await httpExec.generalError(err, reqHandler.getMethod(), this.getControllerName());
        }
    }
}