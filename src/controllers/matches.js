const axios = require('axios');
const matchesRouter = require('express').Router()
const Match = require('../models/match')
const uuid = require('uuid');


matchesRouter.post('/', async (request, res) => {
    const {date} = request.body
    console.log("date:" + request.body)
    /*
    if (!date) {
        return res.status(400).send('date parameter is required');
    }*/

    const matches = []
    /*
    try {
        const matches = await Match.find({ date: date });
        res.json(matches);
    } catch (error) {
        console.error(`Error fetching matches by date: ${date}`, error);
        res.status(500).send('Error fetching matches');
    */
    if (1 == 1) {
        try {
            const matchResponse = await axios.get(
                `https://v3.football.api-sports.io/fixtures?from=2024-06-14&to=2024-07-15&league=4&season=2024`, {
                headers: {'x-apisports-key': process.env.x_apisports_key}
            });
            console.log("matchData: " + matchResponse.data.response)
            for (const matchDay of matchResponse.data.response) {
                const { teams, fixture, goals } = matchDay;
                let winner
                const matchDate = fixture.date
                console.log(matchDate)
                console.log("here")
                if (teams.home.winner === null && teams.away.winner === null) { winner = null } else {winner = teams.home.winner !== false ? teams.home.name : teams.away.name}
                
                const newMatch = new Match({
                    date: matchDate,
                    home: teams.home.name,
                    homeLogo: teams.home.logo,
                    away: teams.away.name,
                    awayLogo: teams.away.logo,
                    homeGoals: goals.home ? goals.home : null,
                    awayGoals: goals.away ? goals.away : null,
                    winner: winner
                })
                const existingMatch = await Match.findOne({
                    date: newMatch.date,
                    home: newMatch.home,
                    away: newMatch.away
                });

                if (existingMatch) {
                    console.log("Match already exists:", JSON.stringify(existingMatch));
                    matches.push(existingMatch); // Optionally, add existing match to the response array
                } else {
                    const savedMatch = await newMatch.save()
                    console.log("Match saved successfully:", JSON.stringify(savedMatch));
                    matches.push(savedMatch)
                    console.log(JSON.stringify(savedMatch));
                }
            }
            res.json(matches);
        } catch (error) {
            console.log("error fetching match data:", error);
            res.status(500).send(`error fetching match data: ${error}`)
        }
    }
})

matchesRouter.get('/', async (req, res) => {
    try {
        const matches = await Match.find({});
        res.json(matches);
    } catch (error) {
        console.error(`Error fetching matches`, error);
        res.status(500).send('Error fetching matches');
    }
})

matchesRouter.get('/id/:id', async (req, res) => {
    try {
        console.log(typeof req.params.id)
        const match = await Match.findOne({matchId: req.params.id});
        if (!match) {
            // No predictions found for the provided username
            return res.status(404).send('No match found from the id');
        }
        res.json(prediction);
    } catch (error) {
        console.error(`Error fetching match by id`, error);
        res.status(500).send('Error fetching match by id');
    }
})

module.exports = matchesRouter