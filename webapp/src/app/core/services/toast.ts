import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage, ToastTypetMessage } from '../models/toast.model';

@Injectable({
    providedIn: 'root'
})

export class ToastService {
    private toastSubject = new Subject<ToastMessage | null>();
    public toastState$ = this.toastSubject.asObservable();

    // Dispara um pop-up na tela que desaparece após o tempo definido
    show(message: string, type: ToastTypetMessage = 'success', duration: number = 3000): void {
        this.toastSubject.next({ message, type });

        // Fecha o toast automaticamente após o tempo definido
        setTimeout(() => {
            this.toastSubject.next(null);
        }, duration);
    }
}