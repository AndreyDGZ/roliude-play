import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Conforme Seção 9.3/9.5 da documentação: PostgreSQL é o banco de dados
// adotado pelo Rolliúde Play, por sua adequação ao modelo relacional
// (usuários, filmes, profissionais, localidades, curadoria).
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;