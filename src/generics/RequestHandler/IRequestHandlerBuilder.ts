import IAdapterFromBody from "../Adapter/IAdapterFromBody";
import RequestHandler from "./RequestHandler";
import { FindManyOptions } from "typeorm";

export default interface IRequestHandlerBuilder {
    setMethod(method: string): IRequestHandlerBuilder;
    setAdapter(adapter: IAdapterFromBody): IRequestHandlerBuilder;
    setRegexValidation(regexValidatorList: [string, string][]): IRequestHandlerBuilder;
    setRequiredFiles(requiredFieldsList: Array<string> ): IRequestHandlerBuilder;
    setFilters(filters: FindManyOptions): IRequestHandlerBuilder;
    isValidateRole(): IRequestHandlerBuilder;
    isLogicalRemove(): IRequestHandlerBuilder;
    isValidateWhereByUserId(): IRequestHandlerBuilder;
    build(): RequestHandler;
}