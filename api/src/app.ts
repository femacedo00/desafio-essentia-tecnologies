import express from "express";
import bodyParser from 'body-parser';
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from 'cors';

const app = express();

/* MIDDLEWARES GLOBAIS */

// Ative o CORS especificamente para a porta do Angular
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Intercepta as requisições recebidas e verifica se o corpo (Body) está no formato JSON
app.use(bodyParser.json());

// Lida com requisições enviadas no formato application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Chama todas as rotas 
app.use(routes);

// Lida com o tratamento de erros na response
app.use(errorHandler);

// Exportamos o app pronto e configurado
export default app;