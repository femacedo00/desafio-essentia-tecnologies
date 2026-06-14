import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private toast = inject(ToastService);
  private router = inject(Router);

  // Define as validações do formulário
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Processa o envio dos dados imputados no formulário
  public onSubmit(): void {
    // Não efetua o sunbmit enquanto o formulário não estiver de acordo com as validações
    if (this.loginForm.invalid) return;

    // Inicia a requisição HTTP
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        // Dispara o pop-up
        const msg = err.error?.message || 'Erro ao registrar usuário.';
        this.toast.show(msg, 'error');
      }
    });
  }
}
