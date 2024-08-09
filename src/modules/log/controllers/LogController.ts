import { HttpAction, executeQuery, config } from "@index/index";

import { GenericController, RequestHandler, JWTObject } from "@modules/index";

export default  class LogController extends GenericController{

     async getByFilters(reqHandler: RequestHandler): Promise<any> {
        const successMessage : string = "GET_SUCCESS";
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;
            if(await this.validateRole(reqHandler,  jwtData.role, this.getControllerObj().getById, httpExec) !== true){ return; }

            let environment : string | null = null;
            if(reqHandler.getRequest().query['environment'] != undefined){
                environment = reqHandler.getRequest().query['environment'] as string;
            }

            let userId : string | null = null;
            if(reqHandler.getRequest().query['user_id'] != undefined){
                userId = reqHandler.getRequest().query['user_id'] as string;
            }

            let type : string | null = null;
            if(reqHandler.getRequest().query['type'] != undefined){
                type = reqHandler.getRequest().query['type'] as string;
            }

            try{
                //get by url params the page and the size of the response
                const page : number = reqHandler.getRequest().query.page ? 
                            parseInt(reqHandler.getRequest().query.page as string) : 
                            config.HTTP_REQUEST.PAGE_OFFSET;

                const size : number = reqHandler.getRequest().query.size ? 
                            parseInt(reqHandler.getRequest().query.size as string) : 
                            config.HTTP_REQUEST.PAGE_SIZE;

                //Execute Action DB
                const entities = await this.getAllLogs(environment, userId, type, page, size);

                // Filtrar el OkPacket
                const data = entities.filter((item: any) => !('affectedRows' in item));

                //const entities = await this.getAllUserNotifications();
                return httpExec.successAction(data, successMessage);
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        }catch(error : any){
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerObj().controller);
        }
     }

 
     async getAllLogs(environment : string | null,
                                   userId: string | null, type : string | null,
                                   page: number, size : number): Promise<any>{
            return await executeQuery(async (conn) => {
                const result = await conn.query(
                    "CALL GetLogsWithFilters(?, ?, ?, ?, ?)",
                    [environment, userId, type, size, page] 
                );
               
             return result;
         });
     }
}