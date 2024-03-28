const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config()

const app = express();
const port = 3000;

// CONNECT DATABASE
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Phuong10@',
    database: 'garare',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

async function connectToSqlServer() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (error) {
        console.error('Error connecting to SQL Server:', error);
    }
}

app.use(cors());
app.use(express.json());

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE username = ?';

    db.query(sql, [username], async (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        };
        if (result.length > 0) {

            const match = await bcrypt.compare(password, result[0].password);

            if (match) {
                const token = jwt.sign({ username: username, user_id: result[0].user_id }, process.env.SECRET_JWT, { algorithm: 'RS256' });
                return res.status(200).send({
                    message: 'Login success!',
                    token: token
                });
            } else {
                return res.status(400).send({
                    message: 'Account or Password Incorrect!'
                });
            }
        } else {
            return res.status(400).send({
                message: 'Account or Password Incorrect!'
            });
        }
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            };
            return res.status(200).send('Đăng ký thành công!');
        });
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/cars', (req, res) => {
    const { car_name, brand_id, model, year } = req.query;
    
    let sql = 'SELECT * FROM CarList WHERE 1';
    const params = [];

    if (car_name) {
        sql += ' AND car_name LIKE ?';
        params.push('%' + car_name + '%');
    }
    if (brand_id) {
        sql += ' AND brand_id = ?';
        params.push(brand_id);
    }
    if (model) {
        sql += ' AND model LIKE ?';
        params.push('%' + model + '%');
    }
    if (year) {
        sql += ' AND year = ?';
        params.push(year);
    }

    sql += ' ORDER BY car_id DESC';

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log('------------------------>', err);
            return res.status(500).send('Internal Server Error');
        };
        return res.status(200).send(result);
    });
});


app.get('/carBrands', (req, res) => {
    const sql = 'CALL GetCarBrands()';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        };
        return res.status(200).send(result[0]);
    });
});

app.get('/myaccount', authenticateToken, (req, res) => {
    const username = req.user.username;
    const sql = 'CALL GetUserByUsername(?)';
    db.query(sql, [username], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        };
        return res.status(200).send(result[0]);
    });
});

// API
app.put('/updateUserInfo', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        let { first_name, last_name, username, phone, password, avatar } = req.body;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            password = hashedPassword;
        }

        const sql = 'CALL UpdateUserInfo(?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [user_id, first_name, last_name, username, phone, password, avatar], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(200).json({ message: 'User information updated successfully' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/mycars', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const sql = 'CALL GetCarsByUserId(?)';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        };
        return res.status(200).send(result);
    });
});


app.post('/cars/create', authenticateToken, (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { car_name, brand_id, model, year, car_description, image } = req.body;
        const sql = 'CALL InsertCar(?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [car_name, brand_id, model, year, user_id, car_description, image], (err, result) => {
            if (err) {
                if (err.code === '45000') {
                    return res.status(400).send('Brand does not exist');
                } else if (err.code === '45001') {
                    return res.status(400).send('User does not exist');
                } else {
                    return res.status(500).send('Internal Server Error');
                }
            } else {
                return res.status(200).send('Car created successfully!');
            }
        });
    } catch (err) {
        return res.status(500).send('Internal Server Error')
    }
});

app.get('/cars/detail/:carId', (req, res) => {
    const carId = req.params.carId;
    const sql = 'CALL GetCarDetail(?)';

    db.query(sql, [carId], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        const carDetail = result[0];
        return res.status(200).json(carDetail);
    });
});

app.put('/cars/edit/:car_id', authenticateToken, async (req, res) => {
    const car_id = req.params.car_id;
    const { car_name, brand_id, model, year, car_description, image } = req.body;
    const sql = 'CALL EditCar(?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [car_id, car_name, brand_id, model, year, car_description, image], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        return res.status(200).send('Xe đã được chỉnh sửa thành công!');
    });
});

app.delete('/cars/delete/:car_id', authenticateToken, async (req, res) => {
    const car_id = req.params.car_id;
    const sql = 'CALL DeleteCar(?)';
    db.query(sql, [car_id], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        return res.status(200).send('Xe đã được xoá thành công!');
    });
});

app.get('/users', (req, res) => {
    const sql = 'CALL GetUsers()';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(result[0]);
    });
});

app.post('/contacts', async (req, res) => {
    try {
        const { garage_id, full_name, gender, price_range, phone } = req.body;

        const sql = 'SELECT CreateContact(?, ?, ?, ?, ?) AS message';
        db.query(sql, [garage_id, full_name, gender, price_range, phone], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            const message = result[0].message;
            return res.status(201).json({ message });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/contacts', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const sql = 'CALL GetContactsByUserId(?)';
        db.query(sql, [user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/contacts/:contactId', authenticateToken, async (req, res) => {
    try {
        const contactId = req.params.contactId;

        const sql = 'CALL DeleteContact(?)';
        db.query(sql, [contactId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(200).json({ message: 'Contact deleted successfully' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API lấy danh sách tin tức
app.get('/news', (req, res) => {
    const sql = 'CALL GetNewsList()';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(result);
    });
});

// Endpoint API lấy 6 tin tức ngẫu nhiên bằng stored procedure
app.get('/random-news', (req, res) => {
    const sql = 'CALL GetRandomNews()';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(result[0]);
    });
});

// API lấy chi tiết tin tức bằng news_id
app.get('/news/:newsId', (req, res) => {
    const newsId = req.params.newsId;
    const sql = 'CALL GetNewsDetail(?)';
    db.query(sql, [newsId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        return res.status(200).json(result[0]);
    });
});

app.get('/random-cars', (req, res) => {
    const sql = 'CALL GetRandomCars()';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(result[0]); // Lấy dữ liệu từ kết quả trả về của stored procedure
    });
});

// Chạy ứng dụng trên cổng 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
