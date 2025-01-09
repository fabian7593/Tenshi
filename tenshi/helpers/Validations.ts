import { Request } from 'express';
import JWTObject  from 'tenshi/objects/JWTObject';
import HttpAction from 'tenshi/helpers/HttpAction';
import { isTokenBlocked } from "@TenshiJS/utils/nodeCacheUtils";

import ConfigManager  from "tenshi/config/ConfigManager";
import { getRegex } from "tenshi/utils/jsonUtils";
import {  ConstStatusJson, ConstGeneral, ConstMessagesJson } from "tenshi/consts/Const";
import { ServerResponse } from 'http';
import { isUndefined } from 'util';

const jwt = require('jsonwebtoken');
/*
    This Validations Class have all the required validation in the app
*/

export default class Validations{
    private req: Request;
    private httpAction: HttpAction;
    private config;

    constructor(req: Request, httpAction: HttpAction) {
        this.req = req;
        this.httpAction = httpAction;
        this.config = ConfigManager.getInstance().getConfig();
    }


    /**
     * This method validates the required fields of the body JSON.
     * 
     * @param {string[] | null} listRequiredFields - The list of required fields.
     * @return {Boolean} - Returns true if all the required fields are present, false otherwise.
     */
    public validateRequiredFields(listRequiredFields: string[] | null): Boolean {
        // Initialize a flag to track if all required fields are present
        let haveAllRequiredFields = true;

        // Check if the list of required fields is not null
        if (listRequiredFields != null) {
            // Iterate over each required field
            listRequiredFields.forEach((requiredField) => {
                // If any of the required fields are undefined, set haveAllRequiredFields to false
                if (requiredField == undefined) {
                    haveAllRequiredFields = false;
                }
            });
        } else {
            // If the list of required fields is null, return an error indicating incomplete request body
            this.httpAction.validationError(ConstMessagesJson.INCOMPLETE_BODY_REQUEST);
        }

        // If haveAllRequiredFields is still true, return an error indicating missing required fields
        if (!haveAllRequiredFields) {
            this.httpAction.validationError(ConstMessagesJson.REQUIRED_FIELDS);
        }

        // Return the status of haveAllRequiredFields
        return haveAllRequiredFields;
    }
   

    /**
     * This function validates multiple regular expressions.
     * It iterates over a list of regular expressions and their corresponding values.
     * For each pair, it checks if the value matches the regular expression.
     * If there is a mismatch, it returns an error object.
     * If all values match the regular expressions, it returns null.
     * 
     * This function is only executed in production mode (i.e., when the server is not in debugging mode).
     *
     * @param {Array<[string, string]> | null} listRegex - An array of tuples containing the name of the regular expression and the value to be validated.
     * @return {Object | null} Returns an error object if there is a mismatch, otherwise returns null.
     */
    public validateMultipleRegex(listRegex: [string, string][] | null) {

        // Validate just in production
        if (listRegex != null) {
            
            for (const [listKey, value] of listRegex) {
                // Get the regular expression object based on the name
                const regexObject = getRegex(listKey);
               
                let regexResult = null;

               
                if (value !== null && value !== undefined) {
                    
                    // Validate the word, if there is an error, validate the regex and return an error validation
                    regexResult = this.validateRegex(value, regexObject.regex, regexObject.message);
                }

                if (regexResult instanceof ServerResponse || regexResult === undefined) {
                    return false;
                }
            }
            
            return true;
        } else {
            return true;
        }
    };



    /**
     * This function validates the format of the current string.
     * It creates a regular expression object and checks if the validation word
     * matches the regular expression. If it does, it returns null, indicating
     * a valid format. Otherwise, it returns an error object with a specific status
     * code and message.
     *
     * @param {string} validationWord - The word to be validated.
     * @param {string} regexStr - The regular expression pattern.
     * @param {string} message - The error message to be returned if the validation fails.
     * @return {object | null} - Returns null if the validation is successful, otherwise an error object.
     */
    private validateRegex(validationWord: string, regexStr: string, message: string): ServerResponse | boolean {
        // Create a regular expression object using the provided regular expression pattern.
        const regex = new RegExp(regexStr);

        // Check if the validation word is not null or undefined and if it matches the regular expression.
        if (validationWord && regex.test(validationWord)) {
            // Valid format.
            return true;
        } else {
            // Return an error object with a specific status code and message.
            return this.httpAction.dynamicError(ConstStatusJson.REGEX, message);
        }
    }
 
 
  

    /**
     * This function validates if the JWT exists and if it is required and if the user has authorization to perform the action.
     * It is used in the Start Middleware.
     *
     * @return {JWTObject | null} The decoded JWT object if the validation is successful, otherwise null.
     */
    public async validateRequireJWT(): Promise<JWTObject | null> {
        const config = ConfigManager.getInstance().getConfig();
        let returnJwt : JWTObject | null = null; 

        try {
            // Check if the request headers exist
            if (!this.req.headers) {
                // If the headers are incomplete, return an error
                this.httpAction.validationError(ConstMessagesJson.INCOMPLETE_HEADER_REQUEST);
            } else {
                // Validate authorization
                if (!this.req.headers[ConstGeneral.HEADER_AUTH]) {
                    // If the authorization header is incomplete, return an error
                    this.httpAction.validationError(ConstMessagesJson.INCOMPLETE_HEADER_REQUEST);
                } else {
                    
                   // Validate assigned secret key with the database
                   let jwtAuth = this.req.headers[ConstGeneral.HEADER_AUTH];
                   let isInvalidToken = false;

                   if (typeof jwtAuth !== 'string') {
                       isInvalidToken = true;
                       // If the token is invalid, return an unauthorized error
                       this.httpAction.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
                   }else{
                       if(await isTokenBlocked(jwtAuth)){
                           isInvalidToken = true;
                           // If the token is invalid, return an unauthorized error
                           this.httpAction.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
                       }
                   }

                   if((jwtAuth as String).startsWith("Bearer ")) {
                       jwtAuth = (jwtAuth as String).split(" ")[1];
                   }

                    if(!isInvalidToken){
                        try {
                            // Verify the token using the secret key from the configuration
                            const decoded = jwt.verify(jwtAuth, config.JWT.MAIN_TOKEN.SECRET_KEY);
                            returnJwt = decoded;
                        } catch (error) {
                            // If the token is invalid, return an unauthorized error
                            this.httpAction.unauthorizedError(ConstMessagesJson.INVALID_TOKEN);
                        }
                    }
                }
            }
        } catch (error: any) {
            // If there is an error during the validation process, return a general error
            this.httpAction.generalError(error, "validateRequireJWT", "Validations");
        }

        return returnJwt;
    }
    


    /**
     * This function validates the required API key.
     * It checks if the API key is present in the request headers.
     * If the API key is present, it compares it with the secret API key stored in the configuration.
     * If the API keys match, it returns `true`.
     * Otherwise, it throws an unauthorized error.
     *
     * @return {boolean | null} Returns `true` if the API keys match, otherwise `null`.
     * @throws {HttpError} Throws an unauthorized error if the API keys do not match.
     */
    public validateRequireSecretApiKey(): boolean | null {
        const config = ConfigManager.getInstance().getConfig();
        let varReturn = null; // Initialize variable to store the return value

        try {
            // Check if the request headers contain the API key
            if (!this.req.headers) {
                // If the request headers are missing, throw a validation error
                this.httpAction.validationError(ConstMessagesJson.INCOMPLETE_HEADER_REQUEST);
            } else {
                // Validate the authorization
                if (!this.req.headers[ConstGeneral.HEADER_API_KEY]) {
                    // If the API key is missing, throw a validation error
                    this.httpAction.validationError(ConstMessagesJson.INCOMPLETE_HEADER_REQUEST);
                } else {
                    // Extract the API key from the request headers
                    const xApiKey = this.req.headers[ConstGeneral.HEADER_API_KEY];

                    try {
                        // Compare the extracted API key with the secret API key stored in the configuration
                        if (xApiKey === config.SERVER.SECRET_API_KEY) {
                            varReturn = true; // If the API keys match, set the return value to true
                        } else {
                            // If the API keys do not match, throw an unauthorized error
                            this.httpAction.unauthorizedError(ConstMessagesJson.INVALID_API_KEY);
                        }

                    } catch (error) {
                        // If there is an error while comparing the API keys, throw an unauthorized error
                        this.httpAction.unauthorizedError(ConstMessagesJson.INVALID_API_KEY);
                    }
                }
            }
        } catch (error: any) {
            // If there is an error during the validation process, throw a general error
            this.httpAction.generalError(error, "validateRequireSecretApiKey", "Validations");
        }

        return varReturn; // Return the result of the validation
    }
    

    /**
     * This function validates the ID from the query string.
     * It checks if the ID is present in the query string and if it can be parsed as a number.
     * If the ID is valid, it returns the parsed number.
     * Otherwise, it returns null.
     *
     * @return {number | null} The parsed number if the ID is valid, otherwise null.
     */
    public validateIdFromQuery() : number | string | null {
        try {
            // Initialize the ID variable to null
            let id: number | string | null = null;

            // Check if the ID is present in the query string
            if (this.req.query[ConstGeneral.ID] != undefined) {
                // Try to parse the ID from the query string as a number

                if (!isNaN(Number(this.req.query[ConstGeneral.ID]))) {
                    id = parseInt(this.req.query[ConstGeneral.ID] as string, 10);
                } else {
                    id = this.req.query[ConstGeneral.ID] as string;
                }
            }

            // Return the parsed ID or null if it is not valid
            return id;

        } catch (error: any) {
            // Return null if there is an error parsing the ID
            return null;
        } 
    }
   

    /**
     * Validates the code from the query string.
     * Checks if the code is present in the query string and returns it.
     * If the code is not present or cannot be parsed, it returns null.
     *
     * @return {string | null} The code if it is valid, otherwise null.
     */
    public validateCodeFromQuery() : string | null {
        try {
            // Initialize the code variable to null
            let code: string | null = null;

            // Check if the code is present in the query string
            if (this.req.query[ConstGeneral.CODE] != undefined) {
                // Parse the code from the query string
                code = this.req.query[ConstGeneral.CODE] as string;
            }

            // Return the code if it is valid, otherwise null
            return code;

        } catch (error: any) {
            // Return null if there is an error parsing the code
            return null;
        } 
    }
}