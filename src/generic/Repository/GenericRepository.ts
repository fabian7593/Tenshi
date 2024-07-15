import { EntityTarget, FindOneOptions, FindManyOptions  } from "typeorm";
import IGenericRepository from "./IGenericRepository"
const { createConnection } = require('typeorm');

/*
    This class have the Connection to DB with ORM &&
    This class have all the necessary and generic methods some of gets,
    update, delete, logical delete, and add
*/

export default  class GenericRepository implements IGenericRepository{
    
    async add(entity: any): Promise<any> {

        console.log("befpre create connection");
        const connection = await createConnection();

        try {
            console.log("enter into repository add");
            const savedEntity = await connection.manager.save(entity);
            return savedEntity;

        } catch (error : any) {
            console.log(error);
            throw error;

        } finally {
           if(connection){
                await connection.close();
           }
        }
    }

    async update(entityType: EntityTarget<any>, id: number, 
                 newData: Partial<any>, 
                 hasLogicalDeleted : boolean): Promise<any | undefined> {
        const connection = await createConnection();

        try {
            //update the entity by id, with the new data
            await connection.manager.update(entityType, id, newData);

            //find by id
            const repository = await connection.getRepository(entityType); 

            let options: FindOneOptions<any> = {
                where: { id: id }
            };
            if(hasLogicalDeleted){
                if (typeof options.where === 'object' && options.where !== null) {
                    options.where = {
                        ...options.where,
                        "is_deleted": 0
                    };
                }
            }
            
            const updatedEntity = await repository.findOne(options); 

            return updatedEntity; 

        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async remove(entityType: EntityTarget<any>, id: number): Promise<any> {
        const connection = await createConnection();

        try {
            const repository = await connection.getRepository(entityType); 

            let options : FindOneOptions;
            options = { where: { id : id }  }; 

            const entity = await repository.findOne(options); 

            //update the entity by id, with the new data
            await connection.manager.delete(entityType, id);
            return entity;
           
        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async logicalRemove(entityType: EntityTarget<any>, id: number): Promise<any> {
        const connection = await createConnection();

        try {

            const repository = await connection.getRepository(entityType); 

            let options : FindOneOptions;
            options = { where: { id : id }  }; 

            const entity = await repository.findOne(options); 

            if(entity.is_deleted != undefined){
                entity.is_deleted = true;
            }

            //update the entity by id, with the new data
            await connection.manager.update(entityType, id, entity);
            return entity;

        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async findById(entityType: EntityTarget<any>, id: number, 
                   hasLogicalDeleted : boolean): Promise<any> {
        const connection = await createConnection();

        try {
            const repository = await connection.getRepository(entityType); 

            let options : FindOneOptions;

            options = { where: { id : id}  }; 

            if(hasLogicalDeleted){
                if (typeof options.where === 'object' && options.where !== null) {
                    options.where = {
                        ...options.where,
                        "is_deleted": 0
                    };
                }
            }

            const entity = await repository.findOne(options); 

            return entity;

        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async findByCode(entityType: EntityTarget<any>, code: string, 
                     hasLogicalDeleted : boolean): Promise<any> {
        const connection = await createConnection();
        try {
            const repository = await connection.getRepository(entityType); 

            let options : FindManyOptions;
            options = { where: { code : code}  }; 

            if(hasLogicalDeleted){
                if (typeof options.where === 'object' && options.where !== null) {
                    options.where = {
                        ...options.where,
                        "is_deleted": 0
                    };
                }
            }

            const entity = await repository.findOne(options); 

            return entity;

        } catch (error : any) {
            throw error;
        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async findAll(entityType: EntityTarget<any>, hasLogicalDeleted: boolean, 
                  page: number = 1, size: number = 3000): Promise<any[] | null> {
        const connection = await createConnection();

        try {

            const offset = (page - 1) * size;

            //find by user and password
            const repository = connection.getRepository(entityType); 
            let options : FindManyOptions;
            if(hasLogicalDeleted){
                options = { where: { "is_deleted" : 0 }  }; 
            }else{
                options = { }; 
            }
            
            options.skip = offset;
            options.take = size;
            const getEntities = await repository.find(options); 
           
            return getEntities;
        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

    async findByFilters(entityType: EntityTarget<any>, options: FindManyOptions, hasLogicalDeleted: boolean,
                        page: number = 1, size: number = 3000
    ): Promise<any>{
        const connection = await createConnection();

        try {
            const offset = (page - 1) * size;

            const repository = connection.getRepository(entityType); 

            if(hasLogicalDeleted){
                if (typeof options.where === 'object' && options.where !== null) {
                    options.where = {
                        ...options.where,
                        "is_deleted": 0
                    };
                }
            }

            options.skip = offset;
            options.take = size;
            const getEntities = await repository.find(options); 
            return getEntities;
        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }
    

    //Execute query scripting and stored procedures.
    /*async executeQueryExample(user: User): Promise<void>{
       await executeQuery(async (conn) => {
            await conn.query(
                'CALL createUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [user.card_id, user.full_name, user.email, user.status, 
                    user.type, user.password, user.gender, user.birth_date, 
                user.country_iso_code, user.role_code]
            );
        });
    }*/
}

