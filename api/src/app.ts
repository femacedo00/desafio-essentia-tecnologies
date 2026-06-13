import express from "express";
import bodyParser from 'body-parser';
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* MIDDLEWARES GLOBAIS */
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Chama todas as rotas 
app.use(routes);

app.use(errorHandler);

// Exportamos o app pronto e configurado
export default app;