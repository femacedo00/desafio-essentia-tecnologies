import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto, DeleteResponse, ResponseTasks, ResponseTask } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/tasks';
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    public tasks$ = this.tasksSubject.asObservable();

    // Busca todas as tarefas do usuário e atualiza a listagem do front
    public getAll(): Observable<ResponseTasks> {
        return this.http.get<ResponseTasks>(this.apiUrl).pipe(
            tap(res => this.tasksSubject.next(res.data.tasks))
        );
    }

    // Cadastra uma nova tarefa na API e a adiciona na listagem das tarefas
    public create(taskData: CreateTaskDto): Observable<ResponseTask> {
        return this.http.post<ResponseTask>(this.apiUrl, taskData).pipe(
            tap(response => {
                const newTask: Task = response.data.task;
                const currentTasks = this.tasksSubject.value;
                this.tasksSubject.next([newTask, ...currentTasks]);
            })
        );
    }

    // Atualiza os dados de uma tarefa e sincroniza com a tarefa no front
    public update(id: number, taskData: UpdateTaskDto): Observable<ResponseTask> {
        return this.http.patch<ResponseTask>(`${this.apiUrl}/${id}`, taskData).pipe(
            tap(response => {
                const updatedTask: Task = response.data.task;
                const currentTasks = this.tasksSubject.value.map(task =>
                    task.id === id ? { ...task, ...updatedTask } : task
                );
                this.tasksSubject.next(currentTasks);
            })
        );
    }

    // Remove uma tarefa da API e a remove da listagem do front
    public delete(id: number): Observable<DeleteResponse> {
        return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const currentTasks = this.tasksSubject.value.filter(task => task.id !== id);
                this.tasksSubject.next(currentTasks);
            })
        );
    }
}