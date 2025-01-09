import { ConstMessages } from 'tenshi/consts/Const';
import { EntityTarget, EntityManager, FindOneOptions, FindManyOptions, Database, Repository} from 'tenshi/generics/index';
import IGenericRepository from "tenshi/generics/Repository/IGenericRepository";
import { DataSource, QueryFailedError } from 'typeorm';

/*
    This class have the Connection to DB with ORM &&
    This class have all the necessary and generic methods some of gets,
    update, delete, logical delete, and add
*/

export default  class GenericRepository implements IGenericRepository{

    //the ds to get it on hereby
    private dataSource: DataSource;

    //This is the dynamic object for entitie DB
    private entityTarget: EntityTarget<any>;

    //this variable is for do dynamic crud, sending the specific entity target
    private entityManager: EntityManager;
    
    //this variable is protected, because we need to use it on hereby classes
    //to do specific CRUDS, to specifics repositories
    private repository: Repository<any>;
   
    //the constructor method init the Singleton of DB connection and send it the entity target
    constructor(entityTarget: EntityTarget<any>) {
        this.entityTarget = entityTarget;
        this.initialize(); 
    }
 

    private async initialize() {
        this.dataSource = await Database.getInstance(); 
        this.repository = this.dataSource.getRepository(this.entityTarget);
        this.entityManager = this.dataSource.manager; 
    }

     /**
     * Getter and Setters
     */
     public getRepository(): Repository<any> {
        return this.repository;
    }

    public getDataSource(): DataSource {
        return this.dataSource;
    }

    public setDataSource(dataSource: DataSource) {
         this.dataSource = dataSource;
    }
    
    /**
     * Adds a new entity to the database.
     *
     * @param {any} entity - The entity to be added.
     * @return {Promise<any>} - The saved entity.
     * @throws {Error} - If there was an error while adding the entity.
     */
    async add(entity: any): Promise<any> {

        try {
            // Save the entity to the database and return the saved entity
            const savedEntity = await this.entityManager.save(this.entityTarget, entity);
            return savedEntity;

        } catch (error: any) {
            // Throw the error if there was an issue adding the entity
            throw error;
        } 
    }
  

    /**
     * Updates an entity in the database by its ID.
     *
     * @param {number} id - The ID of the entity to be updated.
     * @param {Partial<any>} newData - The new data to update the entity with.
     * @param {boolean} hasLogicalDeleted - Indicates whether the entity has a logical deleted flag.
     * @return {Promise<any | undefined>} The updated entity, or undefined if it was not found.
     * @throws {Error} If there was an error while updating the entity.
     */
    async update(id: number|string, 
                 newData: Partial<any>, 
                 hasLogicalDeleted : boolean): Promise<any | undefined> {
        try {
            // Update the entity by ID with the new data
            await this.entityManager.update(this.entityTarget, id, newData);

            // Prepare the options for finding the updated entity
            let options: FindOneOptions<any> = {
                where: { id: id } // Specify the ID of the entity to find
            };

            // If the entity has a logical deleted flag, add a condition to find only non-deleted entities
            if(hasLogicalDeleted){
                if (typeof options.where === 'object' && options.where !== null) {
                    options.where = {
                        ...options.where, // Merge the existing conditions with the new condition
                        "is_deleted": 0 // Add a condition to find only non-deleted entities
                    };
                }
            }

            // Find and return the updated entity
            const updatedEntity = await this.entityManager.findOne(this.entityTarget, options); 
            return updatedEntity; 

        } catch (error : any) {
            // Throw the error if there was an issue updating the entity
            throw error;
        }
    }
   

    /**
     * Removes an entity from the database by its ID.
     *
     * @param {number} id - The ID of the entity to be removed.
     * @return {Promise<any>} The entity that was removed from the database.
     * @throws {Error} If the entity is not found or if there was an error while deleting the entity.
     */
    async remove(id: number|string): Promise<any> {

        try {
            // Define the options for finding the entity by its ID
            let options : FindOneOptions;
            options = { where: { id : id }  };  // Set the where clause to find the entity by its ID

            // Find the entity by its ID
            const entity = await this.entityManager.findOne(this.entityTarget, options); 

            // Delete the entity from the database by its ID
            await this.entityManager.delete(this.entityTarget, id);

            // Return the entity that was removed from the database
            return entity;
          
        } catch (error : any) {
            // If there was an error while deleting the entity, throw the error
            throw error;
        } 
    }

    
    async removeByOptions(options: FindManyOptions): Promise<any> {
        try {
        
            const whereCondition = options.where;
            // Delete the entity from the database by its ID
            const entity = await this.entityManager.delete(this.entityTarget, whereCondition);

            // Return the entity that was removed from the database
            return entity;
          
        } catch (error : any) {
            // If there was an error while deleting the entity, throw the error
            throw error;
        } 
    }
   

    /**
     * Logically remove an entity by its ID.
     * 
     * This function updates the "is_deleted" property of the entity to true,
     * indicating that the entity is logically deleted.
     *
     * @param {number} id - The ID of the entity to be logically removed.
     * @return {Promise<any>} The entity that was logically removed.
     * @throws {Error} If the entity is not found or if the entity does not have an "is_deleted" property.
     */
    async logicalRemove(id: number|string): Promise<any> {
        try {
            let options : FindOneOptions;
            options = { where: { id : id }  };  // Set the options to find the entity by its ID

            const entity = await this.entityManager.findOne(this.entityTarget, options);  // Find the entity by its ID

            if (entity["is_deleted"] === undefined) {  // Check if the entity has an "is_deleted" property
                throw new Error(ConstMessages.ERROR_NOT_HAVE_IS_DELETED);  // Throw an error if the entity does not have the property
            }

            entity["is_deleted"] = true;  // Set the "is_deleted" property of the entity to true

            // Update the entity by ID with the new data, including the "is_deleted" property
            await this.entityManager.update(this.entityTarget, id, entity);

            return entity;  // Return the entity that was logically removed

        } catch (error : any) {
            throw error;  // Throw any errors that occur during the process
        } 
    }

    /**
     * Find an entity by its ID.
     * 
     * @param {number} id - The ID of the entity.
     * @param {boolean} hasLogicalDeleted - Whether the entity is logical deleted.
     * @return {Promise<any>} The entity found.
     * @throws {Error} If the entity is not found.
     */
    async findById(id: number|string, 
                   hasLogicalDeleted : boolean, 
                   options: FindManyOptions | null = {}): Promise<any> {
        try {

            let finalOptions: FindManyOptions = options !== null ? { ...options } : {};

            // Prepare the options for the entity manager's findOne method
            finalOptions.where = {
                ...finalOptions.where,
                id : id
            };

            // If the entity is supposed to be logical deleted, add the filter for it
            if(hasLogicalDeleted){
                finalOptions.where = {
                    ...finalOptions.where,
                    is_deleted: 0
                };
            }

            // Find the entity by ID
            const entity = await this.entityManager.findOne(this.entityTarget, finalOptions); 

            // Return the found entity
            return entity;

        } catch (error : any) {
            // If the entity is not found, throw an error
            throw error;

        } 
    }
   

    /**
     * Find an entity by its code.
     * 
     * @param {string} code - The code of the entity.
     * @param {boolean} hasLogicalDeleted - Whether the entity is logical deleted.
     * @return {Promise<any | undefined>} The entity found, or undefined if not found.
     */
    async findByCode(code: string, 
                     hasLogicalDeleted : boolean, 
                     options: FindManyOptions | null = {}): Promise<any | undefined> {
        try {
            // Set up the options for finding the entity
            let finalOptions: FindManyOptions = options !== null ? { ...options } : {};
            finalOptions.where = {
                ...finalOptions.where,
                code : code
            };

            // If the entity is supposed to be logical deleted, add the filter for it
            if(hasLogicalDeleted){
                finalOptions.where = {
                    ...finalOptions.where,
                    is_deleted: 0
                };
            }

            // Find the entity with the specified code
            const entity = await this.entityManager.findOne(this.entityTarget, finalOptions); 
            return entity;

        } catch (error : any) {
            // Throw the error if it occurs
            throw error;
        } 
    }

    /**
     * Find all entities.
     * 
     * @param {boolean} hasLogicalDeleted - Whether the entities are logical deleted.
     * @param {number} [page=1] - The page number.
     * @param {number} [size=3000] - The number of entities per page.
     * @return {Promise<any[] | null>} The entities found.
     */
    async findAll(hasLogicalDeleted: boolean, options: FindManyOptions | null = {},
                  page: number = 1, size: number = 3000): Promise<any[] | null> {
        try {

            // Calculate the offset based on the page and size
            const offset = (page - 1) * size;

            const finalOptions: FindManyOptions = options !== null ? { ...options } : {};

            // If logical deletion is required, set the where clause
            if(hasLogicalDeleted){
                finalOptions.where = {
                    ...finalOptions.where,
                    is_deleted: 0
                };
            }

            // Set the skip and take options for pagination
            finalOptions.skip = offset;
            finalOptions.take = size;

            // Find entities using the entity manager
            const getEntities = await this.entityManager.find(this.entityTarget, finalOptions); 
          
            return getEntities;
        } catch (error : any) {
            // Throw the error
            throw error;
        } 
    }



    async findByOptions(hasLogicalDeleted: boolean, isFindAll : boolean = true, options: FindManyOptions | null): Promise<any | undefined> {
        try {
            // Set up the options for finding the entity
            let finalOptions: FindManyOptions = options !== null ? { ...options } : {};
         
            // If the entity is supposed to be logical deleted, add the filter for it
            if(hasLogicalDeleted){
                finalOptions.where = {
                    ...finalOptions.where,
                    is_deleted: 0
                };
            }

           if(!isFindAll){
                const entity = await this.entityManager.findOne(this.entityTarget, finalOptions); 
                return entity;
           }else{
                const entity = await this.entityManager.find(this.entityTarget, finalOptions); 
                return entity;
           }
            
        } catch (error : any) {
            // Throw the error if it occurs
            throw error;
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

