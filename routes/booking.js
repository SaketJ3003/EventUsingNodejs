const express = require('express');
const router = express.Router();
const { handleBooking } = require('../controllers/booking')

// route to book ticket for an event with a slug

router.post('/:slug', handleBooking);



module.exports = router;