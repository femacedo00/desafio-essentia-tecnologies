import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterCredentials, RegisterResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})

export class Auth {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/users';

    // Realiza o cadastro de um novo usuário no sistema
    register(userData: RegisterCredentials): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
    }

    // Autentica um usuário na plataforma
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                // Se o login foi efetuado com sucesso, é salvo o token JWT para ser utiolizado nas requisições dentro da plataforma
                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    // Finaliza a sessão do usuário atual removendo o token JWT
    logout(): void {
        localStorage.removeItem('token');
    }

    // Verifica se o usuário está autenticado
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
}