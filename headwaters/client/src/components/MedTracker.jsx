/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAuth0 } from '../react-auth0-spa.jsx';
import { Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,  } from 'reactstrap';
import '../styles/event-form.css';
import {
  Timeline,
  Events,
  Button,
  UrlButton,
  TextEvent,
} from '@merc/react-timeline';
import Axios from 'axios';
import styled from 'styled-components';
// import Chronology from 'react-chronos';

const MedTracker = () => {
  const { user } = useAuth0();
  const [userId] = useState(user.id);
  //need the prescription and the pillhistory
  const [prescription, setPrescription] = useState([]);
  const [pillHistory, setPillHistory] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const getServerData = ()=>{
    Axios.get(`/pillbox/${userId}/`)
      .then(response => {
        const prescriptions = response.data.map(prescription => {
          prescription.medId = prescription.users_meds_med;
          prescription.medName = prescription.name;
          if (!prescription.medName) {
            prescription.medName = 'dummy data';
            console.log('prescription.medName was undefined')
          }
          if (!prescription.dosage) {
            prescription.dosage = 'dummy data';
            console.log('prescription.dosage was undefined')
          }
          if (!prescription.frequency) {
            prescription.frequency = 'dummy data';
            console.log('prescription.frequency was undefined')
          }
          return prescription
        });
        //  medName: "xanax",
        //     dosage: 2,
        //     frequency: "1x daily",
        //     scheduled_times: "often",
        //     practicioner: "bobby",
        //     notes: "lala",

        //todo this is the problem somehow
        setPrescription(prescriptions)
        console.log(prescriptions);
      })
    Axios.get(`/tracker/${userId}/history`)
      .then(response => {
        debugger;
        // {
        //   medName: "xanax",
        //     date: date,
        //       frequency_taken: 1,
        //   },
        //take the data i got. replace the past seven days with the days that have appropriate days.
        const pastdays = pastSevenDays();
        const trackEvents = pastdays.map((date) => {
          let dayMatch = null;
          response.data.forEach(event => {
            if (event.date_time === date) {
              debugger;
              dayMatch = event;
            }
          })
          debugger;
          if (dayMatch) {
            dayMatch.date = dayMatch.date_time;
            return dayMatch;
          }
          let med = 'no meds registered';
          if (prescription[0]) {
            med = prescription[0].name;
          }
          return {
            medName: med,
            date: date,
            frequency_taken: 0,
          }
        });
        setPillHistory(trackEvents)
        debugger;
        console.log(response.data);
      })
      .catch(err => {
        console.log('get med history failed ', err)
      })
  }
  const handleTookMed = (pillEvent, prescription, userId)=>{
    pillEvent.frequency_taken++;
    const {date, frequency_taken} = pillEvent;
    const { medName, medId} = prescription
    Axios.post(`/tracker/${userId}/history`,{
      date,
      medName,
      freq: frequency_taken,
      medId
    }).then(()=>{
      getServerData();
    })
  }
  const pastSevenDays = ()=>{
    const daysArr = [];
    for(let i = 0; i < 7; i++){
      let currentDay = moment().subtract(i,'days')
      daysArr.push(currentDay)
    }
    const daysArrMapped = daysArr.map(day=>{
      return moment(
        day,
        'ddd MMM DD YYYY HH:mm:ss',
      ).format('MM/DD/YY');
    })
    return daysArrMapped;
  }
  const toggle = () => setDropdownOpen(prevState => !prevState);
  //settings for the timeline
  const opts = {
    layout: "inline-evts"
  };
  useEffect(() => {
    getServerData();
    //! possible frequencies "1x daily", "2x daily", "3x daily", "1x weekly"
  }, []);
  return (
    <Container>
      <div className="med-tracker">
        <h1 style={{ color: '#1B2F44', fontWeight: 'bolder', paddingLeft: '5px', paddingTop: '10px' }}>Medicine Tracker</h1>
        <h1>Paul Town</h1>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>
            Choose Medicine
        </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Meds Taken</DropdownItem>
            {prescription.map((med)=>{
              return (<DropdownItem>{med.medName}</DropdownItem>);
            })}
          </DropdownMenu>
        </Dropdown>
        <Timeline opts={opts}>
          <Events>
            {pillHistory.map((pillEvent)=>{
              return (
                <TextEvent date={pillEvent.date}
                    className="text-left"
                  text={prescription[0] ? prescription[0].medName : "yo no data yet"} >
                  <div>
                    <Button onClick={(e) => { 
                      e.preventDefault();
                      handleTookMed(pillEvent, prescription[0], userId) }}>
                      Took Medicine {pillEvent.frequency_taken} times this day.
                    </Button>
                  </div>
              </TextEvent>
              );
            })}
          </Events>
        </Timeline>
      </div>
    </Container>
  );
};

export default MedTracker;

//design concepts:
//have views for one week, 30 days, 3 months, 1 year.
  //bigger scopes can shrink down the timeline view
//
