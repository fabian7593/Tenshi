import { IDatabaseAdapter } from 'tenshi/persistance/DataBaseHelper/IDatabaseAdapter';
import { PoolConnection } from 'mysql2/promise';
const mysql = require('mysql2/promise');
import { Pool } from 'mysql2/promise';

import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();

// MariaDB adapter implementing the IDatabaseAdapter interface
export class MySQLAdapter implements IDatabaseAdapter {

    private pool: Pool;
    constructor() {
        //MYSQL Config
        this.pool = mysql.createPool({
            host: config.DB.HOST,
            user: config.DB.USER,
            password: config.DB.PASSWORD,
            database: config.DB.NAME,
            port: config.DB.PORT,
            connectionLimit: 150,
            charset: 'utf8mb4'
          });
    }

    async getConnection(): Promise<PoolConnection> {
        return await this.pool.getConnection();  // Get a connection from the connection pool
    }

    releaseConnection(conn: PoolConnection): void {
        conn.release();  // Release the connection back to the pool
    }

    async executeQuery<T>(conn: PoolConnection, query: string, params: any[] = []): Promise<T> {
        const result = await conn.query(query, params);  // Execute the query with optional parameters
        return result as unknown as T;  // Return the rows from the result
    }
}
