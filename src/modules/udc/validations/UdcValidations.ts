
import { Request  } from "@modules/index";
export const requiredBodyList = (req: Request): string[] => {
    return [
        req.body.code, 
        req.body.name, 
        req.body.value1
    ];
}
