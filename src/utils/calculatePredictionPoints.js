const logger = require('../utils/logger')

const calculatePoints = (match, prediction) => {
    logger.info(`Calculating points for ${prediction.username}, match: ${match.home} ${match.homeGoals} - ${match.awayGoals} ${match.away}, pred: ${prediction.homeGoals}-${prediction.awayGoals}  `)
    if ((Number(match.homeGoals) === Number(prediction.homeGoals)) && (Number(match.awayGoals) === Number(prediction.awayGoals))) {
        return 10
    } else if (match.winner === prediction.winner){
        if ((Number(match.homeGoals) === Number(prediction.homeGoals)) || (Number(match.awayGoals) === Number(prediction.awayGoals))) {
            return 4
        } else {
            return 3
        }
    } else if ((Number(match.homeGoals) === Number(prediction.homeGoals)) || (Number(match.awayGoals) === Number(prediction.awayGoals))) {
        return 1
    } else {
        return 0
    }
}

module.exports = calculatePoints