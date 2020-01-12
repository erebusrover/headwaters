const express = require('express');
const {
  insertUserMedsHistory,
  getUserMedHistory,
  patchUserMedHistory,
  getUserMedications
} = require('../server/db/connection');

const trackerRouter = express.Router();


//endpoint to get all user med history from db
trackerRouter.get('/:userId/history', (req, res) => {
  const { userId } = req.params;
  getUserMedHistory(userId)
    .then(medHistory => {
      res.send(medHistory);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

//endpoint to post user med history to db
trackerRouter.post('/:userId/history', (req, res) => {
  const { userId } = req.params;
  let { medId, freq, date} = req.body;
  
  insertUserMedsHistory(userId, medId, {date, freq})
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(501);
    });
});

//endpoint to update user med history on db
trackerRouter.patch('/:userId/events/:medId', (req, res) => {
  const { userId, medId } = req.params;
  const medHistoryObj = req.body[0];

  patchUserMedHistory(medHistoryObj, userId, medId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(418);
    });
});


module.exports = trackerRouter;