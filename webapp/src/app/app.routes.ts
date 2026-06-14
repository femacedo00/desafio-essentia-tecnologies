import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    // Redireciona a rota raiz vazia direto para o login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Rotas de Autenticação
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    // Rota para páginas não encontradas (404)
    { path: '**', redirectTo: 'login' }
];