import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgClass],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('Gestão de Tarefas');
  public toastService = inject(ToastService);
}
