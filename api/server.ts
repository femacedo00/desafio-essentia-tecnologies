import app from "./src/app.js";
import { connectMySQL } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados MySql
await connectMySQL();

// Após a conexão com o banco de dados, inicializa-se o servidor
app.listen(PORT, () => {
    console.log(`Server rodando pela porta: http://localhost:${PORT}`);
});