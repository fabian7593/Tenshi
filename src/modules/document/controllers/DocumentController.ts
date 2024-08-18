import { HttpAction, Validations } from "@index/index";
import { GenericController, RequestHandler, JWTObject} from "@modules/index";
import { Document, setNameDocument } from '@modules/document/index';
import { uploadFile, getFile } from '@TenshiJS/utils/fileStorageUtils';
import { ConstHTTPRequest, ConstStatusJson,  ConstMessagesJson } from "@TenshiJS/consts/Const";

export default  class DocumentController extends GenericController{

    /**
     * Inserts a new document into the database.
     * The function follows these steps:
     * 1. Validates the user's role.
     * 2. Validates if the user has attached files.
     * 3. Validates the required fields of the document.
     * 4. Converts the fields from a JSON to a JavaScript object.
     * 5. Retrieves data from the body JSON.
     * 6. Sets the name and uploads the file.
     * 7. Executes the database action.
     * 8. Returns a success response if the insertion is successful.
     * 9. Returns a database error response if there is an error while inserting the document.
     * 10. Returns a general error response if there is an error while performing the above steps.
     *
     * @param {RequestHandler} reqHandler - The request handler object.
     * @return {Promise<any>} A promise that resolves to the success response if the insertion is successful.
     */
    async insert(reqHandler: RequestHandler) : Promise<any> {
        // Get the HttpAction object from the request handler
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try {
            // Get the validation and JWT data from the request handler
            const validation : Validations = reqHandler.getResponse().locals.validation;
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            // Validate the user's role
            if (await this.validateRole(reqHandler, jwtData.role, this.getControllerObj().create, httpExec) !== true) {
                return;
            }

            // Validate if the user has attached files
            if (!reqHandler.getRequest().file) {
                // Return a dynamic error if no files are attached
                return httpExec.dynamicError(ConstStatusJson.VALIDATIONS, ConstMessagesJson.REQUIRED_FILE);
            }

            // Validate the required fields of the document
            if (!this.validateRequiredFields(reqHandler, validation)) {
                return;
            }

            // Convert the fields from a JSON to a JavaScript object
            const body = JSON.parse(reqHandler.getRequest().body.fields);

            // Get data from the body JSON
            let documentBody : Document = reqHandler.getAdapter().entityFromPostBodyWithParams!(body);

            // Set the name and upload the file
            documentBody = setNameDocument(reqHandler.getRequest().file!, documentBody);
            documentBody.url = await uploadFile(reqHandler.getRequest().file!, documentBody.file_name!, documentBody.is_public);

            try {
                // Execute the database action
                const document: Document = await this.getRepository().add(documentBody);
                // Return a success response
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(document), ConstHTTPRequest.INSERT_SUCESS);

            } catch (error : any) {
                // Return a database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                reqHandler.getMethod(), this.getControllerObj().controller);
            }

        } catch (error : any) {
            // Return a general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }
  


    /**
     * Updates a document in the database.
     *
     * @param reqHandler - The request handler.
     * @returns A promise that resolves to the result of the HTTP action object.
     */
    async update(reqHandler: RequestHandler): Promise<any> {
        // Get the HTTP action object from the response
        const httpExec: HttpAction = reqHandler.getResponse().locals.httpExec;

        try {
            // Get the validation object and JWT data from the response
            const validation: Validations = reqHandler.getResponse().locals.validation;
            const jwtData: JWTObject = reqHandler.getResponse().locals.jwtData;

            const validateId = this.getIdFromQuery(validation, httpExec);
            if(validateId === null){ return; }
            const id = validateId as number; 

            // Validate the role of the user
            if (await this.validateRole(reqHandler, jwtData.role, this.getControllerObj().update, httpExec) !== true) {
                return;
            }

            // Validate if the user has attached files
            if (!reqHandler.getRequest().file) {
                // Return a dynamic error if no files are attached
                return httpExec.dynamicError(ConstStatusJson.VALIDATIONS, ConstMessagesJson.REQUIRED_FILE);
            }

            // Validate the user ID by ID or code entity
            if(await this.validateUserIdEntityFindByCodeOrId(reqHandler, httpExec, jwtData, id) !== true){ return; }

            // Convert the fields from a JSON to a JavaScript object
            const body = JSON.parse(reqHandler.getRequest().body.fields);

            // Get data from the body JSON
            let documentBody: Document = reqHandler.getAdapter().entityFromPostBodyWithParams!(body);

            // Set the name and upload the file
            documentBody = setNameDocument(reqHandler.getRequest().file!, documentBody);
            documentBody.url = await uploadFile(reqHandler.getRequest().file!, documentBody.file_name!, documentBody.is_public);

            try {
                // Execute the database action
                const updateEntity = await this.getRepository().update(id, documentBody, reqHandler.getLogicalDelete());
                // Return a success response
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(updateEntity), ConstHTTPRequest.UPDATE_SUCCESS);

            } catch (error: any) {
                // Return a database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                    reqHandler.getMethod(), this.getControllerObj().controller);
            }
        } catch (error: any) {
            // Return a general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
    }




    async getByCode(reqHandler: RequestHandler): Promise<any> {
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

             // Validate the role of the user
             if(await this.validateRole(reqHandler, jwtData.role, this.getControllerObj().getById, httpExec) !== true){ return; }
             // Validate the user id
             if(await this.validateUserIdEntityFindByCodeOrId(reqHandler, httpExec, jwtData, code) !== true){ return; }

            try{
                // Execute the get by code action in the database
                const entity : Document = await this.getRepository().findByCode(code, reqHandler.getLogicalDelete());

                if(entity != null && entity != undefined){
                    if(entity.is_public == false){
                        entity.url = await getFile(entity.file_name);
                    }
                    // Return the success response
                    return httpExec.successAction(reqHandler.getAdapter().entityToResponse(entity), ConstHTTPRequest.GET_BY_ID_SUCCESS);
                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }
            }catch(error : any){
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            // Return the general error response
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
     }
   
}