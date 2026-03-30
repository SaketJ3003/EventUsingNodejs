const express = require('express');
const router = express.Router();
const { handleCountry, handleState, handleCity } = require('../controllers/geo');
const { handleCategory, handleTag, handleEvent } = require('../controllers/eventDetail');
const Event = require('../models/event');

router.post('/country', handleCountry);
router.post('/state', handleState);
router.post('/city', handleCity);

router.post('/category', handleCategory);
router.post('/tag', handleTag);
router.post('/event', handleEvent);

// route to get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// route to get event by slug and increasing view count
router.get('/:slug', async (req, res) => {
    try {
        const event = await Event.findOne({ slug: req.params.slug });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.viewsCount += 1;
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;