import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.model.js';
import { TaskAttributes, TaskCreationAttributes } from '../types/task.types.js';

export class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public completed!: boolean;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TaskModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
    }
);

// Configuração do Relacionamento (Associação)
UserModel.hasMany(TaskModel, {
    foreignKey: 'userId',
    as: 'tasks'
});

TaskModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});