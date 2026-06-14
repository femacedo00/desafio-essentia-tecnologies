import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private toast = inject(ToastService);
  private router = inject(Router);

  // Define as validações do formulário
  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Processa o envio dos dados imputados no formulário
  public onSubmit(): void {
    // Não efetua o sunbmit enquanto o formulário não estiver de acordo com as validações
    if (this.registerForm.invalid) return;

    // Inicia a requisição HTTP
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        // Dispara o pop-up
        this.toast.show('Conta criada com sucesso!', 'success');

        // Aguarda 2 segundos para o usuário ler a mensagem e manda para o login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // Dispara o pop-up
        const msg = err.error?.message || 'Erro ao registrar usuário.';
        this.toast.show(msg, 'error');
      }
    });
  }
}