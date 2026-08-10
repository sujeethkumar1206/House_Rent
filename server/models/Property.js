const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Independent House', 'PG', 'Studio', 'Commercial'],
      required: true
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    parking: { type: Boolean, default: false },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Unfurnished'
    },
    area: { type: Number, default: 0 }, // in sqft
    amenities: [{ type: String }],
    images: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

// Text index for search
PropertySchema.index({ title: 'text', location: 'text', city: 'text' });

module.exports = mongoose.model('Property', PropertySchema);
