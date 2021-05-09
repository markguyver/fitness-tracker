import { Router } from 'express';
import { sequelizeInstance } from '../../database';
import {
    provideFindOptionsUnmodified,
    respondWithResourceNotFound,
    respondWithResourceList,
    findAllAndRespond
} from '../helpers';

// Initialize Database Models
const MetricUnit = sequelizeInstance.models.MetricUnit;

// Define Endpoint Handlers
const respondWithMetricUnitNotFound = respondWithResourceNotFound('Metric Unit');
const respondWithMetricUnitsPayload = respondWithResourceList('MetricUnits');
const getAllMetricUnits = findAllAndRespond(MetricUnit, respondWithMetricUnitsPayload, provideFindOptionsUnmodified({
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
}));

// Register Resource Routes
export const metricUnitsRoutes = Router();
metricUnitsRoutes.get('/', getAllMetricUnits);