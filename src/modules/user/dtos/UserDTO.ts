import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";
import { config } from "@index/index";

export default  class UserDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }


      private getEntity(isCreating: boolean): User {
            const entity = new User();
            entity.card_id = this.req.body.card_id;
            entity.first_name = this.req.body.first_name;
            entity.last_name = this.req.body.last_name;
            entity.user_name = this.req.body.user_name;
            entity.email = this.req.body.email;
            entity.phone_number = this.req.body.phone_number;
            entity.bio = this.req.body.bio;
            entity.password = this.req.body.password;
            entity.gender = this.req.body.gender;
            entity.birth_date = this.req.body.birth_date;
            entity.country_iso_code = this.req.body.country_iso_code;
            entity.city_name = this.req.body.city_name;
            entity.postal_code = this.req.body.postal_code;
            entity.latitude = this.req.body.latitude;
            entity.longitude = this.req.body.longitude;
            entity.role_code = this.req.body.role_code || config.SERVER.CUSTOMER_REGULAR_ROLE;
            entity.language = this.req.body.language || config.SERVER.DEFAULT_LANGUAGE;
            entity.profile_picture_url = this.req.body.profile_picture_url;
            entity.is_active_from_email = this.req.body.is_active_from_email;
            
        
            if (isCreating) {
                entity.created_date = new Date();
                entity.account_status = this.req.body.account_status || "pending";
            }else {
                entity.updated_date = new Date();
                entity.is_deleted = this.req.body.is_deleted;
                entity.account_status = this.req.body.account_status;
                entity.fail_login_number = this.req.body.fail_login_number;
            }
            return entity;
        }

    //POST
    entityFromPostBody() : User{
        return this.getEntity(true);
    }

    //PUT
    entityFromPutBody() : User{
        return this.getEntity(false);
    }

    entityToResponse(user: User) : any{
    
        return  {
            id : user.id,
            card_id: user.card_id,
            first_name: user.first_name,
            lastName: user.last_name,
            full_name: `${user.first_name} ${user.last_name}`,
            user_name: user.user_name,
            email: user.email,
            phone_number: user.phone_number,
            bio: user.bio,
            country_iso_code: user.country_iso_code,
            city_name: user.city_name,
            postal_code: user.postal_code,
            latitude: user.latitude,
            longitude: user.longitude,
            gender: user.gender,
            birth_date: user.birth_date,
            role: user.role_code,
            language: user.language,
            profile_picture_url: user.profile_picture_url,
            account_status: user.account_status
        };
    }

    entitiesToResponse(entities: User[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //Login
    tokenToResponse(accessToken: string, refreshToken: string, screens : string[] | null) : any{
        return  {
            access_token : accessToken,
            refresh_token: refreshToken,
            screens_access: screens
        };
    }

    refreshToResponse(accessToken: string) : any{
        return  {
            access_token : accessToken
        };
    }

    userFromBodyLogin(): User{
        const userLogin = new User();
        userLogin.email = this.req.body.email;
        userLogin.user_name = this.req.body.user_name;
        userLogin.password = this.req.body.password;
    
        return userLogin;
    }

    userFromBodyRecoverUserByEmail(): User{
        const userLogin = new User();
        userLogin.email = this.req.body.email;
    
        return userLogin;
    }

    rolesToResponse(accessToken: string, refreshToken: string, screens : string[] | null) : any{
        return  {
            roles : [accessToken, refreshToken, screens]
        };
    }
}
