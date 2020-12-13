import bodyParser from 'body-parser';
import express from 'express';
import {logger, expressLogger} from './logger';

import {measurementsRoutes} from './Http/Controllers/measurementController';
import {metricTypesRoutes} from './Http/Controllers/metricTypeController';
import {metricUnitsRoutes} from './Http/Controllers/metricUnitController';

const expressServerInstance = express();
const port = process.env.APP_PORT || 5000;

// Server Settings
expressServerInstance.disable('x-powered-by');

// Server Middleware
expressServerInstance.use(expressLogger);
expressServerInstance.use(bodyParser.json());
expressServerInstance.use(bodyParser.urlencoded({ extended: true }));

// Root-Level Requests
expressServerInstance.get('/', (request: express.Request, response: express.Response): express.Response => response.type('json').send({ status: 'alive' }));

// Measurements Resource Requests
expressServerInstance.use('/measurements', measurementsRoutes);

// Metric Types Resource Requests
expressServerInstance.use('/metricTypes', metricTypesRoutes);

// Metric Units Resource Requests
expressServerInstance.use('/metricUnits', metricUnitsRoutes);

// Start the Server
expressServerInstance.listen(port, () => logger.info(`Fitness Tracker API Server started on port: ${port}`));