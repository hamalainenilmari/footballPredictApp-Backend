const axios = require('axios');
const Match = require('../models/match')
const User = require('../models/user')
const Prediction = require('../models/prediction')
const logger = require('../utils/logger')
const calculatePoints = require('../utils/calculatePredictionPoints')

// This function fetches matches from the API
const fetchMatches = async () => {
  logger.info("starting to fetch new matches")

  try {
    //const updates = await Prediction.updateMany({}, { $set: { points: null } })
    // get all fixtures from the cup
    /*
    const response = await axios.get(`https://v3.football.api-sports.io/fixtures?from=2024-06-14&to=2024-07-15&league=4&season=2024`, {
      headers: {'x-apisports-key': process.env.x_apisports_key}});

    // loop through every fixture
    for (const matchDay of response.data.response) {
        const {fixture, teams , goals } = matchDay;
        logger.info(``  + fixture.status.short)
        // check if the match has ended
        if (fixture.status.short === "FT") {
          // insert winner (team name as string) according to fixture result
          const winner = teams.home.winner ? teams.home.name : teams.away.winner ? teams.away.name : 'draw'
          // search for the match in database according to the unique datetime of the match and if not already updated (by checking if winner=null)
          // update the match to contain the goals and the winner
          const updatedDoc = await Match.findOneAndUpdate(
              { date: `${fixture.date}`, winner: null }, // Filter condition
              { $set: { 
                  homeGoals: goals.home,
                  awayGoals: goals.away,
                  winner: winner
              } },
              { new: true } // To return the updated document
            )
            logger.info("success updating match ");
        }
    }
    */
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
          logger.error("error finding match by the prediction matchId")
        } else {
          // get points from the prediction
            const points = calculatePoints(match, prediction)
            const updatedPrediction = await Prediction.findOneAndUpdate(
              { id: prediction.id},
              { $set: { points: points} },
              { new: true }
            )
            logger.info("success adding points to prediction ");
        }
      }
      const updatedPredictions = await Prediction.find({username: user.username})
      let totalPoints = 0
      for (const pred of updatedPredictions) {
        totalPoints += pred.points
      }
      await User.findOneAndUpdate(
        {username: user.username},
        { $set: { points: totalPoints} },
      )
      logger.info('Updated user totalpoints: ');
    }
  } catch (error) {
    logger.info('Error updating matches: ' + error);
  }
};

module.exports = { fetchMatches };


    /*
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    logger.info("date"formattedDate)
    */