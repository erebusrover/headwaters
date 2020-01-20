const express = require('express');
const { saveToGoogleCal } = require('../server/googleAxios');

const googleRouter = express.Router();

//get the calendar id from the currently logged in user, send it to the server, save it, send it to google

googleRouter.post('/posting', (req, res) => {
  const body = req.body;
  console.log('hit the router')
  saveToGoogleCal(body)
    .then(() => {
      res.sendStatus(201);
      console.log('that event has been routed to your google calendar!')
    })
    .catch((err) => {
      res.sendStatus(404);
      console.log('couldnt route that event to your google calendar!', err)

    });
});



module.exports = googleRouter;