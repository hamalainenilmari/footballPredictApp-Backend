const axios = require('axios');
const matchesRouter = require('express').Router()
const Match = require('../models/match')

matchesRouter.get('/', async (request, res) => {
    const {date} = request.body
    //if (!name) name = username
    console.log("date:" + request.body)

    try {
        const matchResponse = await axios.get(
            `https://v3.football.api-sports.io/fixtures?date=${date}&league=4&season=2024`, {
            headers: {'x-apisports-key': process.env.x_apisports_key}
        });
        //res.json(matchResponse.data);
        console.log("matchData: " + matchResponse.data.response[0].teams.home.name)
        const teams = matchResponse.data.response[0].teams
        const goals = matchResponse.data.response[0].goals
        if (teams) {
            let winner
            if (teams.home.winner === null && teams.away.winner === null) { winner = null } else {winner = teams.home.winner !== false ? teams.home.name : teams.away.name}
            //const winner = teams.home !== null ? teams.home : teams.away
            const match = new Match({
                matchId: 1,
                home: teams.home.name,
                homeLogo: teams.home.logo,
                away: teams.away.name,
                awayLogo: teams.away.logo,
                homeGoals: goals.home ? goals.home : null,
                awayGoals: goals.away ? goals.awat : null,
                winner: winner
                })
        
            const savedMatch = await match.save()
            res.json(savedMatch);
            console.log(JSON.stringify(savedMatch));
        
        }
    } catch (error) {
        console.log("error fetching match data:", error);
        res.status(500).send(`error fetching match data: ${error}`)
    }
})

module.exports = matchesRouter

const matches = [{
        matchId: 1,
        home: "germany",
        homeLogo: "https://media.api-sports.io/football/teams/25.png",
        away: "scotland",
        awayLogo:  "https://media.api-sports.io/football/teams/1108.png",
        homeGoals: null,
        awayGoals: null,
        winner: null,
}]