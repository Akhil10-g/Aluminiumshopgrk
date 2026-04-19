const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const homepageSchema = new mongoose.Schema(
  {
    hero: {
      founderImage: {
        type: String,
        default: '',
        trim: true,
      },
      workImages: {
        type: [String],
        default: [],
      },
    },
    services: {
      type: [itemSchema],
      default: [],
    },
    materials: {
      type: [itemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Homepage', homepageSchema);
