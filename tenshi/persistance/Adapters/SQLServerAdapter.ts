import { IDatabaseAdapter } from 'tenshi/helpers/DataBaseHelper/IDatabaseAdapter';
import sql, { ConnectionPool, Request } from 'mssql';

import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();

export class SqlServerAdapter implements IDatabaseAdapter {

    private pool: ConnectionPool;
    constructor() {
        //postgressql Config
        this.pool = new sql.ConnectionPool({
            server: config.DB.HOST,
            user: config.DB.USER,
            password: config.DB.PASSWORD,
            database: config.DB.NAME,
            port: config.DB.PORT
        });
    }

    async getConnection(): Promise<ConnectionPool> {
        return await this.pool.connect();
    }

    releaseConnection(conn: ConnectionPool): void {
        conn.close();  // SQL Server use close instead of release
    }

    async executeQuery<T>(conn: ConnectionPool, query: string, params: any[] = []): Promise<T> {
        const request = new Request(conn);
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });
        const result = await request.query(query);
        return result.recordset as unknown as T;
    }
}
