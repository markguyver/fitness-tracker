import {Request, Response} from 'express';
import {Map} from 'immutable';
import {DateTime} from 'luxon';
import {curry} from 'ramda';
import {Model, ModelCtor, FindOptions} from 'sequelize';

import {logger} from '../logger';

// Create Generic Validation Functions
export const validateDate = (value: string): boolean => null != DateTime.fromISO(value).toISO();
export const validateFloat = (value: number | string): boolean => (Number.isNaN(Number.parseFloat(value.toString())) ? false : true);

// Create Generic Error Response Handlers
export const respondWith400 = (response: Response, responseBody: string = 'Bad request'): Response => response.status(400).send(responseBody);
export const respondWith404 = (response: Response, responseBody: string = 'Not found'): Response => response.status(404).send(responseBody);
export const respondWith500 = (response: Response, responseBody: string = 'An unexpected error has occurred'): Response => response.status(500).send(responseBody);

// Create Resource Handlers
export const respondWithResource404 = curry((resourceName: string, response: Response) => respondWith404(response).send(resourceName + ' not found'));
export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => {
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON());
});

// Create Resource Endpoint Handlers
export const fetchAllAndRespond = curry((sequelizeModel: ModelCtor<Model<any, any>>, queryResultsHandler: Function, queryOptions: FindOptions, request: Request, response: Response): Response => {
    sequelizeModel.findAll(queryOptions)
        .then(results => queryResultsHandler(response, results))
        .catch(error => {
            logger.error({
                request:        request,
                model:          sequelizeModel,
                queryOptions:   queryOptions,
                error:          error,
            }, 'Sequelize Fetch All and Respond Error');
            respondWith500(response);
        });
    return response;
});
