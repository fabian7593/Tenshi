import { IDatabaseAdapter } from './IDatabaseAdapter';

// Generic function to execute a query using the provided database adapter
export async function executeDatabaseQuery<T>(
    dbAdapter: IDatabaseAdapter,
    executeAction: (conn: any) => Promise<T>
): Promise<T | any> {

    let conn: any;

    try {
        conn = await dbAdapter.getConnection();  // Get a connection using the adapter
        return await executeAction(conn);  // Execute the action with the connection

    } catch (error: any) {
        throw error;  // Propagate the error
        
    } finally {
        if (conn) {
            dbAdapter.releaseConnection(conn);  // Release the connection using the adapter
        }
    }
}
