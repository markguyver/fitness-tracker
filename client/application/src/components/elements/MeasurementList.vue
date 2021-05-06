<template><b-container id="measurement-list">

    <!-- Start: Measurement List Count Header -->
    <b-row v-if="showListCountHeader" id="measurement-list-count-header"><b-col>
        <div class="h6 ml-1 text-dark">Displaying {{ displayableMeasurementsMap.size }} measurement{{ (displayableMeasurementsMap.size == 1 ? '' : 's') }}</div>
    </b-col></b-row>
    <!-- End: Measurement List Count Header -->

    <!-- Start: Measurement List -->
    <b-card no-body class="measurement-list-item mt-3" v-for="[currentDate, measurements] in displayableMeasurementsMap" v-bind:key="currentDate" :header="currentDate">
        <b-card-body class="p-0"><b-list-group horizontal v-for="(metricTypeMeasurements, metricType) in measurements" v-bind:key="currentDate + metricType">
            <b-list-group-item class="w-25 measurement-list-item-col">{{ metricType }}</b-list-group-item>
            <b-list-group-item class="w-75 measurement-list-item-col">
                <ul class="p-0 m-0 measurement-list-item-col-list">
                    <li v-for="metricTypeMeasurement in metricTypeMeasurements" v-bind:key="currentDate + metricType + metricTypeMeasurement">{{ metricTypeMeasurement }}</li>
                </ul>
            </b-list-group-item>
        </b-list-group></b-card-body>
    </b-card>
    <!-- End: Measurement List -->

</b-container></template>

<script>
export default {
    name: 'MeasurementList',
    props: {
        displayableMeasurementsMap: {
            required: true,
            type: Map,
        },
        showListCountHeader: {
            required: false,
            type: Boolean,
            default: true,
        },
    },
}
</script>

<style>
#measurement-list-count-header {
    margin-top: 1em;
}
#measurement-list .measurement-list-item .measurement-list-item-col {
    font-size: 0.8em;
    border: 0;
}
#measurement-list .measurement-list-item .measurement-list-item-col .measurement-list-item-col-list {
    list-style-type: none;
}
</style>