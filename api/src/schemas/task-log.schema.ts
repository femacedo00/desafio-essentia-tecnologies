import { Schema, model } from 'mongoose';
import { ITaskLog } from '../types/task-log.types.js';

const taskLogSchema = new Schema<ITaskLog>({
    taskId: { type: Number, required: true },
    userId: { type: Number, required: true },
    action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
    changes: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Exporta o modelo do Mongoose
export const TaskLog = model<ITaskLog>('TaskLog', taskLogSchema, 'task_logs');