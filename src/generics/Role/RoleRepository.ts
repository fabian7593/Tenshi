import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

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

  private constructor() {
    this.roles = [];
    this.loadRolesFromFile('./src/data/json/roles.json');
  }

  public static getInstance(): RoleRepository {
    if (!RoleRepository.instance) {
      RoleRepository.instance = new RoleRepository();
    }
    return RoleRepository.instance;
  }

  private async loadRolesFromFile(filePath: string): Promise<void> {
    try {
      const data = await readFile(filePath, 'utf8');
      this.roles = JSON.parse(data).roles;
    } catch (error: any) {
      throw new Error(`Error reading roles from file: ${error.message}`);
    }
  }

  public async getPermissionByFuncAndRole(roleCode: string, funcCode: string): Promise<Role | null> {
    const role = this.roles.find(role => role.code === roleCode);

    if (!role) {
      return null;
    }

    const table = role.tables.find(table =>
      table.function_list && table.function_list.includes(funcCode)
    );

    if (table) {
      return role;
    }

    const screen = role.screens.find(screen =>
      screen.function_list && screen.function_list.includes(funcCode)
    );

    return screen ? role : null;
  }

  public async getScreensByRole(roleCode: string): Promise<string[] | null> {

    const role = this.roles.find(role => role.code === roleCode);

    if (!role || !role.screens) {
      return null;
    }

    const screenNames = role.screens.map(screen => screen.name);

    return screenNames;
  }
}

