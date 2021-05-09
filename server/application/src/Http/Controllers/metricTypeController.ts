import { Router } from 'express';
import { sequelizeInstance } from '../../database';
import {
    provideFindOptionsUnmodified,
    respondWithResourceNotFound,
    respondWithResourceList,
    findAllAndRespond
} from '../helpers';

// Initialize Database Models
const MetricType = sequelizeInstance.models.MetricType;

// Define Endpoint Handlers
const respondWithMetricTypeNotFound = respondWithResourceNotFound('Metric Type');
const respondWithMetricTypesPayload = respondWithResourceList('MetricTypes');
const getAllMetricTypes = findAllAndRespond(MetricType, respondWithMetricTypesPayload, provideFindOptionsUnmodified({
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
}));

// Register Resource Routes
export const metricTypesRoutes = Router();
metricTypesRoutes.get('/', getAllMetricTypes);