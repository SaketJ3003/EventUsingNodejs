const express = require('express');
const router = express.Router();
const { handleCountry, handleState, handleCity } = require('../controllers/geo');
const { handleCategory, handleTag, handleEvent } = require('../controllers/eventDetail');

router.post('/country', handleCountry);
router.post('/state', handleState);
router.post('/city', handleCity);

router.post('/category', handleCategory);
router.post('/tag', handleTag);
router.post('/event', handleEvent);

module.exports = router;