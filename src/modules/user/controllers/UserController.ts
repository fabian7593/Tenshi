import { config } from "@index/index";
import { GenericController, RequestHandler} from "@modules/index";
import { UserRepository, hashPassword, User} from "@modules/user";
import { ConstGeneral, ConstHTTPRequest } from "@TenshiJS/consts/Const";

export default class UserController extends GenericController{
    
    constructor() {
        super(User, new UserRepository);
    }
   
    async update(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            let validateId: number | string | null = null;
            if(jwtData.role == config.SUPER_ADMIN.ROLE_CODE){
                try {
                    // Initialize the ID variable to null
                    // Check if the ID is present in the query string
                    if (reqHandler.getRequest().query[ConstGeneral.ID] != undefined) {
                        // Try to parse the ID from the query string as a number
                        validateId = parseInt(reqHandler.getRequest().query[ConstGeneral.ID] as string, 10);
                    }
                } catch (error: any) {} 
            }else{
                validateId = jwtData.id;
            }

            // Validate the id
            if(validateId === null){ return httpExec.paramsError(); }

             //Get data From Body
             const userBody = reqHandler.getAdapter().entityFromPutBody();
             try{
                 if(userBody.password != undefined && userBody.password != null){
                     //Password encryption
                     userBody.password = await hashPassword(userBody.password);
                 }
                 
                 //Execute Action DB
                 const user = await this.getRepository().update(validateId, userBody, reqHandler.getLogicalDelete());
                 return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.UPDATE_SUCCESS);
             
             }catch(error : any){
                 return await httpExec.databaseError(error, jwtData.id.toString(), 
                 reqHandler.getMethod(), this.getControllerName());
             }
        });
    }


    async insert(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {
            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
                
            try{
                //Password encryption
                userBody.password = await hashPassword(userBody.password);
                //Execute Action DB
                const user = await this.getRepository().add(userBody);
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.INSERT_SUCESS);
            
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData!.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });   
    }
}