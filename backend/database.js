const sql = require('mssql');
require('dotenv').config();

class Database {
    constructor() {
        this.config = {
            user: 'sa',
            password: 'Password.1',
            server: '127.0.0.1',
            port: 1433,
            database: 'garage',
            options: {
                encrypt: true,
                trustServerCertificate: true 
            }
        };
    }

    async connect() {
        try {
            this.pool = await sql.connect(this.config);
            return this.pool;
        } catch (error) {
            console.error('Database connection error:', error);
            throw new Error('Database connection failed');
        }
    }

    async query(query, params = []) {
        try {
            const pool = await this.connect();
            const request = pool.request();
            params.forEach(param => request.input(param.name, param.type, param.value));
            return await request.query(query);
        } catch (error) {
            console.error('Database query error:', error);
            throw new Error('Database query failed');
        }
    }
}

module.exports = Database;