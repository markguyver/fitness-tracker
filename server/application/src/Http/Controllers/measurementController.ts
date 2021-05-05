import {Request, Response, Router} from 'express';
import {DateTime} from 'luxon';
import {allPass, compose, has, merge, pickAll, prop} from 'ramda';

import {sequelizeInstance} from '../../database';
import {
    validateDate,
    validateFloat,
    respondWith400,
    respondWith500,
    respondWithResource404,
    respondWithResourceList,
    fetchAllAndRespond
} from '../helpers';
import {logger} from '../../logger';

// Define Data Types (Interfaces)
interface MeasurementInsertData {
    metric_type_id: number;
    metric_unit_id: number;
    measurement: number;
    time: string;
}

// Initialize Database Models
const Measurement = sequelizeInstance.models.Measurement;
const MetricType = sequelizeInstance.models.MetricType;
const MetricUnit = sequelizeInstance.models.MetricUnit;

// Define Helper Functions
const validatePassedMeasurementHasRequiredItems = allPass([
    has('metric_type_id'),  compose(Number.isInteger, prop('metric_type_id')),
    has('metric_unit_id'),  compose(Number.isInteger, prop('metric_unit_id')),
    has('measurement'),     compose(validateFloat, prop('measurement')),
    has('time'),            compose(validateDate, prop('time')),
]);
const extractMeasurementValues = pickAll(['metric_type_id', 'metric_unit_id', 'measurement', 'time']);
const prepareMeasurementValues = (item: MeasurementInsertData) => merge(item, {
    measurement:        parseFloat(item.measurement.toString()),
    metric_type_id:     parseInt(item.metric_type_id.toString()),
    metric_unit_id:     parseInt(item.metric_unit_id.toString()),
    time:               DateTime.fromISO(item.time).toSQL({includeOffset:false}),
});
const formatMeasurementValues = compose(prepareMeasurementValues, extractMeasurementValues);

// Define Endpoint Handlers
const respondWithMeasurementNotFound = respondWithResource404('Measurement');
const respondWithMeasurementsPayload = respondWithResourceList('Measurements');
const getAllMeasurements = fetchAllAndRespond(Measurement, respondWithMeasurementsPayload,{

    // TODO: Add Date (i.e. Month) as Retrieval Parameter

    attributes: ['id', 'measurement', 'time'],
    include: [{
        model: MetricType,
        require: true,
    },{
        model: MetricUnit,
        require: true,
    }],
    order: [['time', 'DESC']],
});
const insertMeasurements = (request: Request, response: Response): Response => {
    if (Array.isArray(request.body) && request.body.length > 0) { // Validate Passed Request Data
        const validatedRequestData = request.body.filter(validatePassedMeasurementHasRequiredItems).map(formatMeasurementValues);
        if (request.body.length == validatedRequestData.length) { // Verify All Passed Items Validated Successfully
            Measurement.create(validatedRequestData).then(insertResult => respondWithMeasurementsPayload(response, insertResult ? [insertResult] : [], 201))
            .catch(error => {
                logger.error({
                    request:                request,
                    validatedRequestData:   validatedRequestData,
                    error:                  error,
                }, 'Insert (Measurement) Resource Error');
                respondWith500(response);
            });
        } else { // Middle of Verify All Passed Items Validated Successfully
            respondWith400(response, 'Bad Request: Some posted data was invalid');
        } // End of Verify All Passed Items Validated Successfully
    } else { // Middle of Validate Passed Request Data
        respondWith400(response, 'Bad Request: Posted data is not an array or is empty');
    } // End of Validate Passed Request Data
    return response;
};

// Register Resource Routes
export const measurementsRoutes = Router();
measurementsRoutes.get('/', getAllMeasurements);
measurementsRoutes.post('/', insertMeasurements);