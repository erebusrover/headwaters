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
  themes,
  createTheme
} from '@merc/react-timeline';
import Axios from 'axios';
import styled from 'styled-components';
// import Chronology from 'react-chronos';

const MedTracker = () => {
  
  const { user } = useAuth0();
  const [userId] = useState(user.id);
  //need the prescription and the pillhistory
  const [prescription, setPrescription] = useState([]);
  const [totalPillHistory, setTotalPillHistory]=useState([]);
  const [pillHistory, setPillHistory] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [currentMed, setCurrentMed] = useState({ medName: "Choose Medicine"});
  const [daysToRender, setDaysToRender] = useState(7);
  // const spanPositiveStyle = {
  //   borderRadius: '50%',
  //   borderColor: '#070D24',
  //   borderWidth: '3px',
  //   // transform: 'rotate(45deg)',
  //   backgroundColor: 'Green',
  // };
  // const spanNegativeStyle = {
  //   borderRadius: '50%',
  //   borderColor: '#070D24',
  //   // borderWidth: '3px',
  //   // transform: 'rotate(45deg)',
  //   backgroundColor: 'Red',
  // };
  const customTheme = createTheme(themes.default, {
    timelineTrack: {
      background: `linear-gradient(
      to bottom, #5ec0a7 0%,#070d24 100%
    )`,
      backgroundColor: "#1B2F44",
    },
    date: {
      backgroundColor: '#1B2F44',
      color: '#fff',
    },
    marker: {
      borderColor: '#1B2F44',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    button: {
      backgroundColor: '#1B2F44',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      width: '40%',
      height: '60%',
    }
  });
  const MyCustomMarkerPos = () => <span >✔️</span>;
  const MyCustomMarkerNeg = () => <span >✖️</span>;
  const getServerData = ()=>{
    Axios.get(`/pillbox/${userId}/`)
      .then(response => {
        const prescriptions = response.data.map(prescription => {
          prescription.medId = prescription.users_meds_med;
          prescription.medName = prescription.name;
          return prescription
        });
        
        //todo this is the problem somehow
        setPrescription(prescriptions)
      })
    Axios.get(`/tracker/${userId}/history`)
      .then(response => {
        setTotalPillHistory(response.data)
      })
      .catch(err => {
        console.log('get med history failed ', err)
      })
  }
  const handleTookMed = (pillEvent, userId, tookMed)=>{
    tookMed ? pillEvent.frequency_taken++ : pillEvent.frequency_taken --
    // pillEvent.frequency_taken++;
    const {date, frequency_taken} = pillEvent;
    const { medName, medId} = currentMed
    Axios.post(`/tracker/${userId}/history`,{
      date,
      medName,
      freq: frequency_taken,
      medId
    }).then(()=>{
      getServerData();
    })
  }
  const handleChooseMed = (medIndex)=>{
    const selectedMed = prescription[medIndex]
    setCurrentMed(selectedMed)
    const pastdays = pastSevenDays();
    const trackEvents = pastdays.map((date) => {
      let dayMatch = null;
      totalPillHistory.forEach(event => {
        if (event.date_time === date && event.meds_history_med == selectedMed.users_meds_med) {
          dayMatch = event;
        }
      })
      if (dayMatch) {
        dayMatch.date = dayMatch.date_time;
        return dayMatch;
      }
      let med = 'no meds registered';
      if (selectedMed) {
        med = selectedMed.medName;
      }
      return {
        medName: med,
        date: date,
        frequency_taken: 0,

      }
    });
    setPillHistory(trackEvents);
  }
  const handleChooseDays = (amount)=>{
    setDaysToRender(amount);
    const pastdays = pastSevenDays(amount);
    const trackEvents = pastdays.map((date) => {
      let dayMatch = null;
      totalPillHistory.forEach(event => {
        if (event.date_time === date && event.meds_history_med == currentMed.users_meds_med) {
          dayMatch = event;
        }
      })
      if (dayMatch) {
        dayMatch.date = dayMatch.date_time;
        return dayMatch;
      }
      let med = 'no meds registered';
      if (currentMed) {
        med = currentMed.medName;
      }
      return {
        medName: med,
        date: date,
        frequency_taken: 0,

      }
    });
    setPillHistory(trackEvents);
  }
  const pastSevenDays = (amount=daysToRender)=>{
    const daysArr = [];
    for (let i = 0; i < amount; i++){
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
  const toggle2 = () => setDropdownOpen2(prevState => !prevState);
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
        <Dropdown isOpen={dropdownOpen2} toggle={toggle2}>
          <DropdownToggle caret style={{backgroundColor: '#1B2F44'}}>
            {"Showing " + daysToRender + "days"}
        </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header >Meds Taken</DropdownItem>
            <DropdownItem onClick={() => { handleChooseDays(7)}}>7</DropdownItem>
            <DropdownItem onClick={() => { handleChooseDays(30) }}>30</DropdownItem>
            <DropdownItem onClick={() => { handleChooseDays(90) }}>90</DropdownItem>
          </DropdownMenu>
        </Dropdown>
    <br />
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret style={{ backgroundColor: '#1B2F44' }}>
            {currentMed.medName}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Meds Taken</DropdownItem>
            {prescription.map((med, index) => {
              return (<DropdownItem onClick={() => { handleChooseMed(index) }}>{med.medName}</DropdownItem>);
            })}
          </DropdownMenu>
        </Dropdown>

        <Timeline opts={opts} theme={customTheme}>
          <Events>
            {pillHistory.map((pillEvent)=>{
              return (
                
                <TextEvent date={pillEvent.date}
                  marker={()=>{
                    console.log(currentMed.frequency[0])
                    if(pillEvent.frequency_taken< currentMed.frequency[0]){
                      return MyCustomMarkerNeg();
                    } else {
                      return MyCustomMarkerPos();
                    }
                  }}
                    className="text-left"
                  text={`Took Medicine ${pillEvent.frequency_taken} times this day.`} >
                  <div>
                    <Button onClick={(e) => { 
                      e.preventDefault();
                      handleTookMed(pillEvent, userId, true) }}>
                      Add Times Taken
                    </Button>
                    <Button onClick={(e) => {
                      e.preventDefault();
                      handleTookMed(pillEvent, userId, false)}}>
                      subtract medicine
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
