const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const matchesRouter = require('./controllers/matches')
const predictionsRouter = require('./controllers/predictions')
const cron = require('node-cron'); // Import node-cron
const matchResultUpdater = require('./cronJons/matchResultUpdater'); // Import your file

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl)
  .then(result => {
    if (result) {
      logger.info('connected to MongoDB')
    }
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.get('/', (req, res) => {
  return res.status(200).send("ok")
})
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/predictions', predictionsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// use '*/30 * * * * *' for testing, runs every 30 secs
// use '*/15 * * * *' in production, runs every 15 minutes

cron.schedule('*/30 * * * * *', async () => {
  try {
    const now = new Date();
    const hour = now.getHours() + 3;
    logger.info("time now " + hour )
    if (hour >= 10) {
      logger.info('Cron job running...');
      await matchResultUpdater.fetchMatches();
    }
   } catch (err) {
    logger.error("error: " + err)
  }
  }
);

module.exports = app