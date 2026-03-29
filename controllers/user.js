const User = require('../models/user');
const { genrateToken, createAndStoreToken } = require('../service/auth');

async function handleSignup(req, res) {
    const body = req.body;
    try {
        const user = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password
        });
        await user.save();
        res.status(201).json({ message: 'User signed up successfully', user });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Failed to sign up user', error: error.message });
    }
}

async function handleLogin(req, res) {
    const body = req.body;
    try {
        const user = await User.matchPassword(body.email, body.password);
        // console.log("user", user);

        const token = await createAndStoreToken(user);

        res.status(200).json({ message: 'User logged in successfully', user, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(401).json({ message: 'Invalid email or password', error: error.message });
    }
}


module.exports = {
    handleSignup,
    handleLogin
}
