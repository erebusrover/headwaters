/* eslint-disable no-shadow */
const mysql = require('mysql');
// const bcrypt = require('bcrypt');
const { promisify } = require('util');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'waters';

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  multipleStatements: true,
});

// user helpers

const query = promisify(connection.query).bind(connection);

const checkUsername = username => {
  // checks if a given username is found in db
  // returns a boolean
  const usernameSQL = 'select * from users where username = ?';
  return query(usernameSQL, [`${username}`])
    .then(content => {
      if (content.length) {
        return true;
      }
      return false;
    })
    .catch(err => {
      console.log(err);
    });
};

// example how to use:
// checkUsername('jeanluc')
// .then(result => {
//   console.log(result);
// })
// .catch(err => {
//     console.error(err);
// });

const checkEmail = email => {
  // checks if a given email is found in db
  // returns a boolean
  const emailSQL = 'select * from users where email = ?';
  return query(emailSQL, [`${email}`])
    .then(content => {
      if (content.length) {
        return true;
      }
      return false;
    })
    .catch(err => {
      console.log(err);
    });
};

// example how to use:
// checkEmail('captain@enterprise.space')
// .then(result => {
//   console.log(result);
// })
// .catch(err => {
//     console.error(err);
// });

const newUser = (username, email) => {
  // creates user with given input
  // protect against injection attacks
  const userValues = [`${username}`, `${email}`];
  const newUserSQL = 'insert into users(username, email) values(?, ?)';
  return query(newUserSQL, userValues);
};

// usage example
// newUser('jeanluc', 'captain@enterprise.space')
//   .then(queryOK => {
//     console.log(queryOK);
//   })
//   .catch(err => {
//     console.error(err);
//   });

const findUser = username => {
  // select user from database who matches user
  const findByUsername = 'select * from users where username = ?';
  return query(findByUsername, [`${username}`]);
};

// findUser('jeanluc')
// .then(userRows => {
//   console.log(userRows);
// })
// .catch(err => {
//   console.error(err);
// });

const findUserByEmail = email => {
  // select user from database who matches user
  const findByEmail = 'select * from users where email = ?';
  return query(findByEmail, [`${email}`]);
};

/*
 * Calendar Helpers
 * listed below
 */

const getUserEvents = userId => {
  // retrieves all rows from events table that match userId
  const selectEventsByUserId = 'select * from events where event_id_user = ?';
  return query(selectEventsByUserId, [`${userId}`]);
};

const insertUserEvent = newEventObj => {
  const {
 userId, name, dateTime, notes, prac, type, locale 
} = newEventObj;
  const eventFieldValues = [
    `${userId}`,
    `${name}`,
    `${dateTime}`,
    `${notes}`,
    `${prac}`,
    `${type}`,
    `${locale}`,
  ];
  const newEventSQL =    'insert into events(event_id_user, name, date_time, notes, practitioner, type, location) values(?, ?, ?, ?, ?, ?, ?)';
  return query(newEventSQL, eventFieldValues);
};

const deleteUserEvent = (userId, eventId) => {
  const deletionFields = [`${userId}`, `${eventId}`];
  const deleteEventSQL =    'delete from events where event_id_user = ? and id = ?';
  return query(deleteEventSQL, deletionFields);
};

const patchUserEvent = (editEventObj, userId, eventId) => {
  const {
  dateTime, editNotes, editType, locale, name, prac 
} = editEventObj;

  const patchFields = [
    `${name}`,
    `${dateTime}`,
    `${editNotes}`,
    `${prac}`,
    `${editType}`,
    `${locale}`,
  ];

  const updateEventSQL = `update events set name = ?, date_time = ?, notes = ?, practitioner = ?, type = ?, location = ? where id = ${eventId} and event_id_user = ${userId}`;
  return query(updateEventSQL, patchFields);
};

/*
 * Journal Helpers
 * listed below
 */

const getUserJournalEntries = userId => {
  const selectEntriesByUserId =    'select * from journals where journal_id_user = ?';
  return query(selectEntriesByUserId, [`${userId}`]);
};

const addJournalEntry = (journalEntryObj, userId) => {
  const {
    date,
    text,
    status,
    h2oz,
    nutrition,
    sleep,
    exercise,
  } = journalEntryObj;

  const entryFieldValues = [
    `${date}`,
    `${text}`,
    `${status}`,
    `${h2oz}`,
    `${nutrition}`,
    `${sleep}`,
    `${exercise}`,
    `${userId}`,
  ];

  const newEntrySQL =    'insert into journals(date, text, status, h2oz, nutrition, sleep, exercise, journal_id_user) values(?, ?, ?, ?, ?, ?, ?, ?)';
  return query(newEntrySQL, entryFieldValues);
};

/*
 * Pillbox Helpers
 * listed below
 */

const getUserMedications = userId => {
  // takes in user's id
  // retrieves all medications stored for user @ user_meds
  // user_meds is a join table

  // SELECT name, url, dosage, frequency, scheduled_times, practitioner, notes
  // FROM meds, images, users_meds
  // WHERE users_meds_user = 1;
  // +-----------+-------------+--------+-----------+-----------------+--------------+--------------+
  // | name      | url         | dosage | frequency | scheduled_times | practitioner | notes        |
  // +-----------+-------------+--------+-----------+-----------------+--------------+--------------+
  // | grapjuice | thismed.jpg |      2 |         2 | [13:00]         | dr.crusher   | away vaccine |
  // +-----------+-------------+--------+-----------+-----------------+--------------+--------------+

  debugger;
  const userMedicationsSQL =    'SELECT name, url, dosage, frequency, scheduled_times, date_time, practitioner, users_meds_med, notes FROM meds m inner join images i on m.id = i.meds_id inner join users_meds u on u.users_meds_med = m.id WHERE users_meds_user = ?';
  return query(userMedicationsSQL, [`${userId}`]);
};

const insertIntoMeds = (userId, med) => {
  // takes in a userId and a medication name
  // adds both to meds table
  // query returns row with med id
  ;
  const medicationFields = [`${userId}`, `${med}`];
  const medicationSQL = 'insert into meds(med_id_user, name) values(?, ?)';
  const getMedId = 'SELECT LAST_INSERT_ID()';

  return query(medicationSQL, medicationFields)
    .then(() => {
      return query(getMedId);
    })
    .catch(err => console.error(err));
};

const insertIntoImages = (url, medId) => {
  // takes in a medication img url
  // adds both to imgs table
  // query returns row with image id

  const imageFields = [`${url}`, `${medId}`];
  const imageSQL = 'insert into images(url, meds_id) values(?, ?)';
  const getImgId = 'SELECT LAST_INSERT_ID()';
  return query(imageSQL, imageFields)
    .then(() => {
      return query(getImgId);
    })
    .catch(err => console.error(err));
};

const insertIntoUsersMeds = (userId, medId, imgId, newMedicationObj) => {
  // insert into users_meds(users_meds_user, users_meds_med, id_img, dosage, frequency, scheduled_times, practitioner, notes) values(1, 3, 1, 2, 2, '[13:00]', 'dr.crusher', 'away vaccine');
  const {
  dosage, frequency, times, practitioner, notes , dateTime
} = newMedicationObj;
  debugger;
  const medicationFields = [
    `${userId}`,
    `${medId}`,
    `${imgId}`,
    `${dosage}`,
    `${frequency}`,
    `${times}`,
    `${dateTime}`,
    `${practitioner}`,
    `${notes}`,
  ];


  const userMedicationsSQL =    'insert into users_meds(users_meds_user, users_meds_med, id_img, dosage, frequency, scheduled_times, date_time, practitioner, notes) values(?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  return query(userMedicationsSQL, medicationFields);
};

const addUserMedicationMaster = (newMedicationObj, userId) => {
  // takes in a userId and a medication values object
  // will need to add userId, name to meds table (2nd helper?)
  // will need to add url to images table (2nd helper?)
  // will need to add userId, medId, imgId, dosage, frequency, scheduled_times, practitioner, notes to users_meds
  const { med, url } = newMedicationObj;
  const medIdInsertion = async() => {
    const medIdResponse = await insertIntoMeds(userId, med);
    return medIdResponse;
  };

  const imageIdInsertion = async(imgUrl, mId) => {
    const imageIdResponse = await insertIntoImages(imgUrl, mId);
    return imageIdResponse;
  };

  return medIdInsertion().then(medIdArray => {
    let medId = Object.values(medIdArray)[0];
    medId = medId['LAST_INSERT_ID()'];
    imageIdInsertion(url, medId).then(imgIdArray => {
      let imgId = Object.values(imgIdArray)[0];
      imgId = imgId['LAST_INSERT_ID()'];
      return insertIntoUsersMeds(userId, medId, imgId, newMedicationObj);
    });
  });
};

const createUserMedEvents = (userId, medObj) => {
  // will create an event for the user *for each submitted time with:
  // userId, name = name of medication
  // date_time
  // repeated daily somehow ?
  // for all medications in users database
  // notes = medication notes
  // practitioner (needs to be added as field on medication submit)
  // type (medication)
  // location null
  // will be retrieved on calendar load like other events
};

const insertUserMedsHistory = (userId, medId, freqObj) => {
  const { date, freq } = freqObj;
  debugger;
  const historyFields = [
    `${userId}`,
    `${medId}`,
    `${date}`,
    `${freq}`,
  ];
  const medsHistorySQL = 'insert into meds_history(meds_history_user, meds_history_med, date_time, frequency_taken) values(?, ?, ?, ?)';
  return query(medsHistorySQL, historyFields);
};

const getUserMedHistory = userId => {
  const selectHistoryByUserId = 'select * from meds_history where meds_history_user = ?';
  return query(selectHistoryByUserId, [`${userId}`]);
};

const patchUserMedHistory = (userId, medId, freq) => {
  const historyFields = [
    `${freq}`,
  ];
  const updateHistorySQL = `update meds_history set frequency_taken = ? where meds_history_user = ${userId} and meds_history_med = ${medId}`;
  return query(updateHistorySQL, historyFields);
};

module.exports = {
  connection,
  DB_NAME,
  checkUsername,
  checkEmail,
  newUser,
  findUser,
  findUserByEmail,
  getUserEvents,
  insertUserEvent,
  getUserMedications,
  insertIntoUsersMeds,
  addUserMedicationMaster,
  insertIntoMeds,
  insertIntoImages,
  getUserJournalEntries,
  addJournalEntry,
  createUserMedEvents,
  deleteUserEvent,
  patchUserEvent,
  insertUserMedsHistory,
  getUserMedHistory,
  patchUserMedHistory,
};
