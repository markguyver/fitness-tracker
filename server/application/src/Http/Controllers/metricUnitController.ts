import {Request, Response, Router} from 'express';
import {sequelizeInstance} from '../../database';
import {fetchAllMetricUnitsAndRespond} from '../helpers';

// Initialize Database Models
const MetricUnit = sequelizeInstance.models.MetricUnit;

// Define Endpoint Handlers
const getAllMetricUnits = (request: Request, response: Response): Response => fetchAllMetricUnitsAndRespond({
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
}, response);

// Register Resource Routes
export const metricUnitsRoutes = Router();
metricUnitsRoutes.get('/', getAllMetricUnits);