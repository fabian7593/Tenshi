import { FindOneOptions, createConnection, 
         GenericRepository } from "@modules/index";

import { User } from "@user/index";

export default class UserRepository extends GenericRepository{

    constructor() {
        super(User);
    }

    async getUserByEmail(entity: any): Promise<User | null> {

        const connection = await createConnection();

        try {
            const user : User = entity;
            const email = user.email;

            //find by user and password
            const repository = connection.getRepository(User);
            let options: FindOneOptions = { where: { email: email, "is_deleted" : 0, "is_active": 1} }; 
            const getEntity = await repository.findOne(options); 
            return getEntity ; 

        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }



    async getUserByEmailParam(email: string): Promise<User | null> {

        const connection = await createConnection();

        try {
            //find by user and password
            const repository = connection.getRepository(User);
            let options: FindOneOptions = { where: { email: email, "is_deleted" : 0} }; 
            const getEntity = await repository.findOne(options); 
            return getEntity ; 

        } catch (error : any) {
            throw error;

        } finally {
            if(connection){
                await connection.close();
            }
        }
    }

}

