import {Request, Response, Router} from 'express';
import {sequelizeInstance} from '../../database';
import {fetchAllMetricTypesAndRespond} from '../helpers';

// Initialize Database Models
const MetricType = sequelizeInstance.models.MetricType;

// Define Endpoint Handlers
const getAllMetricTypes = (request: Request, response: Response): Response => fetchAllMetricTypesAndRespond({
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
}, response);

// Register Resource Routes
export const metricTypesRoutes = Router();
metricTypesRoutes.get('/', getAllMetricTypes);