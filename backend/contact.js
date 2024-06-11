const sql = require('mssql');
require('dotenv').config();

class ContactService {
    constructor(database) {
        this.database = database;
    }

    async getContacts(req, res) {
        const user_id = req.user.user_id;

        try {
            const query = 'SELECT * FROM GetContactsByUserId(@user_id)';
            const result = await this.database.query(query, [
                { name: 'user_id', type: sql.Int, value: user_id }
            ]);

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get contacts error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteContact(req, res) {
        const user_id = req.user.user_id;
        const contact_id = req.params.contactId;

        try {
            const query = 'EXEC DeleteContact @contact_id, @user_id';
            await this.database.query(query, [
                { name: 'contact_id', type: sql.Int, value: contact_id },
                { name: 'user_id', type: sql.Int, value: user_id }
            ]);

            return res.status(200).send('Liên hệ đã được xóa thành công!');
        } catch (error) {
            console.error('Delete contact error:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    async createContact(req, res) {
        const { garage_id, full_name, gender, price_range, phone } = req.body;

        try {
            const query = 'EXEC CreateContact @user_id, @full_name, @gender, @price_range, @phone';
            await this.database.query(query, [
                { name: 'user_id', type: sql.Int, value: garage_id },
                { name: 'full_name', type: sql.NVarChar, value: full_name },
                { name: 'gender', type: sql.VarChar, value: gender },
                { name: 'price_range', type: sql.NVarChar, value: price_range },
                { name: 'phone', type: sql.NVarChar, value: phone }
            ]);

            return res.status(200).send('Liên hệ đã được tạo thành công!');
        } catch (error) {
            console.error('Create contact error:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = ContactService;