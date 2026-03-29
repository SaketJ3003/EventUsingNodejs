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


async function createAndStoreToken(user) {
    try {
        const token = genrateToken(user);
        
    
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    

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