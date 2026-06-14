import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';

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
  private router = inject(Router);

  // Define as validações do formulário
  public loginForm: FormGroup = this.fb.group({
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
    if (this.loginForm.invalid) return;

    // Inicia a requisição HTTP
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.successMessage = 'Login efetuado com sucesso! Redirecionando...';
        // this.router.navigate(['/tasks']); 
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao realizar login. Tente novamente.';
      }
    });
  }
}
