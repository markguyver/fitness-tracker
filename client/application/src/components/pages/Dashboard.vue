<template><b-container id="dashboard">
    <b-row id="loading" v-if="displayLoading || displayError"><b-col>
        <Loading v-if="displayLoading" />
        <PageError v-if="displayError" v-bind:errorMessage="errorMessage" />
    </b-col></b-row>
    <MeasurementList v-if="displayPage" :displayableMeasurementsMap="measurementsMap" />
</b-container></template>

<script>
import pageHelpers from '../mixins/PageHelpers';
import measurementHelpers from '../mixins/MeasurementHelpers';
import MeasurementList from '../elements/MeasurementList';

export default {
    name: 'Dashboard',
    components: { MeasurementList },
    data: function() {return {
        measurementsMap: null,
    };},
	mixins: [measurementHelpers, pageHelpers],
    mounted: function() {
        this.getDisplayableMeasurementsMap().then(displayableMap => {
            this.measurementsMap = displayableMap;
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