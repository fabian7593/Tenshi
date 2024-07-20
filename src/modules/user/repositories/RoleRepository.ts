import { FindOneOptions, FindManyOptions, RoleFunctionallity, Repository, RoleScreen } from "@modules/index";

import { default as GenericRepository } from "@generics/Repository/GenericRepository"
import { Role } from "@index/entity/Role";

export default class RoleRepository extends GenericRepository{

    private repositoryRoleFunctionallity: Repository<RoleFunctionallity>;
    private repositoryRoleScreen: Repository<RoleScreen>;

    constructor() {
        super(Role);
        this.repositoryRoleFunctionallity = this.dataSource.getRepository(RoleFunctionallity);
        this.repositoryRoleScreen = this.dataSource.getRepository(RoleScreen);
    }

    //search by code role and function codes
    async getPermissionByFuncAndRole(roleCode: string, funCode: string): Promise<RoleFunctionallity | null> {
        try {
            //find by user and password
            const options: FindOneOptions = { where: { "role_code" : roleCode, "function_code": funCode } }; 
            const getEntity = await this.repositoryRoleFunctionallity.findOne(options); 
            return getEntity; 

        } catch (error : any) {
            throw error;
        } 
    }

    async getScreensByRole(roleCode: string): Promise<string[] | null> {

        try {

            const options: FindManyOptions = { where: { "role_code" : roleCode} }; 
            const getEntities = await this.repositoryRoleScreen.find(options); 
            const listScreens: string[] = [];

            if(getEntities != null){
                getEntities.forEach(roleScreen => {
                    listScreens.push(roleScreen.screen_code);
                });
            }

            if (listScreens && listScreens.length > 1) {
                return listScreens; 
            }else{
                return null;
            }

        } catch (error : any) {
        
            throw error;
        } 
    }
}

