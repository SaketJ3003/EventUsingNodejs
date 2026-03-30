const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin } = require('../controllers/user');
const User = require('../models/user');
const { checkForAdmin } = require('../middlewares/auth');

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

// route to get all users

router.get('/', checkForAdmin, async (req,res) =>  {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





module.exports = router;