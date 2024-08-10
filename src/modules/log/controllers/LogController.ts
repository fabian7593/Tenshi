import { HttpAction, executeQuery, config } from "@index/index";
import { GenericController, RequestHandler, JWTObject } from "@modules/index";
import { ConstHTTPRequest } from "@TenshiJS/consts/Const";

export default  class LogController extends GenericController{

     /**
      * Retrieves logs based on the provided filters and returns them as a success response.
      *
      * @param {RequestHandler} reqHandler - The request handler object.
      * @returns {Promise<any>} A promise that resolves to the success response if the operation is successful.
      */
     async getByFilters(reqHandler: RequestHandler): Promise<any> {

        // Get the HTTP action object from the response
        const httpExec: HttpAction = reqHandler.getResponse().locals.httpExec;

        try {
            // Get the JWT data from the response
            const jwtData: JWTObject = reqHandler.getResponse().locals.jwtData;

            // Validate the role of the user
            if(await this.validateRole(reqHandler, jwtData.role, this.getControllerObj().getById, httpExec) !== true){ 
                return; 
            }

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
                // Get the page and size from the URL query parameters
                const page : number = reqHandler.getRequest().query.page ? 
                        parseInt(reqHandler.getRequest().query.page as string) : 
                        config.HTTP_REQUEST.PAGE_OFFSET;

                const size : number = reqHandler.getRequest().query.size ? 
                        parseInt(reqHandler.getRequest().query.size as string) : 
                        config.HTTP_REQUEST.PAGE_SIZE;

                // Execute the action to get all logs with the specified filters
                const entities = await this.getAllLogs(environment, userId, type, page, size);

                // Filter out the OkPacket from the entities
                const data = entities.filter((item: any) => !('affectedRows' in item));

                // Return the success response
                return httpExec.successAction(data, ConstHTTPRequest.GET_ALL_SUCCESS);
            } catch(error : any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerObj().controller);
            }
        } catch(error : any) {
            // Return the general error response
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