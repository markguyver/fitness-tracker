import {Request, Response, Router} from 'express';

import {sequelizeInstance} from '../../database';
import {
    respondWithResource404,
    respondWithResourceList,
    fetchAllAndRespond
} from '../helpers';

// Initialize Database Models
const MetricType = sequelizeInstance.models.MetricType;

// Define Endpoint Handlers
const respondWithMetricTypeNotFound = respondWithResource404('Metric Type');
const respondWithMetricTypesPayload = respondWithResourceList('MetricTypes');
const getAllMetricTypes = fetchAllAndRespond(MetricType, respondWithMetricTypesPayload, {
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
});

// Register Resource Routes
export const metricTypesRoutes = Router();
metricTypesRoutes.get('/', getAllMetricTypes);