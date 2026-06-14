import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Tasks } from './pages/tasks/tasks';

export const routes: Routes = [
    // Redireciona a rota raiz vazia direto para o login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Rotas de Autenticação
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    // Rota das tarefas
    { path: 'tasks', component: Tasks },

    // Rota para páginas não encontradas (404)
    { path: '**', redirectTo: 'login' }
];