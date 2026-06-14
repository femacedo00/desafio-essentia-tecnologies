import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Responsável por interceptar todas as requisições de saída da aplicação, capturar o token JWT
 * armazenado no LocalStorage e injetá-lo no cabeçalho 'Authorization' usando o padrão Bearer
 */
export interface RequestHeaders {
    Authorization: string;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Captura o token no navegador
    const token = localStorage.getItem('token');

    // Se o token existir, clona a requisição original e anexa o cabeçalho Authorization
    if (token) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        // Passa a requisição modificada adiante no fluxo
        return next(clonedRequest);
    }

    // Se não houver token, passa a requisição sem alterações
    return next(req);
};