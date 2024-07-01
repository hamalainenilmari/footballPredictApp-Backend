const axios = require('axios');
const Match = require('../models/match')
const User = require('../models/user')
const Prediction = require('../models/prediction')
const logger = require('../utils/logger')
const calculatePoints = require('../utils/calculatePredictionPoints');
const e = require('cors');

// This function fetches matches from the API
const fetchMatches = async () => {

  try {  
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate =  `${year}-${month}-${day}`;
    //const formattedDate = "2024-06-30"
    
    logger.info("starting to fetch new matches at" + date)
    

    // get all fixtures from the cup
    const response = await axios.get(`https://v3.football.api-sports.io/fixtures?from=${formattedDate}&to=2024-07-15&league=4&season=2024`, {
      headers: {'x-apisports-key': process.env.x_apisports_key}});

    // loop through every fixture
    for (const matchDay of response.data.response) {
        const {fixture, teams , goals, score } = matchDay;
        // check if the match has ended
        if (fixture.status.short === "FT" || fixture.status.short === "AET" ) {
          logger.info("Ended match found: " + teams.home.name + " - " + teams.away.name)
          // insert winner (team name as string) according to fixture result
          let winner = teams.home.winner ? teams.home.name : teams.away.winner ? teams.away.name : 'draw'
          // search for the match in database according to the unique datetime of the match and if not already updated (by checking if winner=null)
          // update the match to contain the goals and the winner
          if (winner === "Türkiye") winner = "Turkey"
          const updatedMatch = await Match.findOneAndUpdate(
              { date: `${fixture.date}`, home: teams.home.name, winner: null }, // Filter condition
              { $set: { 
                  homeGoals: score.fulltime.home,
                  awayGoals: score.fulltime.away,
                  homeGoalsAET: goals.home,
                  awayGoalsAET: goals.away,
                  winner: winner
              } },
              { new: true } // To return the updated document
            )
            if (updatedMatch) {
              logger.info("success updating match " + updatedMatch);
            }
           
        } else {
            const newMatch = new Match({
              date: fixture.date,
              home: teams.home.name,
              homeLogo: teams.home.logo,
              away: teams.away.name,
              awayLogo: teams.away.logo,
              homeGoals: teams.home.goals,
              awayGoals: teams.away.goals,
              winner: null
          })
          const existingMatch = await Match.findOne({
              date: newMatch.date,
              home: newMatch.home,
              away: newMatch.away
          });

          if (existingMatch) {
              console.log("Match already exists:", JSON.stringify(existingMatch));
          } else {
              const savedMatch = await newMatch.save()
              console.log("Match saved successfully:", JSON.stringify(savedMatch));
              console.log(JSON.stringify(savedMatch));
          }

      }
  }
    
    // update the points
    const users = await User.find()
    // loop through users
    for (const user of users) {
      // get predictions by the user
      const predictions = await Prediction.find({username: user.username})
      // loop through users predictions
      for (const prediction of predictions) {
        // find corresponding match which is ended (has winner)
        const match = await Match.findOne({
          id: prediction.matchId, 
          winner: { $ne: null }, 
          homeGoals: { $ne: null }, 
          awayGoals: { $ne: null }
        })
        if (!match) {
          logger.error("error finding match by the prediction matchId of match " + 
            prediction.home + " - " + prediction.away )
        } else {
          // get points from the prediction
            const points = calculatePoints(match, prediction)
            const updatedPrediction = await Prediction.findOneAndUpdate(
              { id: prediction.id},
              { $set: { points: points} },
              { new: true }
            )
            if (updatedPrediction) {
              logger.info("success adding points to prediction " + updatedPrediction);
            }
        }
      }
      const updatedPredictions = await Prediction.find({username: user.username})
      let totalPoints = 0
      for (const pred of updatedPredictions) {
        totalPoints += pred.points
      }
      const updatedUser = await User.findOneAndUpdate(
        {username: user.username},
        { $set: { points: totalPoints} },
        { new: true}
      )
      if (updatedUser) {
        logger.info('Updated user totalpoints: ' + updatedUser);
      }
    }
  } catch (error) {
    logger.info('Error updating matches: ' + error);
  }
};

module.exports = { fetchMatches };
