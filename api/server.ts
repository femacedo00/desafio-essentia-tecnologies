import express from 'express';
import bodyParser from 'body-parser';
import httpStatus from 'http-status';

// Inicialização do framework Express
const app = express();
const PORT = process.env.PORT || 3000;

/* MIDDLEWARES */
// Configuração do body-parser para ler requisições em formato JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ROTAS DE TESTE */
// Rota simples de verificação (Health Check) para validar que o servidor está online
app.get('/health', (req, res) => {
    res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Backend server is running perfectly',
        timestamp: new Date().toISOString()
    });
});

/* INICIALIZAÇÃO DO SERVIDOR */
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app };