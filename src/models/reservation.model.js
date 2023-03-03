const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    dates: {
        checkIn: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= new Date();
                },
                message: "Check-in date must be after or equal to today's date"
            }
        },
        checkOut: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= this.dates.checkIn;
                },
                message: "Check-out date must be after check-in date"
            }
        }
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    place:
    {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Place",
        required: true
    }
    ,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    status:
    {
        type: String,
        enum: ["WAITING", "ACCEPTED", "REFUSED", "CANCELLED"],
        default: "WAITING"
    }
})

module.exports = mongoose.model('Reservation', reservationSchema)