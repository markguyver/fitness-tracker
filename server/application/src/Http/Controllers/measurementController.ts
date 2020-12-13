import {Request, Response, Router} from 'express';
import {sequelizeInstance} from '../../database';
import {fetchAllMeasurementsAndRespond} from '../helpers';

// Initialize Database Models
const Measurement = sequelizeInstance.models.Measurement;
const MetricType = sequelizeInstance.models.MetricType;
const MetricUnit = sequelizeInstance.models.MetricUnit;

// Define Endpoint Handlers
const getAllMeasurements = (request: Request, response: Response): Response => fetchAllMeasurementsAndRespond({
    attributes: ['id', 'measurement', 'time'],
    include: [{
        model: MetricType,
        require: true,
    },{
        model: MetricUnit,
        require: true,
    }],
    order: [['time', 'DESC']],
}, response);

// Register Resource Routes
export const measurementsRoutes = Router();
measurementsRoutes.get('/', getAllMeasurements);