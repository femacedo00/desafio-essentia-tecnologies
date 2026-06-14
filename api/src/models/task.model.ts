import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.model.js';
import { TaskAttributes, TaskCreationAttributes } from '../types/task.types.js';
import { TaskHookOptions } from '../types/task-log.types.js';
import { TaskLog } from '../schemas/task-log.schema.js';

export class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    declare id: number;
    declare title: string;
    declare description: string;
    declare completed: boolean;
    declare userId: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;

    // Sobrescrever o toJSON nativo
    public toJSON(): any {
        // Pega os valores puros do banco
        const values: Record<string, any> = { ...this.get() };

        // Remove o que não deve ser retornado
        delete values.userId;

        // Converte os objetos Date para String ISO de forma limpa
        if (values.createdAt) values.createdAt = values.createdAt.toISOString();
        if (values.updatedAt) values.updatedAt = values.updatedAt.toISOString();
        if (values.deletedAt) values.deletedAt = values.deletedAt.toISOString();

        return values;
    }
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
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
        paranoid: true,
        hooks: {
            afterCreate: async (task, options) => {
                const actorId = (options as any).userId || (options as any).context?.userId || task.getDataValue('userId');

                // Chamada direta do Mongoose para salvar no MongoDB
                await TaskLog.create({
                    taskId: task.id,
                    userId: actorId,
                    action: 'CREATE',
                    changes: { title: task.title, description: task.description } // Objeto direto!
                });
            },

            afterUpdate: async (task, options) => {
                const actorId = (options as any).userId || (options as any).context?.userId || task.getDataValue('userId');

                const changedFields = task.changed();
                if (changedFields) {
                    const changesObj: Record<string, { old: any; new: any }> = {};

                    changedFields.forEach((field) => {
                        changesObj[field] = {
                            old: task.previous(field as any),
                            new: task.get(field as any),
                        };
                    });

                    await TaskLog.create({
                        taskId: task.id,
                        userId: actorId,
                        action: 'UPDATE',
                        changes: changesObj
                    });
                }
            },

            beforeDestroy: async (task, options) => {
                const actorId = (options as any).userId || (options as any).context?.userId || task.getDataValue('userId');

                await TaskLog.create({
                    taskId: task.id,
                    userId: actorId,
                    action: 'DELETE',
                    changes: { title: task.title }
                });
            },
        },
    }
);

// Configuração do Relacionamento
UserModel.hasMany(TaskModel, {
    foreignKey: 'userId',
    as: 'tasks'
});

TaskModel.belongsTo(UserModel, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    as: 'user',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});