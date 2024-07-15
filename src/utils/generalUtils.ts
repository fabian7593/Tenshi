import {  Request } from "express";

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
