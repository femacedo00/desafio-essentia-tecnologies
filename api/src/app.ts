import express from "express";
import bodyParser from 'body-parser';
import routes from "./routes/index.js";

const app = express();

/* MIDDLEWARES GLOBAIS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes); // Chama todas as rotas 

// Exportamos o app pronto e configurado
export default app;