<template><b-container id="dashboard">
    <b-row id="loading" v-if="displayLoading || displayError">
        <b-col>
            <Loading v-if="displayLoading" />
            <PageError v-if="displayError" v-bind:errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-row v-if="displayPage">
        <b-col>
            <div class="h6 ml-1 text-dark">Displaying {{ measurementsMap.size }} measurement{{ (measurementsMap.size == 1 ? '' : 's') }}</div>
        </b-col>
    </b-row>
    <b-row v-if="displayPage">
        <b-col>

            <!-- TODO: Add B-Card Wrapper with Date as Header and Body as List Group -->

            <b-list-group>

                <b-list-group-item v-for="[currentDate, measurements] in measurementsMap" v-bind:key="currentDate">
                    <h4>{{ currentDate }}</h4>
                    <ul>
                        <li v-for="(metricTypeMeasurements, metricType) in measurements" v-bind:key="currentDate + metricType">
                            <b>{{ metricType }}:</b>
                            <ul><li v-for="metricTypeMeasurement in metricTypeMeasurements" v-bind:key="currentDate + metricType + metricTypeMeasurement">{{ metricTypeMeasurement }}</li></ul>
                        </li>
                    </ul>
                </b-list-group-item>

            </b-list-group>
        </b-col>
    </b-row>
</b-container></template>

<script>
import axios from 'axios';
import pageHelpers from '../mixins/PageHelpers';

export default {
    name: 'Dashboard',
    data: function() {return {
        measurementsMap: null,
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
	mixins: [pageHelpers],
    mounted: function() {
        axios.get('/measurements')
            .then(response => {
                this.measurementsMap = new Map(this.exportMapConstructorFormat(
                    this.prepareMeasurementData(response.data.Measurements)
                ));
                this.transitionFromLoadingToPage();
            }).catch(error => {
                this.transitionFromLoadingToError('Unable to load dashboard data.');
                console.error('Dashboard Error:', error);
            });
    },
}
</script>

<style>
div#dashboard div#loading {
    margin-top: 1em;
}
</style>