import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

import { RequestHandler } from '@TenshiJS/generics/index';
import HttpAction from '@TenshiJS/helpers/HttpAction';
import {FindManyOptions } from "typeorm";
import GenericValidation from '@TenshiJS/generics/Validation/GenericValidation';
import RequestHandlerBuilder from '@TenshiJS/generics/RequestHandler/RequestHandlerBuilder';
import { Request, Response } from 'express';
import Validations from '@TenshiJS/helpers/Validations';
import JWTObject from '@TenshiJS/objects/JWTObject';
import { ConstFunctions, ConstGeneral } from '@TenshiJS/consts/Const';
import { ConstRegex } from '@index/consts/Const';

describe('GenericValidation', () => {
    let genericValidation: GenericValidation;
    let req: Request;
    let res: Response;
    let validation: Validations;
    let httpExec: HttpAction;
    let jwtData: JWTObject | null = null;

    const jwt = config.TEST.JWT_TEST;
    const roleValidate = config.TEST.ROLE_TEST;

    beforeEach(async () => {
        req = {
            headers: {
                'authorization': jwt
            }
        } as Request;

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            locals: {},
        } as unknown as Response;

        genericValidation = new GenericValidation();
        httpExec = new HttpAction(res);
        res.locals.httpExec = httpExec;

    });


    const validateJWT = async () => {
        validation = new Validations(req, httpExec);
        jwtData = await validation.validateRequireJWT();
        
        if (!jwtData) {
            throw new Error('JWT validation failed');
        }
    };


    describe('Validate All About Request Handler Builder Validations', () => {

        beforeEach(async () => {
            await validateJWT();
        });





        //************************************************ */
        // Validate JWT
        //************************************************ */
        it('Should SUCCESS Validate JWT', async () => {
            jwtData = await validation.validateRequireJWT();
            expect(jwtData).toEqual(expect.objectContaining({
                id: expect.any(String),
                email: expect.any(String),
                role: expect.any(String),
                exp: expect.any(Number),
                iat: expect.any(Number),
            }));
        });

        it('Should FAIL Validate JWT', async () => {
            req = {
                headers: {
                    'authorization': "INVALID JWT"
                }
            } as Request;
            const validation = new Validations(req, httpExec);
            jwtData = await validation.validateRequireJWT();
            expect(jwtData).toEqual(null);

            req = {
                headers: {}
            } as Request;
            const validation2 = new Validations(req, httpExec);
            jwtData = await validation2.validateRequireJWT();
            expect(jwtData).toEqual(null);
        });





         //************************************************ */
        // Validate ROLE
        //************************************************ */
        it('Should SUCCESS Validate Role', async () => {

            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .isValidateRole(roleValidate)
                    .build();

                    console.log(jwtData!.role);

            const isValid = await genericValidation.validateRole(requestHandler, jwtData!.role, ConstFunctions.GET_ALL, httpExec);
            expect(isValid).toBe(true);
        });

        it('Should FAIL Validate Role', async () => {
             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .isValidateRole("INVALID ROLE")
                     .build();
 
             const isValid = await genericValidation.validateRole(requestHandler, jwtData!.role, ConstFunctions.GET_ALL, httpExec);
             expect(isValid).toBe(undefined);

             const requestHandler2: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .isValidateRole(roleValidate)
                     .build();
 
             const isValid2 = await genericValidation.validateRole(requestHandler2, "INVALID ROLE", ConstFunctions.GET_ALL, httpExec);
             expect(isValid2).toBe(undefined);
         });


         


        //************************************************ */
        // Validate Required Fields
        //************************************************ */
         it('Should SUCCESS Validate Required Fields', async () => {

            req.body = { 'code': 'code' };

            const requiredBodyListTest: Array<string> = [
                req.body.code
            ];

             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRequiredFiles(requiredBodyListTest)
                     .build();
 
             const isValid = await genericValidation.validateRequiredFields(requestHandler, validation);
             expect(isValid).toBe(true);
             
         });


         it('Should FAIL Validate Required Fields', async () => {
            req.body = { };

            const requiredBodyListTest: Array<string> = [
                req.body.code
            ];

             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRequiredFiles(requiredBodyListTest)
                     .build();
 
             const isValid = await genericValidation.validateRequiredFields(requestHandler, validation);
             expect(isValid).toBe(false);
             
         });





        //************************************************ */
        // Validate Have Filters
        //************************************************ */
         it('Should SUCCESS Validate Have Filters', async () => {

            const options: FindManyOptions = {};
            options.where = { ...options.where, testFilter: "TEstFilter" };
            
             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setFilters(options)
                     .build();
 
             const isValid = await genericValidation.validateHaveFilters(requestHandler, httpExec);
             expect(isValid).toBe(true);
             
         });

         it('Should FAIL Validate Have Filters', async () => {

             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .build();
 
             const isValid = await genericValidation.validateHaveFilters(requestHandler, httpExec);
             expect(isValid).toBe(undefined);
             
         });


        //************************************************ */
        // Validate Regex
        //************************************************ */
        it('Should SUCCESS Validate Regex Email', async () => {

            const regexValidatorList: [string, string][] = [
                [ConstRegex.EMAIL_REGEX, 'test@gmail.com']
            ];
            
             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRegexValidation(regexValidatorList)
                     .build();
 
             const isValid = await genericValidation.validateRegex(requestHandler, validation);
             expect(isValid).toBe(true);
             
         });

         it('Should FAIL Validate Regex Email', async () => {
            req.body = { 'email': 'Invalid Email' };
            const regexValidatorList: [string, string][] = [
                [ConstRegex.EMAIL_REGEX, req.body.email as string]
            ];

             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRegexValidation(regexValidatorList)
                     .build();
 
            const isValid = await genericValidation.validateRegex(requestHandler, validation);
             expect(isValid).toBe(false);
         });

         it('Should SUCCESS Validate Regex Password', async () => {

            req.body = { 'password': 'Tenshitest1*' };
            const regexValidatorList: [string, string][] = [
                [ConstRegex.PASSWORD_REQUIRED_REGEX, req.body.password as string]
            ];
            
             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRegexValidation(regexValidatorList)
                     .build();
 
            const isValid = await genericValidation.validateRegex(requestHandler, validation);
             expect(isValid).toBe(true);
             
         });

         it('Should FAIL Validate Regex Password', async () => {
            const regexValidatorList: [string, string][] = [
                [ConstRegex.PASSWORD_REQUIRED_REGEX, "Invalid Password"]
            ];

             const requestHandler: RequestHandler =
                 new RequestHandlerBuilder(res, req)
                     .setRegexValidation(regexValidatorList)
                     .build();
 
            const isValid = await genericValidation.validateRegex(requestHandler, validation);
            expect(isValid).toBe(false);
         });


        it('Should SUCCESS body.userId exists', () => {
            const body = {}; // Create an empty object without 'userId'
            const id : number = 123;  // Example ID to be set

            // Call the method to be tested
            const result = genericValidation.setUserId(body, id);
          
            // Ensure that 'userId' now exists in the object
            expect(result.hasOwnProperty(ConstGeneral.USER_ID)).toBe(true);

            // Check that 'userId' was correctly set in the object
            expect(result.user_id).toBe(id);
          });

          it('Should FAIL body.userId exists', () => {
            const body = {"user_id":777}; // Create an empty object without 'userId'
            
            // Call the method to be tested
            const result = genericValidation.setUserId(body, 1);
          
            // Ensure that 'userId' now exists in the object
            expect(result.hasOwnProperty(ConstGeneral.USER_ID)).toBe(true);

            // Check that 'userId' was correctly set in the object
            expect(result.user_id).toBe(777);
          });
          

          it('Should SUCCESS Id From Query', () => {
            req.query = {};
            req.query[ConstGeneral.ID] = '777';
            const result = genericValidation.getIdFromQuery(validation, httpExec);
            expect(result).toBe(777);


            req.query = {};
            const result2 = genericValidation.getIdFromQuery(validation, httpExec);
            expect(result2).toBe(null);
          });


          it('Should SUCCESS Code From Query', () => {
            req.query = {};
            req.query[ConstGeneral.CODE] = '777';
            const result = genericValidation.getCodeFromQuery(validation, httpExec);
            expect(result).toBe('777');


            req.query = {};
            const result2 = genericValidation.getCodeFromQuery(validation, httpExec);
            expect(result2).toBe(null);
          });
    });
});