const sql = require('mssql');
require('dotenv').config();

class CarService {
    constructor(database) {
        this.database = database;
    }

    async getMyCars(req, res) {
        const user_id = req.user.user_id;

        try {
            const query = 'EXEC GetMyCars @user_id';
            const result = await this.database.query(query, [{ name: 'user_id', type: sql.Int, value: user_id }]);
            res.status(200).send(result.recordset);
        } catch (error) {
            console.error('Get my cars error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getCarBrands(req, res) {
        try {
            const query = 'SELECT * FROM CarBrandList';
            const result = await this.database.query(query);
            res.status(200).send(result.recordset);
        } catch (error) {
            console.error('Get car brands error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getCategories(req, res) {
        try {
            const query = 'SELECT * FROM CategoryList';
            const result = await this.database.query(query);
            res.status(200).send(result.recordset);
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async createCar(req, res) {
        const { car_name, brand_id, price, image, model, year, car_description, cate_id } = req.body;
        const user_id = req.user.user_id;

        try {
            const query = 'EXEC CreateCar @car_name, @brand_id, @price, @image, @model, @year, @creator_id, @car_description, @cate_id';

            await this.database.query(query, [
                { name: 'car_name', type: sql.NVarChar, value: car_name },
                { name: 'brand_id', type: sql.Int, value: brand_id },
                { name: 'price', type: sql.NVarChar, value: price },
                { name: 'image', type: sql.NVarChar, value: image },
                { name: 'model', type: sql.NVarChar, value: model },
                { name: 'year', type: sql.Int, value: year },
                { name: 'creator_id', type: sql.Int, value: user_id },
                { name: 'car_description', type: sql.NVarChar, value: car_description },
                { name: 'cate_id', type: sql.Int, value: cate_id }
            ]);

            res.status(201).send('Car created successfully!');
        } catch (error) {
            console.error('Create car error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async deleteCar(req, res) {
        const user_id = req.user.user_id;
        const car_id = req.params.car_id;

        try {
            const query = 'EXEC DeleteCar @car_id, @user_id';
            await this.database.query(query, [
                { name: 'car_id', type: sql.Int, value: car_id },
                { name: 'user_id', type: sql.Int, value: user_id }
            ]);

            return res.status(200).send('Xe đã được xoá thành công!');
        } catch (error) {
            console.error('Delete car error:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    async getCarDetail(req, res) {
        const carId = req.params.carId;

        try {
            const query = 'SELECT * FROM GetCarDetail(@carId)';
            const result = await this.database.query(query, [{ name: 'carId', type: sql.Int, value: carId }]);

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Car not found' });
            }

            const carDetail = result.recordset[0];
            return res.status(200).json(carDetail);
        } catch (error) {
            console.error('Get car detail error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async editCar(req, res) {
        const car_id = req.params.car_id;
        const { car_name, brand_id, price, image, model, year, car_description, cate_id } = req.body;

        try {
            const query = 'EXEC UpdateCar @car_id, @car_name, @brand_id, @price, @image, @model, @year, @car_description, @cate_id';
            await this.database.query(query, [
                { name: 'car_id', type: sql.Int, value: car_id },
                { name: 'car_name', type: sql.NVarChar, value: car_name },
                { name: 'brand_id', type: sql.Int, value: brand_id },
                { name: 'price', type: sql.NVarChar, value: price },
                { name: 'image', type: sql.NVarChar, value: image },
                { name: 'model', type: sql.NVarChar, value: model },
                { name: 'year', type: sql.Int, value: year },
                { name: 'car_description', type: sql.NVarChar, value: car_description },
                { name: 'cate_id', type: sql.Int, value: cate_id }
            ]);

            return res.status(200).send('Xe đã được chỉnh sửa thành công!');
        } catch (error) {
            console.error('Edit car error:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    async getCars(req, res) {
        const { car_name, brand_id, cate_id, model, year } = req.query;

        try {
            const query = 'SELECT * FROM GetCarsInfo(@car_name, @brand_id, @cate_id, @model, @year)';
            const result = await this.database.query(query, [
                { name: 'car_name', type: sql.NVarChar, value: car_name || null },
                { name: 'brand_id', type: sql.Int, value: brand_id || null },
                { name: 'cate_id', type: sql.Int, value: cate_id || null },
                { name: 'model', type: sql.NVarChar, value: model || null },
                { name: 'year', type: sql.Int, value: year || null }
            ]);

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get cars error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getSomeCars(req, res) {
        const { brand_id, cate_id } = req.query;

        try {
            const query = 'SELECT * FROM GetSixCarsInfoByBrandOrCategory(@brand_id, @cate_id)';
            const result = await this.database.query(query, [
                { name: 'brand_id', type: sql.Int, value: brand_id || null },
                { name: 'cate_id', type: sql.Int, value: cate_id || null }
            ]);

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get some cars error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getRandomCars(req, res) {
        try {
            const query = 'EXEC GetRandomCars';
            const result = await this.database.query(query);
            return res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get random cars error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getCarsAdmin(req, res) {
        try {
            const query = 'SELECT * FROM CarsViewAdmin ORDER BY car_id DESC';
            const result = await this.database.query(query);
            return res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Get cars admin error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateCarStatus(req, res) {
        const { car_id, status } = req.body;

        if (!car_id || !status) {
            return res.status(400).json({ error: 'car_id and status are required fields' });
        }

        try {
            const query = 'EXEC UpdateCarStatus @p_car_id, @p_status';
            await this.database.query(query, [
                { name: 'p_car_id', type: sql.Int, value: car_id },
                { name: 'p_status', type: sql.Int, value: status }
            ]);

            return res.status(200).json({ message: 'Car status updated successfully' });
        } catch (error) {
            console.error('Update car status error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = CarService;