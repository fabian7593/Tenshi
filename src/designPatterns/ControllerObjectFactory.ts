import ControllerObject from "@index/objects/ControllerObject";
import { EntityTarget } from "typeorm";
import { toSnakeCase, camelToUpperSnakeCase } from "@utils/generalUtils";

export function createControllerObject(entity: EntityTarget<any>): ControllerObject {

    const entityName = getEntityName(entity);
    const entityNameUpper = camelToUpperSnakeCase(entityName);
    return {
        create: `CREATE`,
        update: `UPDATE`,
        delete: `DELETE`,
        getAll: `GET_ALL`,
        getById: `GET_BY_ID`,
        controller: `${entityNameUpper}_CONTROLLER`,
        route: `/${toSnakeCase(entityName)}`
    };
};

function getEntityName(entity: EntityTarget<any>): string {
    return (entity as any).name;
}