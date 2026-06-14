import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { TaskService } from '../../../../core/services/task';
import { TaskLog } from '../../../../core/models/task-log.model';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-task-logs-modal',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './task-logs-modal.html',
  styleUrl: './task-logs-modal.scss'
})

export class TaskLogsModal implements OnInit {
  private taskService = inject(TaskService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) taskId!: number;
  @Input({ required: true }) taskTitle!: string;
  @Output() close = new EventEmitter<void>();

  public logs: TaskLog[] = [];
  public isLoading = true;

  // Dispara a busca inicial dos históricos da tarefa na api
  public ngOnInit(): void {
    this.taskService.getLogs(this.taskId).subscribe({
      next: (res) => {
        // Se retornou com sucesso, carrega a listagem, desativa o loading e recarrega o conteúdo para o histórico aparecer
        this.logs = res.data.log;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Se retornou com erro, gera o toast de erro, desativa o loading e fecha o modal
        this.toast.show(err.error?.message || 'Erro ao carregar o histórico.', 'error');
        this.isLoading = false;
        this.close.emit();
      }
    });
  }

  // Tratamento da resposta da api para legibilidade do usuário
  public formatChanges(log: TaskLog): string[] {
    const lines: string[] = [];
    if (!log.changes) return lines;

    if (log.action === 'CREATE') {
      lines.push(`Tarefa criada com o título: "${log.changes.title}"`);
      if (log.changes.description) lines.push(`Descrição inicial inserida.`);
      return lines;
    }

    // Tratamento de acordo com a ação de edição do usuário
    Object.keys(log.changes).forEach(key => {
      const change = log.changes[key];
      if (change && typeof change === 'object' && 'old' in change) {
        if (key === 'completed') {
          lines.push(change.new ? 'Marcada como Concluída' : 'Marcada como Pendente');
        } else {
          lines.push(`Alterou [${key}] de "${change.old || 'vazio'}" para "${change.new || 'vazio'}"`);
        }
      }
    });

    return lines;
  }
}