import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
configManager.getConfig();

import { RequestHandler } from '@TenshiJS/generics/index';
import HttpAction from '@TenshiJS/helpers/HttpAction';
import GenericService from '@TenshiJS/generics/Services/GenericService';
import RequestHandlerBuilder from '@TenshiJS/generics/RequestHandler/RequestHandlerBuilder';
import { Request, Response } from 'express';
import Validations from '@TenshiJS/helpers/Validations';
import JWTObject from '@TenshiJS/objects/JWTObject';
import { ConstFunctions } from '@TenshiJS/consts/Const';

describe('GenericService', () => {
    let service: GenericService;
    let req: Request;
    let res: Response;
    let validation: Validations;
    let httpExec: HttpAction;

    const jwt = '1234567890';
    const controllerName = 'TestController';
    const methodName = 'UnitTestMethod';
    const roleValidate = 'TEST';

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

        httpExec = new HttpAction(res);
        validation = new Validations(req, httpExec);
        const jwtData: JWTObject | null = await validation.validateRequireJWT();

        res.locals.httpExec = httpExec;
        res.locals.validation = validation;
        res.locals.jwtData = jwtData;

        service = new GenericService();
        service.setControllerName(controllerName);
    });



    describe('validateAll', () => {
        it('should validate all necessary conditions successfully', async () => {

            req.body = { 'exampleField': 'exampleValue' };
            req.params = {};
            req.query = {};

            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const jwtData: JWTObject | null = res.locals.jwtData;

            const isValid = await service.validateAll(requestHandler, httpExec, jwtData, ConstFunctions.GET_ALL);

            expect(isValid).toBe("OK");
        });

        it('should fail validation if filters are not provided', async () => {
            req.query = {}; // Ensure no filters are provided
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const jwtData: JWTObject | null = res.locals.jwtData;

            const isValid = await service.validateAll(requestHandler, httpExec, jwtData, ConstFunctions.GET_BY_ID);

            expect(isValid).toBe(false);
        });

        it('should fail validation if code is invalid', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const jwtData: JWTObject | null = res.locals.jwtData;

            const isValid = await service.validateAll(requestHandler, httpExec, jwtData, ConstFunctions.CREATE);

            expect(isValid).toBe(false);
        });

        it('should fail validation if id is invalid', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const jwtData: JWTObject | null = res.locals.jwtData;

            const isValid = await service.validateAll(requestHandler, httpExec, jwtData, ConstFunctions.GET_BY_ID);

            expect(isValid).toBe(false);
        });

        it('should fail validation if role is invalid', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole('INVALID_ROLE')
                    .build();

            const jwtData: JWTObject | null = res.locals.jwtData;

            const isValid = await service.validateAll(requestHandler, httpExec, jwtData, ConstFunctions.GET_BY_ID);

            expect(isValid).toBe(false);
        });
    });

    describe('insertService', () => {
        it('should insert a new entity successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeInsertFunction = jest.fn();

            await service.insertService(requestHandler, executeInsertFunction);

            expect(executeInsertFunction).toHaveBeenCalled();
        });
    });

    describe('updateService', () => {
        it('should update an existing entity successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeUpdateFunction = jest.fn();

            await service.updateService(requestHandler, executeUpdateFunction);

            expect(executeUpdateFunction).toHaveBeenCalled();
        });
    });

    describe('deleteService', () => {
        it('should delete an entity successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeDeleteFunction = jest.fn();

            await service.deleteService(requestHandler, executeDeleteFunction);

            expect(executeDeleteFunction).toHaveBeenCalled();
        });
    });

    describe('getByIdService', () => {
        it('should get an entity by ID successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeGetByIdFunction = jest.fn();

            await service.getByIdService(requestHandler, executeGetByIdFunction);

            expect(executeGetByIdFunction).toHaveBeenCalled();
        });
    });

    describe('getByCodeService', () => {
        it('should get an entity by code successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeGetByCodeFunction = jest.fn();

            await service.getByCodeService(requestHandler, executeGetByCodeFunction);

            expect(executeGetByCodeFunction).toHaveBeenCalled();
        });
    });

    describe('getAllService', () => {
        it('should get all entities successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeGetAllFunction = jest.fn();

            await service.getAllService(requestHandler, executeGetAllFunction);

            expect(executeGetAllFunction).toHaveBeenCalled();
        });
    });

    describe('getByFiltersService', () => {
        it('should get entities by filters successfully', async () => {
            const requestHandler: RequestHandler =
                new RequestHandlerBuilder(res, req)
                    .setMethod(methodName)
                    .isValidateRole(roleValidate)
                    .build();

            const executeGetByFiltersFunction = jest.fn();

            await service.getByFiltersService(requestHandler, executeGetByFiltersFunction);

            expect(executeGetByFiltersFunction).toHaveBeenCalled();
        });
    });
});