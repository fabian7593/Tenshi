import { IDatabaseAdapter } from 'tenshi/persistance/DataBaseHelper/IDatabaseAdapter';
import { Pool, PoolConnection } from 'mariadb';
import mariadb from 'mariadb';

import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();

// MariaDB adapter implementing the IDatabaseAdapter interface
export class MariaDbAdapter implements IDatabaseAdapter {

    private pool: Pool;
    constructor() {
        //Maria DB Config
        this.pool = mariadb.createPool({
            host: config.DB.HOST,
            user: config.DB.USER,
            password: config.DB.PASSWORD,
            database: config.DB.NAME,
            port: config.DB.PORT,
            connectionLimit: 150,
            charset: 'utf8mb4',
            collation: 'utf8mb4_unicode_ci'
        });
    }

    async getConnection(): Promise<PoolConnection> {
        return await this.pool.getConnection();  // Get a connection from the connection pool
    }

    releaseConnection(conn: PoolConnection): void {
        conn.release();  // Release the connection back to the pool
    }

    async executeQuery<T>(conn: PoolConnection, query: string, params: any[] = []): Promise<T> {
        return await conn.query(query, params);  // Execute the query with optional parameters
    }
}
