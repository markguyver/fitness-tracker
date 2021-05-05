'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // Metric Types Table
        await queryInterface.createTable('metric_types', {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            note: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
        });
        await queryInterface.addIndex('metric_types', {
            name: 'metric_type_name_unique',
            unique: true,
            fields: [{
                name: 'name',
                order: 'ASC',
            }],
        });

        // Metric Unites Tables
        await queryInterface.createTable('metric_units', {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        });
        await queryInterface.addIndex('metric_units', {
            name: 'metric_unit_name_unique',
            unique: true,
            fields: [{
                name: 'name',
                order: 'ASC',
            }],
        });

        // Measurements Tables
        await queryInterface.createTable('measurements', {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
            },
            metric_type_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'metric_types',
                    key: 'id',
                },
            },
            metric_unit_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'metric_units',
                    key: 'id',
                },
            },
            measurement: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
        await queryInterface.addIndex('measurements', {
            name: 'measurement_unique',
            unique: true,
            fields: [{
                name: 'time',
                order: 'ASC',
            },{
                name: 'metric_type_id',
                order: 'ASC',
            },{
                name: 'metric_unit_id',
                order: 'ASC',
            }],
        });
        await queryInterface.addIndex('measurements', {
            name: 'measurement_types',
            unique: false,
            fields: [{
                name: 'metric_type_id',
                order: 'ASC',
            },{
                name: 'time',
                order: 'ASC',
            },{
                name: 'metric_unit_id',
                order: 'ASC',
            }],
        });

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('measurements');
        await queryInterface.dropTable('metric_units');
        await queryInterface.dropTable('metric_types');
    }
};