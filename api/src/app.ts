import express from "express";
import bodyParser from 'body-parser';

const app = express();

/* MIDDLEWARES GLOBAIS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exportamos o app pronto e configurado
export default app;