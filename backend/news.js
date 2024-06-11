const sql = require('mssql');
require('dotenv').config();

class NewsService {
    constructor(database) {
        this.database = database;
    }

    async getRandomNews(req, res) {
        try {
            const query = 'EXEC GetRandomNews';
            const result = await this.database.query(query);
            return res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get random news error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getNewsByCategory(req, res) {
        const { cate_id } = req.query;

        try {
            const query = 'SELECT * FROM GetFourNewsByCategoryId(@cate_id)';
            const result = await this.database.query(query, [
                { name: 'cate_id', type: sql.Int, value: cate_id || null }
            ]);

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get news by category error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getNewsDetail(req, res) {
        const newsId = req.params.newsId;

        try {
            const query = `SELECT * FROM GetNewsDetail(${newsId})`;
            const result = await this.database.query(query);

            return res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get news detail error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = NewsService;