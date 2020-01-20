const express = require('express');
const {
  getUserJournalEntries,
  addJournalEntry,
} = require('../server/db/connection');

const journalRouter = express.Router();

// @Route --> GET '/:userId/entries'
// @Desc --> Get a user's journals from database
journalRouter.get('/:userId/entries', (req, res) => {
  const { userId } = req.params;
  getUserJournalEntries(userId)
    .then(journalRows => {
      res.send(journalRows);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

// @Route --> POST '/:userId/entries'
// @Desc --> Post a user's journal entry to database
journalRouter.post('/:userId/entries', (req, res) => {
  const { userId } = req.params;
  const newJournalEntryObj = req.body[0];

  addJournalEntry(newJournalEntryObj, userId)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(501);
    });
});

module.exports = journalRouter;
