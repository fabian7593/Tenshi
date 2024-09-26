import { ConstMessagesJson, ConstStatusJson } from '@TenshiJS/consts/Const';
import { NextFunction, Response, Request} from 'express';
import HttpAction from 'tenshi/helpers/HttpAction';

export default function RouteNotFoundMiddleware(req : Request, res: Response, next: NextFunction) {
    const httpExec = new HttpAction(res);
    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.ROUTE_DONT_EXISTS);
}