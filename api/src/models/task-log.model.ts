import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { TaskLogAttributes } from '../types/task.types.js';

export class TaskLogModel extends Model<TaskLogAttributes, Omit<TaskLogAttributes, 'id'>> implements TaskLogAttributes {
    public id!: number;
    public taskId!: number;
    public userId!: number;
    public action!: 'CREATE' | 'UPDATE' | 'DELETE';
    public changes?: string;

    public readonly createdAt!: Date;
}

TaskLogModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        taskId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        action: {
            type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
            allowNull: false,
        },
        changes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'task_logs',
        timestamps: true,
        updatedAt: false, // Só precisamos da data de criação do log
    }
);