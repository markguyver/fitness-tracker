import {Request, Response, Router} from 'express';

import {sequelizeInstance} from '../../database';
import {
    respondWithResource404,
    respondWithResourceList,
    fetchAllAndRespond
} from '../helpers';

// Initialize Database Models
const MetricUnit = sequelizeInstance.models.MetricUnit;

// Define Endpoint Handlers
const respondWithMetricUnitNotFound = respondWithResource404('Metric Unit');
const respondWithMetricUnitsPayload = respondWithResourceList('MetricUnits');
const getAllMetricUnits = fetchAllAndRespond(MetricUnit, respondWithMetricUnitsPayload, {
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
});

// Register Resource Routes
export const metricUnitsRoutes = Router();
metricUnitsRoutes.get('/', getAllMetricUnits);