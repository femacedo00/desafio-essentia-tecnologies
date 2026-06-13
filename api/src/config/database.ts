import { Sequelize } from "sequelize";

// Variáveis para a conexação do banco MySQL
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = parseInt(process.env.DB_MYSQL_PORT || "3306", 10);

/* CONEXÃO MYSQL ATRAVÉS DA INSTÃNCIA DO SEQUELIZE */
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false, // Desativa os logs de SQL no terminal
    define: {
        timestamps: true, // Cria automaticamente as colunas 'createdAt' e 'updatedAt' nas tabelas
        underscored: true, // Transforma camelCase em snake_case no banco (ex: userId vira user_id)
    }
});

export const connectMySQL = async (): Promise<void> => {
    try {
        // Realiza a conexão com o MySQL
        await sequelize.authenticate();
        console.log('MySQL conectado com sucesso!');

        // Sincorniza as tabelas do MySQL e atualiza a estrutura do banco se o model for alterado
        await sequelize.sync({ alter: true });
        console.log('Tabelas do MySQL sincronizadas com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
        process.exit(1); // Fecha a aplicação caso o banco principal falhe
    }
};

export default sequelize;