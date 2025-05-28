const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token. Unauthorized access' });
    }
};


module.exports = authenticateJWT;