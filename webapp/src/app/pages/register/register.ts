import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';

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
  private router = inject(Router);

  // Define as validações do formulário
  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Armazena e expõe mensagens textuais nos tratamentos de erros da API para que seja retornada ao usuário na view
  public errorMessage: string = '';

  // Armazena e expõe mensagens textuais nos tratamentos de sucessos da API para que seja retornada ao usuário na view
  public successMessage: string = '';

  // Processa o envio dos dados imputados no formulário
  public onSubmit(): void {
    // Não efetua o sunbmit enquanto o formulário não estiver de acordo com as validações
    if (this.registerForm.invalid) return;

    // Inicia a requisição HTTP
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Conta criada com sucesso! Redirecionando...';
        this.errorMessage = '';

        // Aguarda 2 segundos para o usuário ler a mensagem e manda para o login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Erro ao registrar usuário.';
      }
    });
  }
}