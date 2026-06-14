import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Tasks } from './pages/tasks/tasks';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Redireciona a rota raiz vazia direto para o login
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },

    // Rotas de Autenticação
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    // Rota das tarefas com validação de token
    { path: 'tasks', component: Tasks, canActivate: [authGuard] },

    // Rota para páginas não encontradas (404)
    { path: '**', redirectTo: 'tasks' }
];