const mongoose = require('mongoose');

const bookingDetailsSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    numberOfSeats: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('BookingDetails', bookingDetailsSchema);