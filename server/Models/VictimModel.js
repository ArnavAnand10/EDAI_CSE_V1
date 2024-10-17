const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password : {type:String, required: true},
  phone: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  problemStatements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Victim = mongoose.model('Victim', victimSchema);

module.exports = Victim;