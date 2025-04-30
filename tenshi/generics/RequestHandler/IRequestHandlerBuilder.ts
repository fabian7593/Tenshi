import { RequestHandler, IAdapterFromBody, FindManyOptions} from 'tenshi/generics/index';

export default interface IRequestHandlerBuilder {
    setMethod(method: string): IRequestHandlerBuilder;
    setCodeMessageResponse(codeMessage: string): IRequestHandlerBuilder;
    setAdapter(adapter: IAdapterFromBody): IRequestHandlerBuilder;
    setRegexValidation(regexValidatorList: [string, string][]): IRequestHandlerBuilder;
    setRequiredFiles(requiredFieldsList: Array<string> ): IRequestHandlerBuilder;
    setFilters(filters: FindManyOptions): IRequestHandlerBuilder;
    isValidateRole(module: string): IRequestHandlerBuilder;
    setDynamicRoleValidationByEntityField(dynamicRoleList: Array<[string, string]>): IRequestHandlerBuilder;
    isLogicalDelete(): IRequestHandlerBuilder;
    isRequireIdFromQueryParams(isRequired : boolean): IRequestHandlerBuilder;
    build(): RequestHandler;
}