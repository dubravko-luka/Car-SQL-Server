const sql = require('mssql');
const bcrypt = require('bcrypt');
require('dotenv').config();

class UserService {
    constructor(database, authService) {
        this.database = database;
        this.authService = authService;
    }

    async login(req, res) {
        const { username, password } = req.body;
        const query = 'SELECT * FROM GetUserByUsernameLogin(@username)';

        try {
            const result = await this.database.query(query, [{ name: 'username', type: sql.NVarChar, value: username }]);
            if (result.recordset.length > 0) {
                const match = await bcrypt.compare(password, result.recordset[0].password);
                if (match) {
                    const token = this.authService.generateToken({ username: username, user_id: result.recordset[0].user_id });
                    return res.status(200).json({
                        message: 'Login success!',
                        token: token
                    });
                }
            }
            return res.status(400).json({ message: 'Account or Password Incorrect!' });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    async register(req, res) {
        const { username, password, first_name, last_name, phone } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = 'EXEC RegisterUser @username, @password, @first_name, @last_name, @phone';

            await this.database.query(query, [
                { name: 'username', type: sql.NVarChar, value: username },
                { name: 'password', type: sql.NVarChar, value: hashedPassword },
                { name: 'first_name', type: sql.NVarChar, value: first_name },
                { name: 'last_name', type: sql.NVarChar, value: last_name },
                { name: 'phone', type: sql.NVarChar, value: phone }
            ]);

            res.status(200).send('Đăng ký thành công!');
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getMyAccount(req, res) {
        const username = req.user.username;

        try {
            const query = 'EXEC GetUserByUsername @username';
            const result = await this.database.query(query, [{ name: 'username', type: sql.NVarChar, value: username }]);
            res.status(200).send(result.recordset[0]);
        } catch (error) {
            console.error('Get account error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async updateUserInfo(req, res) {
        try {
            const user_id = req.user.user_id;
            let { first_name, last_name, phone, password, avatar } = req.body;

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                password = hashedPassword;
            }

            const query = 'EXEC UpdateUserInfo @userId, @firstName, @lastName, @phone, @password, @avatar';
            await this.database.query(query, [
                { name: 'userId', type: sql.Int, value: user_id },
                { name: 'firstName', type: sql.NVarChar, value: first_name },
                { name: 'lastName', type: sql.NVarChar, value: last_name },
                { name: 'phone', type: sql.NVarChar, value: phone },
                { name: 'password', type: sql.NVarChar, value: password || null },
                { name: 'avatar', type: sql.NVarChar, value: avatar }
            ]);

            return res.status(200).json({ message: 'User information updated successfully' });
        } catch (error) {
            console.error('Update user info error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUsersExcludingRole1(req, res) {
        try {
            const query = 'SELECT * FROM UsersExcludingRole1';
            const pool = await this.database.connect();
            const result = await pool.request().query(query);

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UserService;