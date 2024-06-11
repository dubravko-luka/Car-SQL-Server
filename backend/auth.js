const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthService {
    constructor() {
        this.secret = process.env.SECRET_JWT;
        this.publicKey = process.env.PUBLIC_JWT;
    }
    
    verifyToken(req, res) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.PUBLIC_JWT, { algorithms: 'RS256' }, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            return res.status(200).json({ message: 'Verified' });
        });
    }

    authenticateToken(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, this.publicKey, { algorithms: 'RS256' }, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            req.user = user;
            next();
        });
    }

    generateToken(payload) {
        return jwt.sign(payload, this.secret, { algorithm: 'RS256' });
    }
}

module.exports = AuthService;