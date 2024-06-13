const axios = require('axios');
const predictionsRouter = require('express').Router()
const Prediction = require('../models/prediction')
const User = require('../models/user')
const Match = require('../models/match');
const { request } = require('../app');

predictionsRouter.post('/', async (request, res) => {

    const {username, matchId, home, away, homeGoals, awayGoals, winner} = request.body
    console.log(JSON.stringify(request.body))
    if ( !username | !matchId | !home | !away | !homeGoals | !awayGoals | !winner) {
        return res.status(400).send('missing parameters');
    }

   
    if (1 == 1) {
        try {   
            const user = await User.findOne({ username: username });
            const match = await Match.findOne({id: matchId})
            if (!user) {
                console.log('userId not found')
                return res.status(400).send('userId not found');
            }
            if (!match) {
                console.log('matchId not found')
                return res.status(400).send('matchId not found');
            }


            const newPrediction = new Prediction({
                username: username,
                matchId: matchId,
                home: home,
                away: away,
                homeGoals: homeGoals,
                awayGoals: awayGoals,
                winner: winner
            })
            const existingPrediciton = await Prediction.findOne({
                username: username,
                matchId: matchId,
            });

            if (existingPrediciton) {
                console.log("Prediction already exists:", JSON.stringify(existingPrediciton));
            } else {
                const savedPrediction = await newPrediction.save()
                console.log("Prediction saved successfully:", JSON.stringify(savedPrediction));
            }
        }
         catch (error) {
            console.log("error saving a prediction to the server:", error);
            res.status(500).send(`error saving a prediction to the server: ${error}`)
        }
    }
})

predictionsRouter.get('/', async (req, res) => {
    try {
        const predictions = await Prediction.find({});
        res.json(predictions);
    } catch (error) {
        console.error(`Error fetching predictions`, error);
        res.status(500).send('Error fetching predictions');
    }
})

predictionsRouter.get('/id/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const prediction = await Prediction.findOne({id: req.params.id});
        if (!prediction || prediction === 0) {
            // No predictions found for the provided username
            return res.status(404).send('No prediction found from the id');
        }
        res.json(prediction);
    } catch (error) {
        console.error(`Error fetching prediction by id`, error);
        res.status(500).send('Error fetching prediction by id');
    }
})

predictionsRouter.get('/username/:username', async (req, res) => {
    try {
        console.log(req.params.username)
        const predictionsById = await Prediction.find({username: req.params.username})

        if (!predictionsById || predictionsById.length === 0) {
            // No predictions found for the provided username
            return res.status(404).send('No predictions found for the provided username');
        }
        res.json(predictionsById);
    } catch (error) {
        console.error(`Error fetching prediction by username`, error);
        res.status(500).send('Error fetching prediction by username');
    }
})

module.exports = predictionsRouter
