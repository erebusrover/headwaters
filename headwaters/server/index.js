const express = require('express');
const https = require('https');
const path = require('path');
const { DB_NAME } = require('./db/connection');
const { checkEmail, newUser, findUserByEmail } = require('./db/connection');
const calendarRouter = require('../routes/calendar');
const journalRouter = require('../routes/journal');
const pillboxRouter = require('../routes/pillbox');
const googleRouter = require('../routes/google');
const apiRouter = require('../routes/api');
const medsTracker = require('../routes/tracker');

const app = express();
// Init Middleware
app.use(express.json({ extended: false }));

app.use('/calendar', calendarRouter);
app.use('/journal', journalRouter);
app.use('/pillbox', pillboxRouter);
app.use('/api', apiRouter);
//add route to hit google api
app.use('/eventAuth', googleRouter);
app.use('/tracker', medsTracker);


app.get('/api/auth', async(req, res) => {
  const payload = req.query;
  const validEmail = await checkEmail(payload.email);
  if (!validEmail) {
    res.json(false);
  } else {
    const foundUsers = await findUserByEmail(payload.email);
    res.json(foundUsers[0]);
  }
});

app.post('/api/auth', async(req, res) => {
  const payload = req.body;
  await newUser(payload.nickname, payload.email);
  const foundUsers = await findUserByEmail(payload.email);
  res.json(foundUsers[0]);
});

//jill edited below to route to google calendar
// app.post('/calendar/auth', async(req, res) => {
  // })
const PORT = process.env.PORT || 8080;
const CLIENT_PATH = path.join(__dirname, '../client/dist/');

app.use(express.static(CLIENT_PATH));

app.listen(PORT, () => {
  console.log(`Listening on :${PORT} 🛸`);
  console.log(`Connected to DB ${DB_NAME} 🐙`);
});
