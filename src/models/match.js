const mongoose = require('mongoose');
const uuid = require('uuid');
//import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
    date: String,
    id: { type: String, default: uuid.v4 },
    home: {
        type: String,
        required: true,
    },
    homeLogo: {
        type: String
    },
    awayLogo: {
        type: String
    },
    away: {
        type: String,
        required: true
    },
    homeGoals: {
    },
    awayGoals: {
    },
    winner: {
    },
    homeGoalsAET: {
    },
    awayGoalsAET: {
    },
    pen: {},
})

matchSchema.index({ date: 1, home: 1, away: 1 }, { unique: true });

matchSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Match', matchSchema)