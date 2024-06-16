const calculatePoints = (match, prediction) => {

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