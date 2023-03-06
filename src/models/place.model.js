const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  types: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypePlace",
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  pricing: {
    perDay: Number
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
          return value.length >= 5;
      },
      message: "Your place must contain at least 5 images"
  }
  },
  capacity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 500
  },
  address: {
    country: String,
    city: String,
    street: String,
    zipCode: {
      type: Number,
      maxLength: 5,
      minLength: 5
    },
    gps: {
      lat: Number,
      long: Number
    }

  }
})

module.exports = mongoose.model('Place', placeSchema)