import {Sequelize, Model, DataTypes} from 'sequelize';
import {logger} from './logger';

// Prepare Sequelize Database Connection

const databaseHost      = process.env.DB_HOSTNAME || '';
const databasePort      = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const databaseUsername  = process.env.DB_USERNAME || 'root';
const databasePassword  = process.env.DB_PASSWORD || '';
const databaseSchema    = process.env.DB_SCHEMA || 'fitness';

export const sequelizeInstance = new Sequelize(databaseSchema, databaseUsername, databasePassword, {
    dialect: "mysql",
    host: databaseHost,
    port: databasePort,
    logging: message => logger.debug({source:"Sequelize"}, message),
});

// Create Base Model for All Tables
class FitnessModel extends Model {
}

// Create Individual Models for All Tables

class MetricType extends FitnessModel {
    public id!: number;
    public name!: string;
}
MetricType.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'metric_types',
    modelName: 'MetricType',
    timestamps: false,
    paranoid: false,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: [{
                name: 'name',
                order: 'ASC',
            }],
        }
    ],
});

class MetricUnit extends FitnessModel {
    public id!: number;
    public name!: string;
}
MetricUnit.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'metric_units',
    modelName: 'MetricUnit',
    timestamps: false,
    paranoid: false,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: [{
                name: 'name',
                order: 'ASC',
            }],
        }
    ],
});

class Measurement extends FitnessModel {
    public id!: number;
    public metric_type_id!: number;
    public metric_unit_id!: number;
    public measurement!: number;
    // TODO: Add date and time columns?
}
Measurement.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    metric_type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    metric_unit_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    measurement: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'measurements',
    modelName: 'Measurement',
    timestamps: false,
    paranoid: false,
    underscored: true,
    indexes: [{
        unique: true,
        fields: [{
            name: 'date',
            order: 'ASC',
        },{
            name: 'metric_type_id',
            order: 'ASC',
        },{
            name: 'metric_unit_id',
            order: 'ASC',
        }],
    }],
});

// Define Relationships

MetricType.hasMany(Measurement);
Measurement.belongsTo(MetricType);

MetricUnit.hasMany(Measurement);
Measurement.belongsTo(MetricUnit);