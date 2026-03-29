const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const City = mongoose.model('City', citySchema);
module.exports = City;