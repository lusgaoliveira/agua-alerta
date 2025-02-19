require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || 
    !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error('Alguma variável de ambiente do banco de dados está faltando.');
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
});

pool.on('connect', () => {
    console.log('Conectado ao banco de dados PostgreSQL.');
});

pool.on('error', (err) => {
    console.error('Erro no pool de conexões:', err.message);
});

async function connectDB() {
    try {
        console.log("Foi!!!!")
        return pool;
    } catch (error) {
        console.error('Erro na conexão com o banco de dados:', error.message);
        throw error;
    }
}

module.exports = connectDB;
