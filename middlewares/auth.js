const { verifyToken, verifyTokenInDatabase } = require('../service/auth');

async function checkForAuthentication(req, res, next) {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    // console.log('Received token:', token);
    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const isTokenValid = await verifyTokenInDatabase(user._id, token);
    if (!isTokenValid) {
        return res.status(401).json({ message: 'Token has been invalidated. Please login again.' });
    }
    
    req.user = user;
    next();
}

async function checkForAdmin(req, res, next) {
    let token = req.headers['authorization'];
    
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    const user = verifyToken(token);    
    if (!user || user.isAdmin !== true) {
        return res.status(403).json({ message: 'Only admins can access this route' });
    }
    

    const isTokenValid = await verifyTokenInDatabase(user._id, token);
    if (!isTokenValid) {
        return res.status(401).json({ message: 'Token has been invalidated. Please login again.' });
    }
    
    req.user = user;
    next();
}

module.exports = {
    checkForAuthentication,
    checkForAdmin
}