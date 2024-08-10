import { RequestHandler, IAdapterFromBody, FindManyOptions} from 'tenshi/generics/index';

export default interface IRequestHandlerBuilder {
    setMethod(method: string): IRequestHandlerBuilder;
    setAdapter(adapter: IAdapterFromBody): IRequestHandlerBuilder;
    setRegexValidation(regexValidatorList: [string, string][]): IRequestHandlerBuilder;
    setRequiredFiles(requiredFieldsList: Array<string> ): IRequestHandlerBuilder;
    setFilters(filters: FindManyOptions): IRequestHandlerBuilder;
    isValidateRole(): IRequestHandlerBuilder;
    isLogicalDelete(): IRequestHandlerBuilder;
    isValidateWhereByUserId(): IRequestHandlerBuilder;
    build(): RequestHandler;
}