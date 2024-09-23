import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

import { ConstMessages } from "tenshi/consts/Const";
import ConfigManager from "tenshi/config/ConfigManager";

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  modules: { name: string; function_list: string[] | null }[];
  screens: { name: string; function_list: string[] | null }[];
}

export default class RoleRepository {
  private static instance: RoleRepository;
  private roles: Role[];

  /**
   * Constructor for the RoleRepository class.
   *
   * This constructor initializes the roles array and loads the roles data from a JSON file.
   * The roles data is stored in the roles array.
   * The roles file path is './src/data/json/roles.json'.
   */
  private constructor() {
    const config = ConfigManager.getInstance().getConfig();

    // Initialize the roles array.
    this.roles = [];

    // Load the roles data from the JSON file.
    this.loadRolesFromFile(config.URL_FILES.ROLES_JSON);
  }
  

  /**
   * Returns the instance of the RoleRepository class.
   *
   * If the instance does not exist, it creates a new instance of the RoleRepository class.
   * Then, it returns the instance.
   *
   * @return {RoleRepository} The instance of the RoleRepository class.
   */
  public static getInstance(): RoleRepository {
    // Check if the instance already exists
    if (!RoleRepository.instance) {
      // If not, create a new instance
      RoleRepository.instance = new RoleRepository();
    }

    // Return the instance
    return RoleRepository.instance;
  }


  /**
   * Loads the role data from a JSON file.
   *
   * This function reads the contents of the specified file path using the `readFile`
   * function and parses the JSON data into an array of role objects. The role objects
   * are stored in the `roles` array of the `RoleRepository` instance.
   *
   * @param {string} filePath - The path to the JSON file containing the role data.
   * @return {Promise<void>} - A promise that resolves when the role data is loaded.
   * @throws {Error} - If there is an error reading the file or parsing the JSON data.
   */
  private async loadRolesFromFile(filePath: string): Promise<void> {
    try {
      // Read the contents of the file using the `readFile` function.
      const data = await readFile(filePath, 'utf8');

      // Parse the JSON data into an array of role objects.
      this.roles = JSON.parse(data).roles;
    } catch (error: any) {
      // If there is an error, throw an error with a descriptive message.
      throw new Error(`${ConstMessages.ERROR_ROLE_FILE} ${error.message}`);
    }
  }


 
  /**
   * Retrieves the role object that contains the specified function code
   * among its table or screen function lists.
   *
   * @param {string} roleCode - The code of the role to be searched.
   * @param {string} moduleName - The name of the module to be searched.
   * @param {string} action - The function code to be searched.
   * @return {Promise<boolean>} - A promise that resolves to true if the function code is found
   * in the role's module function list, false otherwise.
   */
  public async getPermissionByFuncAndRole(roleCode: string, moduleName : string, action: string): Promise<boolean> {
    // Find the role object with the specified role code.
    const role = this.roles.find(role => role.code === roleCode);

    // If no role is found, return false.
    if (!role) {
      return false;
    }

    // Find the module object with the specified module name.
    const module = role.modules.find(module => module.name === moduleName);

    // If no module is found, return false.
    if (!module) {
      return false;
    }

    // Check if the module has a non-null function list.
    if(module.function_list !== null){
      // Find the function name in the module's function list.
      const functionName = module.function_list.find(functionName => functionName == action );

      // If the function name is not found, return false.
      if (!functionName) {
        return false;
      }
    }else{
      // If the module has a null function list, return false.
      return false;
    }

    // If the function code is found in a module, return true.
    return true;
  }
 
  

  /**
   * Retrieves the names of the screens associated with the specified role code.
   *
   * @param {string} roleCode - The code of the role to retrieve the screens for.
   * @return {Promise<string[] | null>} - A promise that resolves to an array of screen names,
   * or null if the role does not exist or has no screens associated with it.
   */
  public async getScreensByRole(roleCode: string): Promise<string[] | null> {
    // Find the role object with the specified code.
    const role = this.roles.find(role => role.code === roleCode);

    // If no role is found or the role has no screens, return null.
    if (!role || !role.screens) {
      return null;
    }

    // Retrieve the names of the screens associated with the role.
    const screenNames = role.screens.map(screen => screen.name);

    // Return the array of screen names.
    return screenNames;
  }


  /**
   * Retrieves the list of roles with their IDs, names, and codes.
   *
   * @return {Promise<{ id: number, name: string, code: string }[]>} - A promise that resolves to an array of role objects with their IDs, names, and codes.
   */
  public async getRoles(): Promise<{ id: number, name: string, code: string }[]> {
    
    if (!this.roles || this.roles.length === 0) {
      // If there are no roles, return an empty array.
      return [];
    }

    // Map the roles to an array of objects with their IDs, names, and codes.
    return this.roles.map(role => ({
      id: role.id,
      name: role.name,
      code: role.code
    }));
  }
}

