import { IDatabaseAdapter } from '@TenshiJS/helpers/DataBaseHelper/IDatabaseAdapter';
import pool from "@index/persistance/DatabaseConfigPool";
import { PoolConnection } from 'mariadb';

// MariaDB adapter implementing the IDatabaseAdapter interface
export class MariaDbAdapter implements IDatabaseAdapter {
    async getConnection(): Promise<PoolConnection> {
        return await pool.getConnection();  // Get a connection from the connection pool
    }

    releaseConnection(conn: PoolConnection): void {
        conn.release();  // Release the connection back to the pool
    }

    async executeQuery<T>(conn: PoolConnection, query: string, params: any[] = []): Promise<T> {
        return await conn.query(query, params);  // Execute the query with optional parameters
    }
}
