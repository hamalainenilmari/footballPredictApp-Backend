const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('../app')

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body
    //if (!name) name = username
    console.log(request.body)

    if (password.length < 3) {
        return response.status(400).json({error: 'password length must be atleast 3 characters'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.get('/:username', async (req, res) => {
    try {
        console.log("searching for player: " + req.params.username)
        const user = await User.find({username: req.params.username})

        if (!user) {
            // No predictions found for the provided username
            return res.status(404).send('No user found for the provided username');
        }
        res.json(user);
    } catch (error) {
        console.error(`Error fetching user by username`, error);
        res.status(500).send('Error fetching user by username');
    }
})

module.exports = usersRouter