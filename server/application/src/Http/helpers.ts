import {Response} from 'express';
import {Map} from 'immutable';
import {curry} from 'ramda';
import {Model, ModelCtor, FindOptions} from 'sequelize';
import {sequelizeInstance} from '../database';
import {logger} from '../logger';

// Initialize Database Models
const Measurement = sequelizeInstance.models.Measurement;
const MetricType = sequelizeInstance.models.MetricType;
const MetricUnit = sequelizeInstance.models.MetricUnit;

// Create Generic Error Response Handlers

export const respondWith400 = (response: Response): Response => response.status(400);
export const respondWith404 = (response: Response): Response => response.status(404);
export const respondWith500 = (response: Response): Response => response.status(500);

// Create Resource Not Found Handlers

const respondWithResource404 = curry((resourceName: string, response: Response) => respondWith404(response).send(resourceName + ' not found'));

export const respondWithMeasurementNotFound = respondWithResource404('Measurement');
export const respondWithMetricTypeNotFound = respondWithResource404('Metric Type');
export const respondWithMetricUnitNotFound = respondWithResource404('Metric Unit');

// Create List of Resource Handlers

export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => {
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON());
});

export const respondWithMeasurementsPayload = respondWithResourceList('Measurements');
export const respondWithMetricTypesPayload = respondWithResourceList('MetricTypes');
export const respondWithMetricUnitsPayload = respondWithResourceList('MetricUnits');

// Create Retrieve List of All Resource Handlers

const fetchAllAndRespond = curry((sequelizeModel: ModelCtor<Model<any, any>>, queryResultsHandler: Function, queryOptions: FindOptions, response: Response): Response => {
    sequelizeModel.findAll(queryOptions)
        .then(results => queryResultsHandler(response, results))
        .catch(error => respondWith500(response)); // TODO: Add Error Logging?
    return response;
});

export const fetchAllMeasurementsAndRespond = fetchAllAndRespond(Measurement, respondWithMeasurementsPayload);
export const fetchAllMetricTypesAndRespond = fetchAllAndRespond(MetricType, respondWithMetricTypesPayload);
export const fetchAllMetricUnitsAndRespond = fetchAllAndRespond(MetricUnit, respondWithMetricUnitsPayload);