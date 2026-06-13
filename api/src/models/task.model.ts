import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.model.js';
import { TaskAttributes, TaskCreationAttributes, TaskHookOptions } from '../types/task.types.js';
import { TaskLogModel } from './task-log.model.js';

export class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public completed!: boolean;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
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
            }
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
        paranoid: true,
        hooks: {
            // Log após criar uma tarefa
            afterCreate: async (task, options) => {
                // Captura o userId passado pelo service nas opções
                const actorId = (options as TaskHookOptions).userId ?? task.userId;

                await TaskLogModel.create({
                    taskId: task.id,
                    userId: actorId,
                    action: 'CREATE',
                    changes: JSON.stringify({ title: task.title, description: task.description })
                });
            },

            // Log após atualizar uma tarefa
            afterUpdate: async (task, options) => {
                const actorId = (options as TaskHookOptions).userId ?? task.userId;

                // O Sequelize sabe quais campos mudaram na requisição atual
                const changedFields = task.changed();
                if (changedFields) {
                    const changesObj: Record<string, { old: any; new: any }> = {};

                    changedFields.forEach((field) => {
                        // task.previous(field) pega o valor antigo antes do update
                        changesObj[field] = {
                            old: task.previous(field as any),
                            new: task.get(field as any),
                        };
                    });

                    await TaskLogModel.create({
                        taskId: task.id,
                        userId: actorId,
                        action: 'UPDATE',
                        changes: JSON.stringify(changesObj),
                    });
                }
            },

            // Log antes de deletar a tarefa
            beforeDestroy: async (task, options) => {
                const actorId = (options as TaskHookOptions).userId ?? task.userId;

                await TaskLogModel.create({
                    taskId: task.id,
                    userId: actorId,
                    action: 'DELETE',
                    changes: JSON.stringify({ title: task.title }),
                });
            },
        }
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