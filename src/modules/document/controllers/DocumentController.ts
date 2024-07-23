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

            //validate if the role have permission to do this request
            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await this.roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.create);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

            //Validate if the user have attached files
            if (!reqHandler.getRequest().file) {
                return httpExec.dynamicError("VALIDATIONS", "REQUIRED_FILE");
            }

            //convert the fields into a json
            const body = JSON.parse(reqHandler.getRequest().body.fields);

            //Get data From Body json
            let documentBody : Document = reqHandler.getAdapter().entityFromPostBodyWithParams!(body);

            //validate required fields of body json
            if(reqHandler.getRequiredFieldsList() != null){
                if(!validation.validateRequiredFields(reqHandler.getRequiredFieldsList())){
                    return;
                }
            }

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

            if(reqHandler.getNeedValidateRole()){
                const roleFunc : RoleFunctionallity | null = await this.roleRepository.getPermissionByFuncAndRole(jwtData.role, this.controllerObj.update);
                if (roleFunc == null) {
                    return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                }
            }

             //Validate if the user have attached files
             if (!reqHandler.getRequest().file) {
                return httpExec.dynamicError("VALIDATIONS", "REQUIRED_FILE");
            }

            //If you need to validate if the user id of the table 
            //should be the user id of the user request (JWT)
            let userId : number | null= null;
            if(reqHandler.getRequireValidWhereByUserId()){
                if(jwtData.role != "ADMIN"){
                    userId = jwtData.id;
                }

                //call the get by id, if the user ID of the entity is different  to user ID of JWT
                //the user request dont have this authorization
                const entity = await this.repository.findById(id, reqHandler.getNeedLogicalRemove());

                if(entity != undefined && entity != null){
                    if(userId != null && entity.userId != userId){
                        return httpExec.unauthorizedError("ROLE_AUTH_ERROR");
                    }
                }
            }

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