import { Request } from "@index/index";
/*
    General Utils is a class that works for every environments
    Its methos can we use in some rest project
*/
export function getUrlParam(key : string, req: Request): string {
    let param : string = "";
    if(req.query[key] != undefined){
        param = req.query[key] as string;
    }

    return param;
}

export function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, "_$1")  // Insert an underscore before each uppercase letter
        .toLowerCase()                // Convert the entire string to lowercase
        .replace(/^_/, "");           // Remove the leading underscore if it exists
}