'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('metric_types', [{
            id: 1,
            name: 'Elliptical',
        },{
            id: 2,
            name: 'Core Exercises (Level 1)',
            note: 'The Complete Book of Core Training [Level One: Getting Started Now (Pg 44)]',
        },{
            id: 3,
            name: 'Weigh In',
        },{
            id: 4,
            name: 'Core Exercises (Level 2)',
            note: 'The Complete Book of Core Training [Level Two: Creating Strengh and Endurance (Pg 46)]',
        },{
            id: 5,
            name: 'Core Exercises (Level 3)',
            note: 'The Complete Book of Core Training [Level Three: Core Power (Pg 48)]',
        },{
            id: 6,
            name: 'Squats',
        },{
            id: 7,
            name: 'Dead Lift',
        },{
            id: 8,
            name: 'Military Press',
        },{
            id: 9,
            name: 'Bench Press',
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
        },{
            id: 5,
            name: 'Percent Body Fat',
        },{
            id: 6,
            name: 'Percent Water Weight',
        },{
            id: 7,
            name: 'Sets',
        }]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('metric_types', null, {});
        await queryInterface.bulkDelete('metric_units', null, {});
    },
};