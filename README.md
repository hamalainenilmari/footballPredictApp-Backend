# Football Match Prediction App – Backend

Backend server for a football match prediction web app built for UEFA Euro 2024. The backend provides RESTful APIs for user authentication, match data retrieval, prediction submission, scoring logic, and leaderboard computation.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Cron

## Features

* User registration and login with secure password hashing
* JWT-based authentication for protected routes
* REST APIs for:
  * Fetching upcoming matches
  * Submitting user predictions
  * Viewing past predictions
  * Getting real-time leaderboard
* Cron job for:
  * Automatically fetching match results from a public API
  * Evaluating predictions and updating scores
