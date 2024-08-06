
import { Request  } from "@modules/index";

export const regexValidationList = (req: Request): [string, string][] => {
    return [
        ['LANGUAGE_MAX_LENGHT_REGEX', req.body.language as string]
    ];
};

export const requiredBodyList = (req: Request): string[] => {
    return [
        req.body.code, 
        req.body.subject, 
        req.body.message
    ];
}
