const mongoose = require('mongoose');

const factSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Politics', 'Health', 'Science', 'Technology'],
      required: true,
    },
    verdict: {
      type: String,
      enum: ['True', 'False', 'Misleading', 'Unverified'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FactCheck', factSchema);