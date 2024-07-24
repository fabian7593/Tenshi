import { HttpAction, Validations } from "@index/index";

import { GenericController, RequestHandler,
         RoleFunctionallity,
         JWTObject} from "@modules/index";

import { Document, setNameDocument, uploadFile } from '@document/index'

export default  class DocumentController extends GenericController{

    async insert(reqHandler: RequestHandler) : Promise<any>{
        const successMessage : string = "INSERT_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse());
    
        try{
            const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;

            await this.validateRole(reqHandler,  jwtData.role, this.controllerObj.create, httpExec);

            //Validate if the user have attached files
            if (!reqHandler.getRequest().file) {
                return httpExec.dynamicError("VALIDATIONS", "REQUIRED_FILE");
            }

            //convert the fields into a json
            const body = JSON.parse(reqHandler.getRequest().body.fields);

            //Get data From Body json
            let documentBody : Document = reqHandler.getAdapter().entityFromPostBodyWithParams!(body);

            this.validateRequiredFields(reqHandler, validation);

            //set name and upload file
            documentBody =  setNameDocument(reqHandler.getRequest().file!, documentBody);
            documentBody.url = await uploadFile(reqHandler.getRequest().file!, documentBody.file_name!);
        
            try{
                //Execute Action DB
                const document: Document = await this.repository.add(documentBody);
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(document), successMessage);
            
            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
    }



    async update(reqHandler: RequestHandler): Promise<any>{
        const successMessage : string = "UPDATE_SUCCESS";
        const httpExec = new HttpAction(reqHandler.getResponse());

        try{
            const validation = new Validations(reqHandler.getRequest(), reqHandler.getResponse(), httpExec);
            const jwtData : JWTObject = reqHandler.getRequest().app.locals.jwtData;
            const id = validation.validateIdFromQuery();
            if(id == null){
                return httpExec.paramsError();
            }

            await this.validateRole(reqHandler,  jwtData.role, this.controllerObj.create, httpExec);

             //Validate if the user have attached files
             if (!reqHandler.getRequest().file) {
                return httpExec.dynamicError("VALIDATIONS", "REQUIRED_FILE");
            }

            await this.validateUserIdByIdOrCodeEntity(reqHandler, httpExec, jwtData, id);

            //convert the fields into a json
            const body = JSON.parse(reqHandler.getRequest().body.fields);

            //Get data From Body json
            let documentBody : Document = reqHandler.getAdapter().entityFromPostBodyWithParams!(body);

            documentBody =  setNameDocument(reqHandler.getRequest().file!, documentBody);
            documentBody.url = await uploadFile(reqHandler.getRequest().file!, documentBody.file_name!);

            try{
                //Execute Action DB
                const updateEntity = await this.repository.update(id, documentBody, reqHandler.getNeedLogicalRemove());
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(updateEntity), successMessage);

            }catch(error : any){
                return await httpExec.databaseError(error);
            }
        }catch(error : any){
            return await httpExec.generalError(error);
        }
     }
}