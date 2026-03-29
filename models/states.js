const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const State = mongoose.model('State', stateSchema);

module.exports = State;