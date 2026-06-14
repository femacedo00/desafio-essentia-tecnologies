export type ID = number;

// Definção de dados necessário para a criação de uma tarefa
export interface CreateTaskDTO {
    title: string;
    description?: string;
    userId: ID;
}

// Definção de dados necessário para a alteração de uma tarefa
export interface UpdateTaskDTO {
    id: ID;
    userId: ID;
    data: Partial<CreateTaskDTO> & { completed?: boolean };
}

// Definção de dados necessário para os ids de uma tarefa
export type IdsTaskDTO = Omit<UpdateTaskDTO, "data">;

// Definção de dados necessário para a resposta de uma tarefa
export interface ResponseTaskDTO {
    id: ID,
    title: string;
    description: string;
    completed: boolean;
    updatedAt: string;
    createdAt: string;
    deletedAt?: string;
}

// Definção de dados necessário para os ids de um histórico de tarefa
export interface IdsLogTaskDTO {
    taskId: ID;
    userId: ID;
}

// Definção de dados necessário para a resposta de um histórico de uma tarefa
export interface TaskLogResponseDTO {
    id: string;
    taskId: ID;
    userId: ID;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: Record<string, any>;
    createdAt: string;
}
