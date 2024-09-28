export class ConstFunctions {
    public static readonly CREATE: string = "CREATE";
    public static readonly UPDATE: string = "UPDATE";
    public static readonly DELETE: string = "DELETE";
    public static readonly GET_ALL: string = "GET_ALL";
    public static readonly GET_BY_ID: string = "GET_BY_ID";
    public static readonly CONTROLLER: string = "_CONTROLLER";
}

export class ConstHTTPRequest {
    public static readonly LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
    public static readonly LOGOUT_SUCCESS: string = "LOGOUT_SUCCESS";
    public static readonly REFRESH_TOKEN_SUCCESS: string = "REFRESH_TOKEN_SUCCESS";
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
    public static readonly TOO_MANY_REQUESTS: string =  "TOO_MANY_REQUESTS";
    public static readonly ERROR: string =  "ERROR";
    public static readonly SUCCESS: string =  "SUCCESS";
    public static readonly REGEX: string =  "REGEX";
}

export class ConstMessagesJson {
    public static readonly DONT_EXISTS: string = "DONT_EXISTS";
    public static readonly ROUTE_DONT_EXISTS: string = "ROUTE_DONT_EXISTS";
    public static readonly DATA_BASE_ERROR: string = "DATA_BASE_ERROR";
    public static readonly LOGGING_MIDDLEWARE: string = "LOGGING_MIDDLEWARE";
    public static readonly ERROR_GENERAL: string = "ERROR_GENERAL";
    public static readonly REQUIRED_URL_PARAMS: string = "REQUIRED_URL_PARAMS";
    public static readonly INCOMPLETE_BODY_REQUEST: string = "INCOMPLETE_BODY_REQUEST";
    public static readonly REQUIRED_FIELDS: string = "REQUIRED_FIELDS";
    public static readonly INCOMPLETE_HEADER_REQUEST: string = "INCOMPLETE_HEADER_REQUEST";
    public static readonly INVALID_TOKEN: string = "INVALID_TOKEN";
    public static readonly INVALID_API_KEY: string = "INVALID_API_KEY";
    public static readonly REQUIRED_FILE: string = "REQUIRED_FILE";
    public static readonly ROLE_AUTH_ERROR: string = "ROLE_AUTH_ERROR";
    public static readonly ROLE_MODULE_ERROR: string = "ROLE_MODULE_ERROR";
    public static readonly THERE_ARE_NOT_INFO: string = "THERE_ARE_NOT_INFO";
    public static readonly EMAIL_NOT_EXISTS_ERROR: string = "EMAIL_NOT_EXISTS_ERROR";
    public static readonly USER_FAIL_LOGIN_ERROR: string = "USER_FAIL_LOGIN_ERROR";
    public static readonly USER_PASS_ERROR: string = "USER_PASS_ERROR";
    public static readonly RESET_PASSWORD: string = "RESET_PASSWORD";
    public static readonly EMAIL_SENT_SUCCESS: string = "EMAIL_SENT_SUCCESS";
}


export class ConstMessages {
    //Init variables
    public static readonly INIT_MIDDLEWARE: string = "Initialize Middleware: ";
    public static readonly INIT_JWT: string = "Initialize JWT Service";
    public static readonly INIT_DATASOURCE: string = "Data Source has been initialized!";

    //general errors
    public static readonly ERROR_ROLE_FILE: string = "Error reading roles from file: ";
    public static readonly ERROR_PARSING_DEVIDE_INFO: string = "Error parsing device-info: ";
    public static readonly ERROR_NOT_HAVE_IS_DELETED: string = "Entity does not have an 'is_deleted' property.";
    
}

export class ConstGeneral {
    public static readonly GMAIL: string = "gmail";
   
    //HEADERS
    public static readonly HEADER_TYPE: string = "Content-Type";
    public static readonly HEADER_HTML: string = "text/html";
    public static readonly HEADER_JSON: string = "application/json; charset=utf-8";
    public static readonly HEADER_AUTH: string = "authorization";
    public static readonly HEADER_API_KEY: string = "x-api-key";
    public static readonly HEADER_X_FORWARDED_FOR: string = "x-forwarded-for";
    public static readonly HEADER_DEVICE_INFO: string = "device-info";
    public static readonly HEADER_LANGUAGE: string = "accept-language";

    //DB FIELDS
    public static readonly USER_ID: string = "user_id";
    public static readonly CODE: string = "code";
    public static readonly ID: string = "id";

    //JSON
    public static readonly MESSAGES_JSON: string = "tenshi/data/json/messages.json";

    //ACTION
    public static readonly SEND_MAIL: string = "SEND_MAIL";
}


export class ConstLogs {
   
    public static readonly LOG_ERROR: string = "ERROR";
    public static readonly SERVER: string = "SERVER";
    public static readonly BACKEND: string = "BACKEND";
    public static readonly TRACKING: string = "TRACKING";
    public static readonly LOGIN_TRACKING: string = "LoginTracking";
}