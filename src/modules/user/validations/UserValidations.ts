
import { ConstRegex } from "@index/consts/Const";
import { Request } from "@modules/index";
export const regexValidationList = (req: Request): [string, string][] => {
    return [
        [ConstRegex.EMAIL_REGEX, req.body.email as string],
        [ConstRegex.PASSWORD_REQUIRED_REGEX, req.body.password as string],
        [ConstRegex.LANGUAGE_MAX_LENGHT_REGEX, req.body.language as string]
    ];
};

export const requiredBodyList = (req: Request): string[] => {
    return [
        req.body.first_name, 
        req.body.last_name, 
        req.body.email, 
        req.body.password
    ];
}
      
export const regexValidationRecoverUserAndPassList = (req: Request): [string, string][] => {
    return [
        [ConstRegex.EMAIL_REGEX, req.body.email as string]
    ];
};

export const requiredBodyRecoverUserAndPassList = (req: Request): string[] => {
    return [
        req.body.email
    ];
}
      
