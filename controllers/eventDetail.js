const Category = require('../models/categories');
const Tag = require('../models/tags');
const Event = require('../models/event');

async function handleCategory(req, res) {
    const body = req.body;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');
    try {
        const category = new Category({
            name: body.name,
            slug: slug
        });
        await category.save();
        res.status(201).json({ message: 'Category saved successfully', category });
    } catch (error) {
        console.error('Error saving category:', error);
        res.status(500).json({ message: 'Failed to save category', error: error.message });
    }   
}

async function handleTag(req, res) {
    const body = req.body;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');
    try {
        const tag = new Tag({
            name: body.name,
            slug: slug
        });
        await tag.save();
        res.status(201).json({ message: 'Tag saved successfully', tag });
    } catch (error) {
        console.error('Error saving tag:', error);
        res.status(500).json({ message: 'Failed to save tag', error: error.message });
    }
}

async function handleEvent(req, res) {
    const body = req.body;
    try {
        const event = new Event({
            title: body.title,
            slug: body.title.toLowerCase().replace(/\s+/g, '-'),
            category: body.category,
            tag: body.tag,
            country: body.country,
            state: body.state,
            city: body.city,
            venue: body.venue,
            eventDate: body.eventDate,
            startTime: body.startTime,
            endTime: body.endTime,
            shortDescription: body.shortDescription,
            longDescription: body.longDescription
        });
        await event.save();
        res.status(201).json({ message: 'Event saved successfully', event });
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(500).json({ message: 'Failed to save event', error: error.message });
    }
}   




module.exports = {
    handleCategory,
    handleTag,
    handleEvent
}
