import pool from "@config/db_config_pool";
import { PoolConnection } from 'mariadb';

/*
    Execution db Utils class have the methods for execute sql query scripting ||
    Of you can execute Stored Procedures As Well
*/

//This is a function to open and close the DB, and execute the query
//You could send the conn.query string
export async function executeQuery<T>(
    executeAction: (conn: PoolConnection) => Promise<T>
): Promise<T | any> {

    let conn: PoolConnection | undefined;

    try {
        conn = await pool.getConnection();
        return await executeAction(conn);

    } catch (error : any) {
        throw error;
        
    } finally {
        if (conn) {
            conn.release(); 
        }
    }
}