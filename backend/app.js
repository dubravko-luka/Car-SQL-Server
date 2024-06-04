const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Database = require('./database')
const AuthService = require('./auth')
const UserService = require('./user')
const CarService = require('./car')
const NewsService = require('./news')
const ContactService = require('./contact')

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4444;
        this.database = new Database();
        this.authService = new AuthService();
        this.userService = new UserService(this.database, this.authService);
        this.carService = new CarService(this.database);
        this.newsService = new NewsService(this.database);
        this.contactService = new ContactService(this.database);

        this.configureMiddleware();
        this.configureRoutes();
    }

    configureMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    configureRoutes() {
        // Authentication routes
        this.app.get('/verify', (req, res) => this.authService.verifyToken(req, res));
        this.app.post('/login', (req, res) => this.userService.login(req, res));
        this.app.post('/register', (req, res) => this.userService.register(req, res));
        this.app.get('/myaccount', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.userService.getMyAccount(req, res));
        this.app.put('/updateUserInfo', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.userService.updateUserInfo(req, res));
        this.app.get('/users-exa', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.userService.getUsersExcludingRole1(req, res));

        // Car routes
        this.app.get('/mycars', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.carService.getMyCars(req, res));
        this.app.get('/carBrands', (req, res) => this.carService.getCarBrands(req, res));
        this.app.get('/categories', (req, res) => this.carService.getCategories(req, res));
        this.app.post('/cars/create', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.carService.createCar(req, res));
        this.app.delete('/cars/delete/:car_id', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.carService.deleteCar(req, res));
        this.app.get('/cars/detail/:carId', (req, res) => this.carService.getCarDetail(req, res));
        this.app.put('/cars/edit/:car_id', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.carService.editCar(req, res));
        this.app.get('/cars', (req, res) => this.carService.getCars(req, res));
        this.app.get('/cars-some', (req, res) => this.carService.getSomeCars(req, res));
        this.app.get('/random-cars', (req, res) => this.carService.getRandomCars(req, res));
        this.app.get('/cars-admin', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.carService.getCarsAdmin(req, res));
        this.app.put('/cars-status', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.carService.updateCarStatus(req, res));

        // News routes
        this.app.get('/random-news', (req, res) => this.newsService.getRandomNews(req, res));
        this.app.get('/news-some', (req, res) => this.newsService.getNewsByCategory(req, res));
        this.app.get('/news/:newsId', (req, res) => this.newsService.getNewsDetail(req, res));

        // Contact routes
        this.app.get('/contacts', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.contactService.getContacts(req, res));
        this.app.delete('/contacts/:contactId', (req, res, next) => this.authService.authenticateToken(req, res, next), (req, res) => this.contactService.deleteContact(req, res));
        this.app.post('/contacts', (req, res) => this.contactService.createContact(req, res));
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

const appInstance = new App();
appInstance.start();
