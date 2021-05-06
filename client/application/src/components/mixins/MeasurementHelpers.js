import axios from 'axios';

export default {
    methods: {
        getDisplayableMeasurementsMap: function() {
            return axios.get('/measurements').then(response => {
                return new Map(this.convertObjectToMapConstructorFormat(
                    this.prepareMeasurementDataForDisplay(response.data.Measurements)
                ));
            });
        },
        formatMeasurementTime: function(measurementTime) {
            const measurementDateTime = new Date(measurementTime);
            return measurementDateTime.toDateString();
        },
        prepareMeasurementDataForDisplay: function(measurementData) {
            const groupedMeasurementData = {};
            measurementData.map(item => ({
                id: item.id,
                measurement: item.measurement,
                time: this.formatMeasurementTime(item.time.slice(0, -1)), // Stripping Z from end of date time
                type: item.MetricType.name,
                unit: item.MetricUnit.name,
            })).forEach(item => {
                if (!groupedMeasurementData[item.time]) { // Verify Time Entry Exists
                    groupedMeasurementData[item.time] = {};
                } // End of Verify Time Entry Exists
                if (!groupedMeasurementData[item.time][item.type]) { // Verify Type Exists in Time Entry
                    groupedMeasurementData[item.time][item.type] = [];
                } // End of Verify Type Exists in Time Entry
                groupedMeasurementData[item.time][item.type].push(item.measurement + ' ' + item.unit);
            });
            return groupedMeasurementData;
        },
        convertObjectToMapConstructorFormat: function(objectToConvert) {
            return Object.keys(objectToConvert).map(item => [item, objectToConvert[item]]);
        },
    },
};