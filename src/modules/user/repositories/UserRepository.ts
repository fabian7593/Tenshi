import { FindOneOptions, GenericRepository } from "@modules/index";
import { User } from "@TenshiJS/entity/User";
import { AccountStatusEnum } from "@TenshiJS/enums/AccountStatusEnum";

export default class UserRepository extends GenericRepository{

    constructor() {
        super(User);
    }

    async getUserByEmail(entity: any): Promise<User | null> {

        try {
            const user : User = entity;
            const email = user.email;
            const user_name = user.user_name;

            let getEntity : User | null = null;

            if(email != null && email != undefined){
                //find by user and password
                const options: 
                FindOneOptions = { 
                    where: { 
                        email: email, 
                        "is_deleted" : 0, 
                        "is_active_from_email": 1, 
                        "account_status" : AccountStatusEnum.Active
                    },
                    select: [
                        "id",
                        "card_id",
                        "first_name",
                        "last_name",
                        "bio",
                        "email",
                        "user_name",
                        "phone_number",
                        "password", // Incluye password explícitamente
                        "gender",
                        "birth_date",
                        "country_iso_code",
                        "city_name",
                        "postal_code",
                        "role_code",
                        "is_deleted",
                        "is_active_from_email",
                        "account_status",
                        "fail_login_number",
                        "forgot_password_token",
                        "active_register_token",
                        "latitude",
                        "longitude",
                        "language",
                        "profile_picture_url",
                        "last_login_at",
                        "login_ip_address",
                        "created_at",
                        "updated_at",
                        "verified_at",
                      ],
                }; 
                const getEntityEmail : User = await this.getRepository().findOne(options); 
                getEntity = getEntityEmail;
            }
            
            if(getEntity == null){
                if(user_name != null && user_name != undefined){
                    const options: 
                    FindOneOptions = { 
                        where: { 
                            user_name: user_name, 
                            "is_deleted" : 0, 
                            "is_active_from_email": 1, 
                            "account_status" : AccountStatusEnum.Active
                        },
                        select: [
                            "id",
                            "card_id",
                            "first_name",
                            "last_name",
                            "bio",
                            "email",
                            "user_name",
                            "phone_number",
                            "password", // Incluye password explícitamente
                            "gender",
                            "birth_date",
                            "country_iso_code",
                            "city_name",
                            "postal_code",
                            "role_code",
                            "is_deleted",
                            "is_active_from_email",
                            "account_status",
                            "fail_login_number",
                            "forgot_password_token",
                            "active_register_token",
                            "latitude",
                            "longitude",
                            "language",
                            "profile_picture_url",
                            "last_login_at",
                            "login_ip_address",
                            "created_at",
                            "updated_at",
                            "verified_at",
                          ],
                    }; 
                    getEntity = await this.getRepository().findOne(options); 
                }
            }

            return getEntity ; 

        } catch (error : any) {
            throw error;
        } 
    }

    async getUserByEmailParam(email: string): Promise<User | null> {
        try {
            let options: FindOneOptions = { where: { email: email, "is_deleted" : 0} }; 
            const getEntity = await this.getRepository().findOne(options); 
            return getEntity ; 

        } catch (error : any) {
            throw error;
        } 
    }
}

