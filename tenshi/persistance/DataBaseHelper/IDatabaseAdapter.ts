// Interface that each database adapter should implement
export interface IDatabaseAdapter {
    getConnection(): Promise<any>;  // Method to get a database connection
    releaseConnection(conn: any): void;  // Method to release the database connection
    executeQuery<T>(conn: any, query: string, params?: any[]): Promise<T>;  // Method to execute a SQL query
}
