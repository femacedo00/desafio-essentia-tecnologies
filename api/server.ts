import app from "./src/app.js";
import { connectMySQL } from "./src/config/database.js";
import { connectMongo } from "./src/config/mongo.js";

const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados MySql
await connectMySQL();

// Inicializa o MongoDB em seguida
await connectMongo();

// Após a conexão com o banco de dados, inicializa-se o servidor
app.listen(PORT, () => {
    console.log(`Server rodando pela porta: http://localhost:${PORT}`);
});