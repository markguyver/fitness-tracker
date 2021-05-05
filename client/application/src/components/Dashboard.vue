<template><div id="dashboard">
    <b-row>
        <b-col cols="11">

            <!--
            <div class="h6 ml-1 text-dark">Displaying {{ measurements.length }} measurement{{ (measurements.length == 1 ? '' : 's') }}</div>
            <b-card-group>
                <b-card v-for="[currentDate, measurements] in measurementTest" v-bind:key="currentDate" v-bind:header="currentDate">
                    <b-card-body><pre>{{ measurements }}</pre></b-card-body>
                    <b-list-group>
                        <pre>{{ measurements }}</pre>
                        <b-list-item v-for="currentMeasurement in measurements" v-bind:key="currentDate + currentMeasurement.toString()">
                            <pre>{{ currentMeasurement }}</pre>
                        </b-list-item>
                    </b-list-group>
                </b-card>
            </b-card-group>
            -->

        </b-col>
    </b-row>
</div></template>

<script>
import axios from 'axios';
export default {
    name: 'Dashboard',
    data: function() {return {
        measurements: null,
        measurementTest: null,
    };},
    methods: {
        formatMeasurementTime: function(measurementTime) {
            const measurementDateTime = new Date(measurementTime);
            return measurementDateTime.toDateString();
        },
        prepareMeasurementData: function(measurementData) {
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
        exportMapConstructorFormat: function(objectToExport) {
            return Object.keys(objectToExport).map(item => [item, objectToExport[item]]);
        },
    },
    mounted: function() {
        axios.get('/measurements').then(response => {
            this.measurements = this.prepareMeasurementData(response.data.Measurements);

            console.log('Measurements Payload from Server:', response); // TODO: Delete This
            console.log('Measurements:', this.measurements); // TODO: Delete This

            this.measurementTest = new Map(this.exportMapConstructorFormat(this.measurements)); // TODO: Delete This
            console.log('Measurement Test:', this.measurementTest); // TODO: Delete This
        }).catch(console.error);
    },
}
</script>

<style>
</style>