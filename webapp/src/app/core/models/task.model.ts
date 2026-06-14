// Define a estrutura completa de uma tarefa
export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Define a estrutura necessária para a criação de uma nova tarefa
export interface CreateTaskDto {
    title: string;
    description?: string;
}

// Define a estrutura da atualização parcial de uma tarefa
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    completed?: boolean;
}

// Define a estrutura padrão de uma resposta da api do endpoint de tarefas
export interface ResponseDefault {
    status: string;
    message?: string;
}

// Define a estrutura padrão de uma resposta da api de um determinada tarefa
export type ResponseTask = ResponseDefault & {
    data: {
        task: Task
    }
}

// Define a estrutura padrão de uma resposta da api de listagem de tarefas
export type ResponseTasks = ResponseDefault & {
    data: {
        tasks: Task[]
    }
}

// Define a resposta da remoção de uma tarefa
export type DeleteResponse = ResponseDefault;