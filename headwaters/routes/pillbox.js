const express = require('express');
const { 
  addUserMedicationMaster, 
  getUserMedications,
} = require('../server/db/connection');

const pillboxRouter = express.Router();

// @Route --> GET '/:userId'
// @Desc --> Get a user's pillbox from database
pillboxRouter.get('/:userId', (req, res) => {
  const { userId } = req.params;

  getUserMedications(userId)
    .then(medRows => {
      res.send(medRows);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

// @Route --> POST '/:userId'
// @Desc --> post user's pillbox input data to database
pillboxRouter.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const newMedicationObj = req.body[0];

  addUserMedicationMaster(newMedicationObj, userId)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(501);
    });
});

module.exports = pillboxRouter;
