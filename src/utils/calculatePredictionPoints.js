const logger = require('../utils/logger')

const calculatePoints = (match, prediction) => {
    logger.info(`Calculating points for ${prediction.username}, match: ${match.home} ${match.homeGoals} - ${match.awayGoals} ${match.away}, pred: ${prediction.homeGoals}-${prediction.awayGoals}  `)
    if ((Number(match.homeGoals) === Number(prediction.homeGoals)) && (Number(match.awayGoals) === Number(prediction.awayGoals))) {
        logger.info("calculated 10 points")
        return 10
    } else if (match.winner === prediction.winner){
        if ((Number(match.homeGoals) === Number(prediction.homeGoals)) || (Number(match.awayGoals) === Number(prediction.awayGoals))) {
            logger.info("calculated 4 points")
            return 4
        } else {
            logger.info("calculated 3 points")
            return 3
        }
    } else if ((Number(match.homeGoals) === Number(prediction.homeGoals)) || (Number(match.awayGoals) === Number(prediction.awayGoals))) {
        logger.info("calculated 1 point")
        return 1
    } else {
        logger.info("calculated 0 points")
        return 0
    }
}

module.exports = calculatePoints