import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";
import { config } from "@index/index";

export default  class UserDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    //POST
    entityFromPostBody() : User{
        const entity = new User();
        entity.id = this.req.body.id || null;
        entity.card_id = this.req.body.card_id;
        entity.first_name = this.req.body.first_name;
        entity.last_name = this.req.body.last_name;
        entity.email = this.req.body.email;
        entity.phone_number = this.req.body.phone_number;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.password = this.req.body.password;
        entity.gender = this.req.body.gender || null;
        entity.birth_date = this.req.body.birth_date || null;
        entity.country_iso_code = this.req.body.country_iso_code || null;
        entity.role_code = this.req.body.role_code || config.SERVER.CUSTOMER_REGULAR_ROLE;
        entity.language = this.req.body.language || null;
        return entity;
    }

    entityToResponse(user: User) : any{
    
        return  {
            id : user.id,
            card_id: user.card_id,
            first_name: user.first_name,
            lastName: user.last_name,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            phone_number: user.phone_number,
            latitude: user.latitude,
            longitude: user.longitude,
            country_iso_code: user.country_iso_code,
            gender: user.gender,
            birth_date: user.birth_date,
            role: user.role_code,
            language: user.language
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
    
    //PUT
    entityFromPutBody() : User{
        const entity = new User();
        entity.card_id = this.req.body.card_id;
        entity.first_name = this.req.body.first_name;
        entity.last_name = this.req.body.last_name;
        entity.email = this.req.body.email;
        entity.phone_number = this.req.body.phone_number;
        entity.latitude = this.req.body.latitude || null;
        entity.longitude = this.req.body.longitude || null;
        entity.gender = this.req.body.gender || null;
        entity.birth_date = this.req.body.birth_date || null;
        entity.language = this.req.body.language || null;
        return entity;
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
        userLogin.password = this.req.body.password;
    
        return userLogin;
    }

    userFromBodyRecoverUserByEmail(): User{
        const userLogin = new User();
        userLogin.email = this.req.body.email;
    
        return userLogin;
    }
}
