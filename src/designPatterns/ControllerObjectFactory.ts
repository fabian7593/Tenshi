import ControllerObject from "@index/objects/ControllerObject";
import { EntityTarget } from "typeorm";
import { toSnakeCase, camelToUpperSnakeCase } from "@utils/generalUtils";

export function createControllerObject(entity: EntityTarget<any>): ControllerObject {

    const entityName = getEntityName(entity);
    const entityNameUpper = camelToUpperSnakeCase(entityName);
    return {
        create: `${entityNameUpper}_CREATE`,
        update: `${entityNameUpper}_UPDATE`,
        delete: `${entityNameUpper}_DELETE`,
        getAll: `${entityNameUpper}_GET_ALL`,
        getById: `${entityNameUpper}_GET_BY_ID`,
        controller: `${entityNameUpper}_CONTROLLER`,
        route: `/${toSnakeCase(entityName)}`
    };
};

function getEntityName(entity: EntityTarget<any>): string {
    return (entity as any).name;
}