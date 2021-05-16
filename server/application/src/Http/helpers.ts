import { Request, Response } from 'express';
import { Map } from 'immutable';
import { DateTime } from 'luxon';
import { curry } from 'ramda';
import { Model, ModelCtor, FindOptions } from 'sequelize';
import {logger} from '../logger';

// Data Types
export interface queryOptionsProviderError {
    message: string;
    handler: (response: Response) => Response;
};
export interface validationResponse {
    boolean:    boolean;
    type:       string;
    message?:   string;
};

// Prepare General Helpers (like validation)
export const getQueryOptionsProviderError = (handler: (response:Response) => Response, message: string = '') => ({ message: message, handler: handler });
const isQueryOptionsProviderError = (errorToTest: any): errorToTest is queryOptionsProviderError => ('function' == typeof errorToTest.handler);
export const validateDate = (value: string): boolean => null != DateTime.fromISO(value).toISO();
export const validateFloat = (value: number | string): boolean => (Number.isNaN(Number.parseFloat(value.toString())) ? false : true);
export const validationResponseBaseFail = (message: string = ''): validationResponse => ({ boolean: false, type: 'failure', message: message });
export const validationResponseBaseSuccess = (): validationResponse => ({ boolean: true, type: 'success' });
export const looksLikeAnId = (idSuspect: number): validationResponse => (!isNaN(idSuspect) && idSuspect > 0) ? validationResponseBaseSuccess() : validationResponseBaseFail();
export const isNonEmptyString = (value: string | undefined): validationResponse => ('string' == typeof value && value.length > 0) ? validationResponseBaseSuccess() : validationResponseBaseFail();

// Prepare Data Handler Methods
export const extractIntParameterValueFromRequestData = curry((parameterName: string, request: Request): number => parseInt(request.body[parameterName]) || parseInt(request.params[parameterName]) || NaN);
export const extractStringParameterValueFromRequestData = curry((parameterName: string, request: Request): string => String(request.body[parameterName]).toString() || String(request.params[parameterName]).toString());
export const provideFindOptionsUnmodified = curry((findOptions: FindOptions, request: Request): FindOptions => findOptions);
export const provideFindOptionsModified = curry((findOptions: FindOptions, findOptionsModifier: (findOptions: FindOptions, request: Request) => FindOptions, request: Request): FindOptions => findOptionsModifier(findOptions, request));

// Prepare HTTP Response Error Helpers
const respondWithCode = (httpStatusCode: number, response: Response, responseBody: string): Response => response.status(httpStatusCode).send(responseBody);
export const respondWith400 = (response: Response, responseBody: string = 'Bad request'): Response => respondWithCode(400, response, responseBody);
export const respondWith404 = (response: Response, responseBody: string = 'Not found'): Response => respondWithCode(404, response, responseBody);
export const respondWith500 = (response: Response, responseBody: string = 'An unexpected error has occurred'): Response => respondWithCode(500, response, responseBody);

// Prepare HTTP Resource Response Helpers
export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => {
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON());
});
export const respondWithResourceNotFound = curry((resourceName: string, response: Response): Response => respondWith404(response, resourceName + ' not found'));
export const respondInvalidResourceId = curry((resourceName: string, response: Response): Response => respondWith400(response, 'Invalid ' + resourceName + ' ID'));

// Prepare HTTP Resource ORM Helpers
export const findAllAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    queryOptionsProvider:           (request: Request) => FindOptions,
    request:                        Request,
    response:                       Response
): Response => {
    try { // Call Query Options Provider Then Perform Query
        const queryOptionsFromProvider = queryOptionsProvider(request);
        sequelizeModel.findAll(queryOptionsFromProvider)
            // TODO: Use Not Found handler
            .then(results => queryResultsHandler(response, results))
            .catch(error => {
                // TODO: Improve Logging -- Some Objects Don't Translate into "Logs" Well
                logger.error({ application: {
                    sequelizeModel:         sequelizeModel,
                    queryOptions:           queryOptionsFromProvider,
                    request:                request,
                    error:                  error,
                } }, 'findAllAndRespond() Query Failure');
                respondWith500(response);
            });
    } catch (error) { // Middle of Call Query Options Provider Then Perform Query
        if (isQueryOptionsProviderError(error)) { // Check Query Options Provider Error to Handle
            error.handler(response);
        } else { // Middle of Check Query Options Provider Error to Handle
            logger.error({ application: {
                sequelizeModel:             sequelizeModel,
                queryOptions:               queryOptionsProvider(request),
                request:                    request,
                error:                      error,
            } }, 'findAllAndRespond() Query Options Provider Failure');
            respondWith500(response);
        } // End of Check Query Options Provider Error to Handle
    } // End of Call Query Options Provider Then Perform Query
    return response;
});
export const createAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    validationFailureHandler:       Function,
    insertFailureHandler:           Function,
    insertSuccessHandler:           Function,
    validateExtractedValues:        (extractedObject: object) => validationResponse,
    extractValuesFromRequest:       (request: Request) => object,
    request:                        Request,
    response:                       Response
): Response => {
    const newRecord = extractValuesFromRequest(request);
    const newRecordValidation = validateExtractedValues(newRecord);
    if (newRecordValidation.boolean) { // Validate Extracted Values
        sequelizeModel.create(newRecord)
            .then(result => insertSuccessHandler(response, result, 201))
            .catch(error => {
                logger.error({ application: {
                    sequelizeModel:         sequelizeModel,
                    newRecord:              newRecord,
                    newRecordValidation:    newRecordValidation,
                    request:                request,
                    error:                  error,
                } }, 'createAndRespond() Query Failure');
                insertFailureHandler(response, 'Failed to insert record');
            });
    } else { // Middle of Validate Extracted Values
        validationFailureHandler(response, newRecordValidation.message);
    } // End of Validate Extracted Values
    return response;
});