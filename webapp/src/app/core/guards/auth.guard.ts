import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Bloqueia o acesso a rotas internas caso o usuário não possua um token válido.

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Verifica se o token existe no LocalStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Se existir, continua para a rota desejada
        return true;
    }

    // Se não existir, retorna para a página de login
    router.navigate(['/login']);
    return false;
};