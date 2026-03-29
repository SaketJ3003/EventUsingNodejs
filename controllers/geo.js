const Country = require('../models/countries');
const State  = require('../models/states');
const City   = require('../models/cities');

async function handleCountry(req,res) {
    const body = req.body;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');
    try {
        const country = new Country({
            name: body.name,
            slug: slug
        });
        await country.save();
        res.status(201).json({ message: 'Country saved successfully', country });
    } catch (error) {
        console.error('Error saving country:', error);
        res.status(500).json({ message: 'Failed to save country', error: error.message });
    }   
}

async function handleState(req,res) {
    const body = req.body;
    // console.log('Received state data:', body);
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');
    try {
        const state = new State({
            name: body.name,
            slug: slug,
            country: body.country 
        });
        await state.save();
        res.status(201).json({ message: 'State saved successfully', state });
    } catch (error) {
        console.error('Error saving state:', error);
        res.status(500).json({ message: 'Failed to save state', error: error.message });
    }   
}

async function handleCity(req,res) {
    const body = req.body;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');
    try {
        const city = new City({
            name: body.name,
            slug: slug,
            state: body.state 
        });
        await city.save();
        res.status(201).json({ message: 'City saved successfully', city });
    } catch (error) {
        console.error('Error saving city:', error);
        res.status(500).json({ message: 'Failed to save city', error: error.message });
    }   
}


module.exports = {
    handleCountry,
    handleState,
    handleCity
}
