const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    day: {
        type: Number,
        required: [true, 'Please indicate Day'],
    },
    duration: {
      type: Number,
      required: [true, 'Please add a duration'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
    },
    topic: {
      type: [String],
      required: [true, 'Please add at least one topic'],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: 'Topic array must have at least one item',
      },
    },
    link: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Record', recordSchema);