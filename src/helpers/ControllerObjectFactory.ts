import ControllerObject from "@index/objects/ControllerObject";
import { EntityTarget } from "typeorm";
import { toSnakeCase } from "@utils/generalUtils";

export function createControllerObject(entity: EntityTarget<any>): ControllerObject {

    const entityName = getEntityName(entity);
    const entityNameUpper = entityName.toUpperCase();
    return {
        create: `${entityNameUpper}_ADD`,
        update: `${entityNameUpper}_UPDATE`,
        delete: `${entityNameUpper}_DELETE`,
        getAll: `${entityNameUpper}_READ`,
        getById: `${entityNameUpper}_GET_BY_ID`,
        controller: `${entityNameUpper}_CONTROLLER`,
        route: `/${toSnakeCase(entityName)}`
    };
};

function getEntityName(entity: EntityTarget<any>): string {
    return (entity as any).name;
}