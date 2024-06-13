const mongoose = require('mongoose')
const uuid = require('uuid');
//import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true
    },
    name: {
        type: String
    },
    id: { type: String, default: uuid.v4 },
    // TODO add matches etc
    passwordHash: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
  })

module.exports = mongoose.model('User', userSchema)