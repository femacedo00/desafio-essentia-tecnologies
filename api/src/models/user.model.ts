import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import { UserAttributes, UserCreationAttributes } from '../types/user.types.js';

// Modelo de dados representante da tabela de usuários no banco de dados MySQL
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;

    // Método auxiliar para comparar a senha digitada no login com o hash do banco
    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    // Sobrescrever o toJSON nativo
    public toJSON(): any {
        // Pega os valores puros do banco
        const values: Record<string, any> = { ...this.get() };

        // Remove o que não deve ir para o cliente
        delete values.id;
        delete values.password;

        // Converte os objetos Date para String ISO
        if (values.createdAt) values.createdAt = values.createdAt.toISOString();
        if (values.updatedAt) values.updatedAt = values.updatedAt.toISOString();
        if (values.deletedAt) values.deletedAt = values.deletedAt.toISOString();

        return values;
    }
}

// Inicialização da estrutura e mapeamento de colunas da tabela MySQL
User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        hooks: {
            // Criptografa a senha automaticamente antes de salvar no MySQL
            beforeSave: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.dataValues.password = await bcrypt.hash(user.dataValues.password, salt);
                }
            },
        },
    }
);

export default User;