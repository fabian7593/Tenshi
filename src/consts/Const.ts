export class ConstFunctions {
    public static readonly CREATE: string = "CREATE";
    public static readonly UPDATE: string = "UPDATE";
    public static readonly DELETE: string = "DELETE";
    public static readonly GET_ALL: string = "GET_ALL";
    public static readonly GET_BY_ID: string = "GET_BY_ID";
    public static readonly CONTROLLER: string = "_CONTROLLER";
}

export class ConstHTTPRequest {
    public static readonly INSERT_SUCESS: string = "INSERT_SUCCESS";
    public static readonly UPDATE_SUCCESS: string = "UPDATE_SUCCESS";
    public static readonly DELETE_SUCCESS: string = "DELETE_SUCCESS";
    public static readonly GET_ALL_SUCCESS: string = "GET_SUCCESS";
    public static readonly GET_BY_ID_SUCCESS: string = "GET_BY_ID_SUCCESS";
    public static readonly SEND_MAIL_SUCCESS: string = "SEND_MAIL_SUCCESS";
}

export class ConstRoles {
    public static readonly ADMIN: string = "ADMIN";
}

export class ConstStatusJson {
    public static readonly NOT_FOUND: string =  "NOT_FOUND";
    public static readonly UNAUTHORIZED: string =  "UNAUTHORIZED";
    public static readonly VALIDATIONS: string =  "VALIDATIONS";
    public static readonly ERROR: string =  "ERROR";
    public static readonly SUCCESS: string =  "SUCCESS";
    public static readonly REGEX: string =  "REGEX";
}

export class ConstMessagesJson {
    public static readonly DONT_EXISTS: string = "DONT_EXISTS";
    public static readonly DATA_BASE_ERROR: string = "DATA_BASE_ERROR";
    public static readonly ERROR_GENERAL: string = "ERROR_GENERAL";
    public static readonly REQUIRED_URL_PARAMS: string = "REQUIRED_URL_PARAMS";
    public static readonly INCOMPLETE_BODY_REQUEST: string = "INCOMPLETE_BODY_REQUEST";
    public static readonly REQUIRED_FIELDS: string = "REQUIRED_FIELDS";
    public static readonly INCOMPLETE_HEADER_REQUEST: string = "INCOMPLETE_HEADER_REQUEST";
    public static readonly INVALID_TOKEN: string = "INVALID_TOKEN";
    public static readonly INVALID_API_KEY: string = "INVALID_API_KEY";
    public static readonly REQUIRED_FILE: string = "REQUIRED_FILE";
    public static readonly ROLE_AUTH_ERROR: string = "ROLE_AUTH_ERROR";
    public static readonly THERE_ARE_NOT_INFO: string = "THERE_ARE_NOT_INFO";
    public static readonly EMAIL_NOT_EXISTS_ERROR: string = "EMAIL_NOT_EXISTS_ERROR";
}

export class ConstMessages {
    public static readonly ERROR_ROLE_FILE: string = "Error reading roles from file: ";
    public static readonly ERROR_PARSING_DEVIDE_INFO: string = "Error parsing device-info: ";
}

export class ConstGeneral {
   
    //HEADERS
    public static readonly HEADER_TYPE: string = "Content-Type";
    public static readonly HEADER_HTML: string = "text/html";
    public static readonly HEADER_AUTH: string = "authorization";
    public static readonly HEADER_API_KEY: string = "x-api-key";
    public static readonly HEADER_X_FORWARDED_FOR: string = "x-forwarded-for";
    public static readonly HEADER_DEVICE_INFO: string = "device-info";

    //DB FIELDS
    public static readonly USER_ID: string = "user_id";
    public static readonly CODE: string = "code";
    public static readonly ID: string = "id";

    //TEMPLATES
    public static readonly GENERIC_TEMPLATE_EMAIL: string = "genericTemplateEmail";

    //ACTION
    public static readonly SEND_MAIL: string = "SEND_MAIL";
}