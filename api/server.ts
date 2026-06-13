import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

/* INICIALIZAÇÃO DO SERVIDOR */
app.listen(PORT, () => {
    console.log(`Server rodando pela porta: http://localhost:${PORT}`);
});