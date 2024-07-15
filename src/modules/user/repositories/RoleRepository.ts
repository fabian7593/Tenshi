//Type ORM
import { FindOneOptions, FindManyOptions  } from "typeorm";
import { createConnection } from 'typeorm';

//Entities
import GenericRepository from '../../../generic/Repository/GenericRepository';
import { RoleFunctionallity } from '../../../entity/RoleFunctionallity';
import { RoleScreen } from '../../../entity/RoleScreen';

export default  class UserRepository extends GenericRepository{

    //search by code role and function code
    async getPermissionByFuncAndRole(roleCode: string, funCode: string): Promise<RoleFunctionallity | null> {

        const connection = await createConnection();

        try {

            //find by user and password
            const repository = connection.getRepository(RoleFunctionallity); 
            const options: FindOneOptions = { where: { "role_code" : roleCode, "function_code": funCode } }; 
            const getEntity = await repository.findOne(options); 
            
            return getEntity; 

        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async getScreensByRole(roleCode: string): Promise<string[] | null> {

        const connection = await createConnection();

        try {

            //find by user and password
            const repository = connection.getRepository(RoleScreen); 

            const options: FindManyOptions = { where: { "role_code" : roleCode} }; 
            const getEntities = await repository.find(options); 
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

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }


}

