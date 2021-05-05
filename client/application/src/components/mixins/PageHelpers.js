import Loading from '../elements/Loading.vue';
import PageError from '../elements/PageError.vue';

export default {
    components: { Loading, PageError },
    data: function() { return {
        displayError: false,
        displayLoading: true,
        displayPage: false,
        errorMessage: '',
    }; },
    methods: {
        transitionFromLoadingToError: function(errorMessage) {
            this.errorMessage = errorMessage;
            this.displayLoading = false;
            this.displayError = true;
        },
        transitionFromLoadingToPage: function() {
            this.displayLoading = false;
            this.displayPage = true;
        },
        popError: function(errorMessage, errorTitle = 'Retrieval Error') {
            this.$bvToast.toast(errorMessage, {
                title: errorTitle,
                variant: 'danger',
                solid: true,
            });
        },
        popInfo: function(infoMessage, infoTitle = 'Success') {
            this.$bvToast.toast(infoMessage, {
                title: infoTitle,
                variant: 'info',
                solid: true,
            });
        },
    },
};