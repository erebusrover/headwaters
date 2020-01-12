/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Container } from 'reactstrap';
import { useAuth0 } from '../react-auth0-spa.jsx';
import '../styles/event-form.css';

const JournalHistory = () => {
  const { user } = useAuth0();
  const [userId] = useState(user.id);
  const [journals, setJournals] = useState([])

  useEffect(() => {
    async function getUserEntries(userId) {
      return await axios
      .get(`/journal/${userId}/entries`)
      .then(res => {
        setJournals(res.data);
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
    }
    getUserEntries(userId);
  }, []);
  
  
  return (
    <Container>
      <div className="journal-entry-form">
        <h1 style={{ color: '#1B2F44', fontWeight: 'bolder', paddingLeft: '5px', paddingTop: '10px' }}>Journal History</h1>
        <div>
          {journals.reverse().map(journal =>
          <div>
            <div style={{
              borderStyle: 'solid', 
              borderColor: '#ffffff', 
              borderRadius: '15px',
              padding: 10, 
              margin: 10, 
              backgroundColor: 'rgba(255, 255, 255, 0.4)'}} key={journal.id}>
              <div style={{ fontWeight: 'bolder', fontSize: '140%', color: '#1B2F44' }}>{moment(journal.date).format('MMMM Do YYYY')}</div>
              
              <div><strong>Journal Entry:</strong> {journal.text} </div>
              <div><strong>Feeling:</strong> {journal.status} </div>
              <div><strong>sleep:</strong> {journal.sleep} hours</div>
              <div><strong>Water Intake:</strong> {journal.h2oz}oz</div>
              <div><strong>Exercize:</strong> {journal.exercise} min</div>
              <div><strong>Nutrition Notes:</strong> {journal.nutrition}</div>
            </div>
            </div>
          )}
        </div>
      </div>
      <br />
    </Container>
  );
};

export default JournalHistory;
