const jwt =  require("jsonwebtoken");
const UserToken = require("../models/userToken");
const secret  = "Saket$123@$";


function genrateToken(user){
    // console.log("user", user);
    return jwt.sign({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
    }, secret, { expiresIn: '1h' });
}

function verifyToken(token){
    if(!token) return null;
    try{
        return jwt.verify(token, secret); 
    } catch(error){
        console.error('Error verifying token:', error);
        return null;
    }
}

// Create token and store in database (single session per user)
async function createAndStoreToken(user) {
    try {
        const token = genrateToken(user);
        
        // Calculate expiration time (1 hour from now)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        
        // Upsert: Delete old token and create new one for this user
        // The unique index on userId ensures only one token exists per user
        await UserToken.findOneAndUpdate(
            { userId: user._id },
            { 
                token, 
                expiresAt, 
                isActive: true 
            },
            { upsert: true, new: true }
        );
        
        return token;
    } catch (error) {
        console.error('Error storing token:', error);
        throw error;
    }
}

// Invalidate token when user logs out
async function invalidateToken(userId) {
    try {
        await UserToken.findOneAndUpdate(
            { userId },
            { isActive: false }
        );
    } catch (error) {
        console.error('Error invalidating token:', error);
        throw error;
    }
}

// Verify token exists in database and is active
async function verifyTokenInDatabase(userId, token) {
    try {
        const userToken = await UserToken.findOne({ 
            userId, 
            token, 
            isActive: true 
        });
        return userToken ? true : false;
    } catch (error) {
        console.error('Error verifying token in database:', error);
        return false;
    }
}

module.exports = {
    genrateToken,
    verifyToken,
    createAndStoreToken,
    invalidateToken,
    verifyTokenInDatabase
}