import { GenericController, RequestHandler} from "@modules/index";
import { Document, setNameDocument } from '@modules/document/index';
import { uploadFile, getFile } from '@TenshiJS/utils/fileStorageUtils';
import { ConstHTTPRequest, ConstStatusJson,  ConstMessagesJson } from "@TenshiJS/consts/Const";

export default  class DocumentController extends GenericController{

    constructor() {
        super(Document);
    }

    async insert(reqHandler: RequestHandler) : Promise<any> {
        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {
             // Validate if the user has attached files
             if (!reqHandler.getRequest().file) {
                // Return a dynamic error if no files are attached
                return httpExec.dynamicError(ConstStatusJson.VALIDATIONS, ConstMessagesJson.REQUIRED_FILE);
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
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(document), ConstHTTPRequest.INSERT_SUCCESS);

            } catch (error : any) {
                // Return a database error response
                return await httpExec.databaseError(error, jwtData!.id.toString(),
                reqHandler.getMethod(), this.getControllerName());
            }
        });
    }
  


    /**
     * Updates a document in the database.
     *
     * @param reqHandler - The request handler.
     * @returns A promise that resolves to the result of the HTTP action object.
     */
    async update(reqHandler: RequestHandler): Promise<any> {
       
        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            // Validate if the user has attached files
            if (!reqHandler.getRequest().file) {
                // Return a dynamic error if no files are attached
                return httpExec.dynamicError(ConstStatusJson.VALIDATIONS, ConstMessagesJson.REQUIRED_FILE);
            }

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
                    reqHandler.getMethod(), this.getControllerName());
            }
        });
    }




    async getByCode(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getByCodeService(reqHandler, async (jwtData, httpExec, code) => {
            try{
                // Execute the get by code action in the database
                const entity : Document = await this.getRepository().findByCode(code, reqHandler.getLogicalDelete(), reqHandler.getFilters());

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
                reqHandler.getMethod(), this.getControllerName());
            }
        });
     }
}