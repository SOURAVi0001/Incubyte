const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      price: {
            type: Number,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      imageUrl: {
            type: String,
            required: true
      },
      category: {
            type: String,
            default: 'General'
      },
      quantity: {
            type: Number,
            required: true,
            default: 0
      }
}, { timestamps: true });

module.exports = mongoose.model('Sweet', sweetSchema);
