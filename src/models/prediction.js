const mongoose = require('mongoose')
const uuid = require('uuid');

const predictionSchema = new mongoose.Schema({
    id: { type: String, default: uuid.v4 },
    username: {
        type: String,
        required: true
    },
    matchId: {
        type: String
    },
    home: {
        type: String,
        required: true,
    },
    away: {
        type: String,
        required: true
    },
    homeGoals: {
        type: Number,
        required: true
    },
    awayGoals: {
        type: Number,
        required: true
    },
    winner: {
        type: String,
        required: true
    }
})


predictionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Prediction', predictionSchema)