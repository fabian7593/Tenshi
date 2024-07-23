// src/utils/Database.ts
import { DataSource } from "typeorm";
import {default as config} from "@root/unbreakable-config";
import { debuggingMessage } from "@index/index";
import { User } from "@entity/User";
import { Role } from "@entity/Role";
import { RoleFunctionallity } from "@entity/RoleFunctionallity";
import { RoleScreen } from "@entity/RoleScreen";
import { Screen } from "@entity/Screen";
import { Document } from "@entity/Document";
import { Log } from "@entity/Log";
import { Notification } from "@entity/Notification";
import { UserNotification } from "@entity/UserNotification";
import { UnitDynamicCentral } from "@entity/UnitDynamicCentral";

export class Database {
    private static instance: DataSource;

    private constructor() {}

    public static getInstance(): DataSource {
        if (!Database.instance) {
            Database.instance = new DataSource({
                type: "mariadb",
                host: config.DB.HOST,
                port: config.DB.PORT,
                username: config.DB.USER,
                password: config.DB.PASSWORD,
                database: config.DB.NAME,
                entities: [User, Role, RoleFunctionallity, 
                           RoleScreen, Screen, Document,
                           Log, Notification, UserNotification,
                           UnitDynamicCentral],
                synchronize: true,
            });

            Database.instance.initialize()
                .then(() => {
                    debuggingMessage("Data Source has been initialized!");
                })
                .catch((err) => {
                    throw err;
                });
        }

        return Database.instance;
    }
}
