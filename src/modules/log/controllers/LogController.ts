import { HttpAction, config } from "@index/index";
import { DBPersistanceFactory } from "@TenshiJS/persistance/DBPersistanceFactory";
import { GenericController, RequestHandler, JWTObject } from "@modules/index";
import { ConstHTTPRequest } from "@TenshiJS/consts/Const";
import { executeDatabaseQuery } from "@TenshiJS/persistance/DataBaseHelper/ExecuteQuery";
import { Log } from "@TenshiJS/entity/Log";
import GenericService from "@TenshiJS/generics/Services/GenericService";

export default  class LogController extends GenericController{

    constructor() {
        super(Log);
    }

     /**
      * Retrieves logs based on the provided filters and returns them as a success response.
      *
      * @param {RequestHandler} reqHandler - The request handler object.
      * @returns {Promise<any>} A promise that resolves to the success response if the operation is successful.
      */
     async getByFilters(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getAllService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {

            // Get the filters from the query parameters
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

            try {
                // Execute the action to get all logs with the specified filters
                const entities = await this.getAllLogs(environment, userId, type, page, size);

                // Filter out the OkPacket from the entities
                const data = entities.filter((item: any) => !('affectedRows' in item));

                // Return the success response
                return httpExec.successAction(data, ConstHTTPRequest.GET_ALL_SUCCESS);
            } catch(error : any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });
     }
   
     async getAllLogs(environment : string | null,
                                   userId: string | null, type : string | null,
                                   page: number, size : number): Promise<any>{

        const dbAdapter = DBPersistanceFactory.createDBAdapterPersistance(config.DB.TYPE);
        return await executeDatabaseQuery(dbAdapter, async (conn) => {
            const result = await dbAdapter.executeQuery(conn,
                "CALL GetLogsWithFilters(?, ?, ?, ?, ?)",
                [environment, userId, type, size, page] 
            );
            return result;
        });
     }
}