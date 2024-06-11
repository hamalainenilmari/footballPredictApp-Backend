const mongoose = require('mongoose')
//import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true
    },
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
    }
})

matchSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Match', matchSchema)