
import { Request  } from "@modules/index";
export const requiredBodyList = (req: Request): string[] => {
    return [
        req.body.id_user_receive, 
        req.body.notification_code
    ];
}

