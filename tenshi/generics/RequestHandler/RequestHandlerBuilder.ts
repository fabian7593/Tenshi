import { Request, Response, 
         IAdapterFromBody,  FindManyOptions,
         IRequestHandlerBuilder, RequestHandler} from 'tenshi/generics/index';

/*
    This class is the design patterns builder for the object Request handlers
    With this pattern, you can add only the necessary data for run into the Generic Controller
    The only 2 required fields are request and response into the constructor

*/
export default class RequestHandlerBuilder implements IRequestHandlerBuilder {
    private res: Response;
    private req: Request;
    //this variable is the name of the method to save on logs
    private method: string = '';
    //this variable is the name of the module
    private module: string = '';
    //add specific adapter
    private adapter: IAdapterFromBody;
    //if you need to validate role, set it on true
    private requireValidateRole: boolean = false;
    //If the table has a logical remove, use it
    private requireLogicalRemove: boolean = false;
    //If the table have a foreign key with user id and needed to update, delete or something else, by this user id
    private requireValidWhereByUserId: boolean = false;
    //the list of regular expression
    private regexValidatorList: [string, string][];
    //List of required fields
    private requiredFieldsList: Array<string> 
    //the filters for the gets
    private filters: FindManyOptions;

    constructor(res: Response, req: Request) {
        this.res = res;
        this.req = req;
    }

    setRequiredFiles(requiredFieldsList: Array<string>): IRequestHandlerBuilder {
        this.requiredFieldsList = requiredFieldsList;
        return this;
    }

    //Set filters for get many into Type ORM
    setFilters(filters: FindManyOptions): IRequestHandlerBuilder {
        this.filters = filters;
        return this;
    }

    //Set the name of the method to register into logs
    setMethod(method: string): IRequestHandlerBuilder {
        this.method = method;
        return this;
    }

   

    //Set the adapter of the current entity 
    setAdapter(adapter: IAdapterFromBody): IRequestHandlerBuilder {
        this.adapter = adapter;
        return this;
    }

    //Add list of strings to send into regex multiple validation
    setRegexValidation(regexValidatorList: [string, string][]): IRequestHandlerBuilder {
        this.regexValidatorList = regexValidatorList;
        return this;
    }

    //If the user need to validate the function with his current role
    isValidateRole(module: string): IRequestHandlerBuilder {
        this.module = module;
        this.requireValidateRole = true;
        return this;
    }

    //if is a remove or get, add this to set this functions as a logical remove
    isLogicalDelete(): IRequestHandlerBuilder {
        this.requireLogicalRemove = true;
        return this;
    }

    isValidateWhereByUserId(): IRequestHandlerBuilder {
        this.requireValidWhereByUserId = true;
        return this;
    }

    //Return an object of request handler
    build(): RequestHandler {
        return new RequestHandler(this.res, this.req, 
                                  this.method, this.module, 
                                  this.adapter, 
                                  this.requireValidateRole, 
                                  this.requireLogicalRemove,
                                  this.requireValidWhereByUserId,
                                  this.regexValidatorList,
                                  this.requiredFieldsList,
                                  this.filters );
    }
}