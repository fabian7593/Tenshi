
import { Request  } from "@modules/index";
export const requiredBodyList = (req: Request): string[] => {
    return [
        req.body.code, 
        req.body.subject, 
        req.body.message
    ];
}
