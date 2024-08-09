import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

import { ConstMessages } from "@index/consts/Const";

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  tables: { name: string; function_list: string[] | null }[];
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
    // Initialize the roles array.
    this.roles = [];

    // Load the roles data from the JSON file.
    this.loadRolesFromFile('./src/data/json/roles.json');
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
   * @param {string} funcCode - The code of the function to be searched.
   * @return {Promise<Role | null>} - A promise that resolves to the role object
   * that contains the specified function code, or null if no such role is found.
   */
  public async getPermissionByFuncAndRole(roleCode: string, funcCode: string): Promise<Role | null> {
    // Find the role object with the specified code.
    const role = this.roles.find(role => role.code === roleCode);

    // If no role is found, return null.
    if (!role) {
      return null;
    }

    // Search for the specified function code in the tables of the role.
    const table = role.tables.find(table =>
      table.function_list && table.function_list.includes(funcCode)
    );

    // If the function code is found in a table, return the role object.
    if (table) {
      return role;
    }

    // If the function code is not found in a table, search for it in the screens of the role.
    const screen = role.screens.find(screen =>
      screen.function_list && screen.function_list.includes(funcCode)
    );

    // If the function code is found in a screen, return the role object.
    // Otherwise, return null.
    return screen ? role : null;
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
 
}

