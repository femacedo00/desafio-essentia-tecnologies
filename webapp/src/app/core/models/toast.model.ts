export type ToastTypetMessage = 'success' | 'error';

export interface ToastMessage {
    message: string;
    type: ToastTypetMessage;
}
