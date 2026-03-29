const mongoose = require('mongoose');
const Country = require('./countries');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true,
    },
    venue: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true, 
    },
    endTime: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
