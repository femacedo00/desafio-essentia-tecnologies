import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.model.js';
import { TaskAttributes, TaskCreationAttributes } from '../types/task.types.js';
import { TaskLog } from '../schemas/task-log.schema.js';

// Modelo de dados representante da tabela de tarefas no banco de dados MySQL
export class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    declare id: number;
    declare title: string;
    declare description: string;
    declare completed: boolean;
    declare userId: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;

    // Sobrescreve o toJSON nativo
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

// Inicialização da estrutura e mapeamento de colunas da tabela MySQL
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
        tableName: 'tasks', // Habilita de forma automatizada o createdAt e updatedAt
        timestamps: true, // Habilita Soft Delete em vez de excluir a linha física
        paranoid: true,
        hooks: {
            // Cria o log de criação da tarefa no NoSQL
            afterCreate: async (task, options) => {
                const actorId = (options as any).userId || (options as any).context?.userId || task.getDataValue('userId');

                // Chamada para salvar
                await TaskLog.create({
                    taskId: task.id,
                    userId: actorId,
                    action: 'CREATE',
                    changes: { title: task.title, description: task.description }
                });
            },

            // Mapeia quais colunas sofreram alteração, monta o histórico e salva no banco do MongoDB
            afterUpdate: async (task, options) => {
                const actorId = (options as any).userId || (options as any).context?.userId || task.getDataValue('userId');

                const changedFields = task.changed();
                if (changedFields) {
                    const changesObj: Record<string, { old: any; new: any }> = {};

                    changedFields.forEach((field) => {
                        changesObj[field] = {
                            old: task.previous(field as any), // Estado anterior do dado modificado da tarefa
                            new: task.get(field as any), // Estado atual do dado modificado da tarefa 
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

            // Registra a ação de remoção da atividade no MongoDB
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

/* Configuração do Relacionamento */

// Relacionamento 1:N - Um Usuário possui várias Tarefas
UserModel.hasMany(TaskModel, {
    foreignKey: 'userId',
    as: 'tasks'
});

// Relacionamento N:1 - Uma Tarefa pertence a um único Usuário
TaskModel.belongsTo(UserModel, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    as: 'user',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});