'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('metric_types', [{
            id: 1,
            name: 'Elliptical',
        },{
            id: 2,
            name: 'Core Exercises (Level One: Getting Started Now, Pg 44)',
        },{
            id: 3,
            name: 'Weigh In',
        }]);
        await queryInterface.bulkInsert('metric_units', [{
            id: 1,
            name: 'Minutes',
        },{
            id: 2,
            name: 'Miles',
        },{
            id: 3,
            name: 'Repetitions',
        },{
            id: 4,
            name: 'Pounds',
        }]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('metric_types', null, {});
        await queryInterface.bulkDelete('metric_units', null, {});
    },
};