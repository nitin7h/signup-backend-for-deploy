require('dotenv').config()
const jwt = require("jsonwebtoken")


const secrateKey = process.env.KEY

const tokenGenrator = (payload) => {
    try {
        return jwt.sign({
            _id: payload._id,
            email: payload.email,
        }, secrateKey)
    } catch (error) {
        return null
    }
}



// const verifyToken = (token) => {
//     if (!token) return null

//     try {
//         return jwt.verify(token, secrateKey)
//     } catch (error) {
//         return null;
//     }

// }

//midlleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token.split(' ')[1], secrateKey, (err, decoded) => { // Extract token from header
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        // If token is valid, save the decoded token to request object
        req.userId = decoded.id;
        next();
    });
};

module.exports = {
    tokenGenrator,
    verifyToken
}