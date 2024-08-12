// src/utils/Database.ts
import { DataSource, EntitySchema } from "typeorm";
import { debuggingMessage } from "tenshi/utils/logsUtils";
import { Log } from "tenshi/entity/Log";

import ConfigManager  from "tenshi/config/ConfigManager";
import { ConstMessages } from "tenshi/consts/Const";

export class Database {

private static instance: DataSource;
    private constructor() {}

    /**
     * Retrieves the singleton instance of the DataSource.
     * If it doesn't exist, it creates a new instance and initializes it.
     *
     * @param {Array<Function | string | EntitySchema>} [entities] - Optional array of entities to be used by the DataSource.
     * @return {DataSource} The singleton instance of the DataSource.
     */
    public static getInstance(entities?: Array<Function | string | EntitySchema>): DataSource {
        const config = ConfigManager.getInstance().getConfig();
        // If entities array is provided, add Log entity to it. Otherwise, create a new array with Log entity.
        entities = entities ? [...entities, Log] : [Log];

        
        if (!Database.instance) {
            // If instance doesn't exist, create a new instance
            Database.instance = new DataSource({
                type: config.DB.TYPE, // Type of the database
                host: config.DB.HOST, // Host of the database
                port: config.DB.PORT, // Port of the database
                username: config.DB.USER, // Username for the database
                password: config.DB.PASSWORD, // Password for the database
                database: config.DB.NAME, // Name of the database
                entities: entities, // Array of entities to be used
                synchronize: true, // Synchronize the schema with the database
            });

            // Initialize the DataSource
            Database.instance.initialize()
                .then(() => {
                    debuggingMessage(ConstMessages.INIT_DATASOURCE); // Log a message when initialization is successful
                })
                .catch((err) => {
                    throw err; // Throw an error if initialization fails
                });
        }

        return Database.instance; // Return the singleton instance
    }
}
