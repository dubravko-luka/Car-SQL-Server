const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

const app = express();
const port = 3000;

const config = {
    user: 'sa',
    password: '123456',
    server: '192.168.1.109',
    port: 1433,
    database: 'garage',
    options: {
        encrypt: true,
        trustServerCertificate: true 
    }
};

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.PUBLIC_JWT, { algorithms: 'RS256' }, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};


// ROUTER

app.get('/verify', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Verified' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM Users WHERE username = @username`;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(query);

        if (result.recordset.length > 0) {
            const match = await bcrypt.compare(password, result.recordset[0].password);
            
            if (match) {
                const token = jwt.sign({ username: username, user_id: result.recordset[0].user_id }, process.env.SECRET_JWT, { algorithm: 'RS256' });
                return res.status(200).json({
                    message: 'Login success!',
                    token: token
                });
            } else {
                return res.status(400).json({
                    message: 'Account or Password Incorrect!'
                });
            }
        } else {
            return res.status(400).json({
                message: 'Account or Password Incorrect!'
            });
        }
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/register', async (req, res) => {
    const { username, password, first_name, last_name, phone } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO Users (username, password, first_name, last_name, phone) VALUES (@username, @password, @first_name, @last_name, @phone)';
        
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashedPassword)
            .input('first_name', sql.NVarChar, first_name)
            .input('last_name', sql.NVarChar, last_name)
            .input('phone', sql.NVarChar, phone)
            .query(query);

        res.status(200).send('Đăng ký thành công!');
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/cars', async (req, res) => {
    try {
        const { car_name, brand_id, model, year } = req.query;
    
        let query = 'SELECT * FROM CarList WHERE 1=1';
        const params = [];

        if (car_name) {
            query += ' AND car_name LIKE @car_name';
            params.push({ name: 'car_name', type: sql.NVarChar, value: '%' + car_name + '%' });
        }
        if (brand_id) {
            query += ' AND brand_id = @brand_id';
            params.push({ name: 'brand_id', type: sql.Int, value: brand_id });
        }
        if (model) {
            query += ' AND model LIKE @model';
            params.push({ name: 'model', type: sql.NVarChar, value: '%' + model + '%' });
        }
        if (year) {
            query += ' AND year = @year';
            params.push({ name: 'year', type: sql.Int, value: year });
        }

        query += ' ORDER BY car_id DESC';

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('car_name', sql.NVarChar, '%' + car_name + '%')
            .input('brand_id', sql.Int, brand_id)
            .input('model', sql.NVarChar, '%' + model + '%')
            .input('year', sql.Int, year)
            .query(query, params);

        res.status(200).send(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/carBrands', async (req, res) => {
    try {
        const query = 'EXEC GetCarBrands';
        const pool = await sql.connect(config);
        const result = await pool.request().query(query);

        res.status(200).send(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/myaccount', authenticateToken, async (req, res) => {
    const username = req.user.username;

    try {
        const query = 'EXEC GetUserByUsername @username';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(query);
        res.status(200).send(result.recordset[0]);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/updateUserInfo', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        let { first_name, last_name, username, phone, password, avatar } = req.body;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            password = hashedPassword;
        }

        const query = 'EXEC UpdateUserInfo @userId, @firstName, @lastName, @phone, @password, @avatar';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, user_id)
            .input('firstName', sql.NVarChar, first_name)
            .input('lastName', sql.NVarChar, last_name)
            .input('phone', sql.NVarChar, phone)
            .input('password', sql.NVarChar, password)
            .input('avatar', sql.NVarChar, avatar)
            .query(query);

        return res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/mycars', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const query = 'EXEC GetCarsByUserId @userId';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, user_id)
            .query(query);

        res.status(200).send(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/cars/create', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { car_name, brand_id, model, year, car_description, image, price } = req.body;
        const query = 'EXEC InsertCar @carName, @brandId, @model, @year, @creatorId, @carDescription, @image, @price';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('carName', sql.NVarChar, car_name)
            .input('brandId', sql.Int, brand_id)
            .input('model', sql.NVarChar, model)
            .input('year', sql.Int, year)
            .input('creatorId', sql.Int, user_id)
            .input('carDescription', sql.Text, car_description)
            .input('image', sql.Text, image)
            .input('price', sql.Text, price)
            .query(query);

        return res.status(200).send('Car created successfully!');
    } catch (error) {
        if (error.code === '45000') {
            return res.status(400).send('Brand does not exist');
        } else if (error.code === '45001') {
            return res.status(400).send('User does not exist');
        } else {
            console.error('Error executing SQL query:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
});

app.get('/cars/detail/:carId', async (req, res) => {
    try {
        const carId = req.params.carId;
        const query = 'EXEC GetCarDetail @carId';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('carId', sql.Int, carId)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const carDetail = result.recordset[0];
        return res.status(200).json(carDetail);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/cars/edit/:car_id', authenticateToken, async (req, res) => {
    try {
        const car_id = req.params.car_id;
        const { car_name, brand_id, model, year, car_description, image, price } = req.body;

        const query = 'EXEC EditCar @carId, @carName, @brandId, @model, @carYear, @carDescription, @image, @price';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('carId', sql.Int, car_id)
            .input('carName', sql.NVarChar, car_name)
            .input('brandId', sql.Int, brand_id)
            .input('model', sql.NVarChar, model)
            .input('carYear', sql.Int, year)
            .input('carDescription', sql.Text, car_description)
            .input('image', sql.Text, image)
            .input('price', sql.Text, price)
            .query(query);

        return res.status(200).send('Xe đã được chỉnh sửa thành công!');
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.delete('/cars/delete/:car_id', authenticateToken, async (req, res) => {
    try {
        const car_id = req.params.car_id;
        const query = 'EXEC DeleteCar @car_id';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('car_id', sql.Int, car_id)
            .query(query);

        return res.status(200).send('Xe đã được xoá thành công!');
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/users', async (req, res) => {
    try {
        const query = 'EXEC GetUsers';
        const pool = await sql.connect(config);
        const result = await pool.request().query(query);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/contacts', async (req, res) => {
    try {
        const { garage_id, full_name, gender, price_range, phone } = req.body;

        const query = 'CreateContact';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('p_user_id', sql.Int, garage_id)
            .input('p_full_name', sql.NVarChar(100), full_name)
            .input('p_gender', sql.NVarChar(10), gender)
            .input('p_price_range', sql.NVarChar(50), price_range)
            .input('p_phone', sql.NVarChar(10), phone)
            .execute(query);

        // Kiểm tra kết quả trả về từ stored procedure
        if (result.returnValue === -1) {
            return res.status(400).json({ error: 'Invalid gender' });
        } else if (result.returnValue === 1) {
            return res.status(201).json({ message: 'Contact created successfully' });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/contacts', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const query = 'EXEC GetContactsByUserId @userId';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, user_id)
            .query(query);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/contacts/:contactId', authenticateToken, async (req, res) => {
    try {
        const contactId = req.params.contactId;

        const query = 'EXEC DeleteContact @contactId';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('contactId', sql.Int, contactId)
            .query(query);

        return res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/news', async (req, res) => {
    try {
        const query = 'EXEC GetNewsList';
        const pool = await sql.connect(config);
        const result = await pool.request().query(query);

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/random-news', async (req, res) => {
    try {
        const query = 'EXEC GetRandomNews';
        const pool = await sql.connect(config);
        const result = await pool.request().query(query);

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/news/:newsId', async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const query = 'SELECT * FROM dbo.GetNewsDetail(@newsId)';
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('newsId', sql.Int, newsId)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        return res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/random-cars', async (req, res) => {
    try {
        const query = 'EXEC GetRandomCars';
        const pool = await sql.connect(config);
        const result = await pool.request().query(query);

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Chạy ứng dụng trên cổng 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
