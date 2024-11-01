const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password : {type:String, required: true},
  phone: { type: String, required: true },
  location: {
    type: [Number],
  },
  preferences: {
    categories: [{ type: String }],
    alertRadius: { type: Number }
  },
  availability: {
    status: { type: String, default: 'available' },
    lastActive: { type: Date, default: Date.now }
  },
  historicalData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    },
   
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
