import ControllerObject from "@index/objects/ControllerObject";
import { EntityTarget } from "typeorm";
import { toSnakeCase, camelToUpperSnakeCase } from "@utils/generalUtils";
import { ConstFunctions } from "@index/consts/Const";

/**
 * This function creates a ControllerObject for a given EntityTarget.
 * It takes an EntityTarget as a parameter and returns a ControllerObject.
 * The ControllerObject has properties for the controller and route names,
 * as well as constants for the HTTP methods.
 *
 * @param {EntityTarget<any>} entity - The EntityTarget for which to create a ControllerObject.
 * @return {ControllerObject} The ControllerObject for the given EntityTarget.
 */
export function createControllerObject(entity: EntityTarget<any>): ControllerObject {
    // Get the name of the entity
    const entityName = getEntityName(entity);
    // Convert the entity name to upper snake case
    const entityNameUpper = camelToUpperSnakeCase(entityName);

    // Create and return the ControllerObject
    return {
        // HTTP method constants for create
        create: ConstFunctions.CREATE,
        // HTTP method constants for update
        update: ConstFunctions.UPDATE,
        // HTTP method constants for delete
        delete: ConstFunctions.DELETE,
        // HTTP method constants for get all
        getAll: ConstFunctions.GET_ALL,
        // HTTP method constants for get by id
        getById: ConstFunctions.GET_BY_ID,
        // The name of the controller for the entity
        controller: `${entityNameUpper}${ConstFunctions.CONTROLLER}`,
        // The route for the entity
        route: `/${toSnakeCase(entityName)}`
    };
};

/**
 * This function returns the name of the given EntityTarget.
 * It takes an EntityTarget as a parameter and returns a string.
 *
 * @param {EntityTarget<any>} entity - The EntityTarget from which to get the name.
 * @returns {string} The name of the EntityTarget.
 */
function getEntityName(entity: EntityTarget<any>): string {
    // Cast the entity to any type to access the name property.
    // This is safe because the name property is a valid property of EntityTarget.
    return (entity as any).name;
}
