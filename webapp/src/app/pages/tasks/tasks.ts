import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task';
import { Auth } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast';
import { Task, CreateTaskDto, UpdateTaskDto } from '../../core/models/task.model';
import { TaskLogsModal } from './components/task-logs-modal/task-logs-modal';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgClass, TaskLogsModal],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})

export class Tasks implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);
  private toast = inject(ToastService);
  public taskService = inject(TaskService);
  public editingTaskId: number | null = null;
  public selectedTaskForLogs: Task | null = null;

  // Captura e validação novas tarefas
  public taskForm: FormGroup = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(128)
    ]],
    description: ['']
  });

  // Dispara a busca inicial das tarefas cadastradas na api
  public ngOnInit(): void {
    this.taskService.getAll().subscribe({
      error: (err) => {
        const msg = err.error?.message || 'Erro ao carregar a sua lista de tarefas.';
        this.toast.show(msg, 'error');
      }
    });
  }

  // Processa o envio do formulário para a criação ou edição de uma nova tarefa
  public onSubmitForm(): void {
    // Não efetua o sunbmit enquanto o formulário não estiver de acordo com as validações
    if (this.taskForm.invalid) return;

    if (this.editingTaskId) {
      // Modo edição
      const payload: UpdateTaskDto = this.taskForm.value;

      this.taskService.update(this.editingTaskId, payload).subscribe({
        next: () => {
          // Em caso de sucesso, dispara um pop-up de sucesso
          this.toast.show('Tarefa atualizada com sucesso!', 'success');

          // Limpa o formulário e sai do modo de edição
          this.onCancelEdit();
        },
        error: (err) => {
          // Em caso de erro, dispara um pop-up de erro
          this.toast.show(err.error?.message || 'Erro ao atualizar tarefa.', 'error');
        }
      });
    } else {
      // Modo Criação
      const payload: CreateTaskDto = this.taskForm.value;

      this.taskService.create(payload).subscribe({
        next: () => {
          // Em caso de sucesso, limpa os campos e dispara um pop-up de sucesso
          this.toast.show('Tarefa criada com sucesso!', 'success');
          this.taskForm.reset();
        },
        error: (err) => {
          // Em caso de erro, mantém os campos e dispara um pop-up de erro
          const msg = err.error?.message || 'Não foi possível salvar a tarefa.';
          this.toast.show(msg, 'error');
        }
      });
    }
  }

  // Insere os dados do card para no formulário
  public onStartEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || ''
    });
  }

  // cancela a edição caso o usuário desista
  public onCancelEdit(): void {
    this.editingTaskId = null;
    this.taskForm.reset();
  }

  // Altera o estado de conclusão da tarefa (concluída ou pendente), invertendo o valor booleano atual
  public onToggleComplete(task: Task): void {
    this.taskService.update(task.id, { completed: !task.completed }).subscribe({
      next: () => {
        // Em caso de sucesso, dispara um pop-up de sucesso
        const statusMsg = !task.completed ? 'Tarefa concluída!' : 'Tarefa marcada como pendente.';
        this.toast.show(statusMsg, 'success');
      },
      error: (err) => {
        // Em caso de erro, dispara um pop-up de erro
        const msg = err.error?.message || 'Erro ao atualizar o status da tarefa.';
        this.toast.show(msg, 'error');
      }
    });
  }

  // Remove em definitivo uma tarefa do sistema
  public onDeleteTask(id: number): void {
    this.taskService.delete(id).subscribe({
      next: () => {
        // Em caso de sucesso, dispara um pop-up de sucesso
        this.toast.show('Tarefa excluída permanentemente.', 'success');
      },
      error: (err) => {
        // Em caso de erro, dispara um pop-up de erro
        const msg = err.error?.message || 'Erro ao tentar deletar a tarefa.';
        this.toast.show(msg, 'error');
      }
    });
  }

  // Encerra a sessão atual do usuário e redireciona para a tela de login
  public onLogout(): void {
    this.authService.logout();
    this.toast.show('Sessão encerrada com sucesso.', 'success');
    this.router.navigate(['/login']);
  }

  // Abre o modal de histórico da tarefa selecionada
  public onOpenLogs(task: Task): void {
    this.selectedTaskForLogs = task;
  }

  // Fecha e limpa o modal da tarefa selecionada
  public onCloseLogs(): void {
    this.selectedTaskForLogs = null;
  }
}