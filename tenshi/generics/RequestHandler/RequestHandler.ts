import { Request, Response, 
         IAdapterFromBody, FindManyOptions} from 'tenshi/generics/index';

/*
    This class is an object to send into Controllers to do some necessary functionallities
    as regex validate, is remove logical, if need role validations, and others.
*/
export default class RequestHandler {
    private res: Response;
    private req: Request;
    private method: string = "";
    private module: string = "";
    private adapter: IAdapterFromBody;
    private requireValidateRole: boolean = false;
    private requireLogicalRemove: boolean = false;
    private requireValidWhereByUserId: boolean = false;
    private regexValidatorList: [string, string][] | null = null;
    private requiredFieldsList: Array<string> | null = null;
    private filters: FindManyOptions | null = null;

    constructor(res: Response, req: Request, 
                method: string, 
                module: string,
                adapter: IAdapterFromBody, 
                requireValidateRole: boolean,
                requireLogicalRemove: boolean,
                requireValidWhereByUserId: boolean,
                regexValidatorList: [string, string][] | null,
                requiredFieldsList: Array<string> | null,
                filters: FindManyOptions) {
        this.res = res;
        this.req = req;
        this.method = method;
        this.module = module;
        this.adapter = adapter;
        this.requireValidateRole = requireValidateRole;
        this.requireLogicalRemove = requireLogicalRemove;
        this.requireValidWhereByUserId = requireValidWhereByUserId;
        this.regexValidatorList = regexValidatorList;
        this.requiredFieldsList = requiredFieldsList;
        this.filters = filters;
    }

     // Getters
     getResponse(): Response {
        return this.res;
    }

    getRequest(): Request {
        return this.req;
    }

    getMethod(): string {
        return this.method;
    }

    getModule(): string {
        return this.module;
    }

    getAdapter(): IAdapterFromBody {
        return this.adapter;
    }

    getRoleValidation(): boolean {
        return this.requireValidateRole;
    }

    getLogicalDelete(): boolean {
        return this.requireLogicalRemove;
    }

    getRequireValidWhereByUserId(): boolean {
        return this.requireValidWhereByUserId;
    }

    getRegexValidatorList(): [string, string][] | null {
        return this.regexValidatorList;
    }

    getRequiredFieldsList(): Array<string> | null {
        return this.requiredFieldsList;
    }

    getFilters(): FindManyOptions | null {
        return this.filters;
    }
}
        

