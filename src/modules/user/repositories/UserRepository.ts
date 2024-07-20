import { FindOneOptions, GenericRepository } from "@modules/index";

import { User } from "@user/index";

export default class UserRepository extends GenericRepository{

    constructor() {
        super(User);
    }

    async getUserByEmail(entity: any): Promise<User | null> {

        try {
            const user : User = entity;
            const email = user.email;

            //find by user and password
            let options: FindOneOptions = { where: { email: email, "is_deleted" : 0, "is_active": 1} }; 
            const getEntity = await this.repository.findOne(options); 
            return getEntity ; 

        } catch (error : any) {
            throw error;
        } 
    }

    async getUserByEmailParam(email: string): Promise<User | null> {

        try {
            let options: FindOneOptions = { where: { email: email, "is_deleted" : 0} }; 
            const getEntity = await this.repository.findOne(options); 
            return getEntity ; 

        } catch (error : any) {
            throw error;
        } 
    }
}

