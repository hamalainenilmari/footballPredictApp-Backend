const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body
    console.log('logging in with credentials: '+ username + password)

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    console.log(process.env.SECRET)

    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60*10 }
      )

    response
        .status(200)
        .send({token, username: user.username, name: user.name})
})

module.exports = loginRouter

/*
app.post('/api/users', (request, response, next) => {
    const body = request.body
    console.log(body)
  
    // input validation
    if (!body.name) {
      return response.status(400).json({
        error: 'name missing'
      })
    } else if (!body.username) {
        return response.status(400).json({
          error: 'username missing'
      })
     } else if (!body.password) {
        return response.status(400).json({
          error: 'password missing'
        })
    } else {
      // check if user already exists
      User.find({}).then(users => {
        const userCheck = users.filter(user => user.username === body.username)
        console.log(userCheck)
  
        if (userCheck.length > 0) {
          app.put()
          const user = {
            name: body.name,
            username: body.username,
            password: body.password
          }
  
          console.log('already in')
          console.log(userCheck[0].id)
          User.findByIdAndUpdate(userCheck[0].id, user, { new: true })
            .then(updatedUser => {
              response.json(updatedUser)
            })
            .catch(error => next(error))
        } else {
          console.log('new name')
          const user = new User({
            name: body.name,
            username: body.username,
            password: body.password
          })
  
          user.save().then(savedUser => {
            response.json(savedUser)
          })
            .catch(error => next(error))
        }
      })
  
  
    }})
      */