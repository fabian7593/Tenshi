import { IDatabaseAdapter } from "tenshi/helpers/DataBaseHelper/IDatabaseAdapter";
import { Pool, PoolClient } from 'pg';

import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();

// PostgreSQL adapter implementing the IDatabaseAdapter interface
export class PostgresAdapter implements IDatabaseAdapter {

    private pool: Pool;
    constructor() {
        //postgressql Config
        this.pool = new Pool({
            user: config.DB.USER,           
            host: config.DB.HOST,           
            database: config.DB.NAME,       
            password: config.DB.PASSWORD,   
            port: config.DB.PORT,                  
            max: 10,        
            idleTimeoutMillis: 30000, 
            connectionTimeoutMillis: 2000                 
        });
    }

    async getConnection(): Promise<PoolClient> {
        return await this.pool.connect();  // Get a connection from the pool
    }

    releaseConnection(conn: PoolClient): void {
        conn.release();  // Release the connection back to the pool
    }

    async executeQuery<T>(conn: PoolClient, query: string, params: any[] = []): Promise<T> {
        const result = await conn.query(query, params);  // Execute the query with optional parameters
        return result.rows as unknown as T;  // Return the rows from the result
    }
}
 