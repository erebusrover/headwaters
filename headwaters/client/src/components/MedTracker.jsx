/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAuth0 } from '../react-auth0-spa.jsx';
import { Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import '../styles/event-form.css';
import {
  Timeline,
  Events,
  UrlButton,
  ImageEvent,
  Button,
  TextEvent,
} from '@merc/react-timeline';
import Axios from 'axios';
// import Chronology from 'react-chronos';

const MedTracker = () => {
  const { user } = useAuth0();
  const [userId] = useState(user.id);
  //need the prescription and the pillhistory
  const [prescription, setPrescription] = useState([]);
  const [pillHistory, setPillHistory] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dateFormatter = function (oldDate) {
    const arrayToReposition = oldDate.split(" ")[0]
    .replace(/-/g, "/")
    .split("/");
    const newArr = [arrayToReposition[1], arrayToReposition[2], arrayToReposition[0]]
    if(newArr[0][0] === "0"){
      newArr[0]= newArr[0][1];
    }
    if (newArr[1][0] === "0") {
      newArr[1] = newArr[1][1];
    }
    newArr[2] = newArr[2][2] + newArr[2][3];
    return newArr.join("/");
  }
  const handleTookMed = (pillEvent, prescription, userId)=>{
    const {date, frequency_taken} = pillEvent;
    const {medName} = prescription
    Axios.post(`/tracker/${userId}/history`,{
      date,
      medName,
      freq: frequency_taken,
    })
  }
  const toggle = () => setDropdownOpen(prevState => !prevState);
  //settings for the timeline
  const opts = {
    layout: "inline-evts"
  };
  useEffect(() => {
    //! how to format date
    // lets get to work guys!
    // const entryDate = new Date().toString();
    // const date = moment(
    //   entryDate,
    //   'ddd MMM DD YYYY HH:mm:ss',
    // ).format('YYYY-MM-DD HH:mm:ss');
    //gets user pillbox data
    Axios.get(`/pillbox/${userId}/`)
    .then(response=>{
      console.log(response.data);
    });
    Axios.get(`/tracker/${userId}/history`)
    .then(response=>{
      console.log(response);
    })
    .catch(err=>{
      console.log('get med history failed ',err)
    })
    //! possible frequencies "1x daily", "2x daily", "3x daily", "1x weekly"
    //todo delete after endpoint is build
    const dummyDate =  new Date().toString();
    const date = moment(
      dummyDate,
      'ddd MMM DD YYYY HH:mm:ss',
    ).format('YYYY-MM-DD HH:mm:ss');
    const dummyData = {
      prescriptions: [
        {
          //user meds table
          medName: "xanax",
          dosage: 2,
          frequency: "1x daily",
          scheduled_times: "often",
          practicioner: "bobby",
          notes: "lala",
        }
      ],
      pillHistory: [
        {
          medName : "xanax",
          date: date,
          frequency_taken: 1,
        },
        {
          medName: "xanax",
          date: date,
          frequency_taken: 1,
        },
        {
          medName: "xanax",
          date: date,
          frequency_taken: 1,
        }
      ],
    }
    setPrescription(dummyData.prescriptions);
    setPillHistory(dummyData.pillHistory);
    //todo delete after endpoint is build



    //todo uncomment after endpoint is built
    // //here i will ping server for needed data.
    // //save that data to state
    // async function getPrescriptionAndPillHist(userId) {
    //   return await axios
    //   //make this get go to the endpoint ryan builds
    //     .get(`/journal/${userId}/entries`)
    //     .then(res => {
    //       //update state
    //       setPrescription(res.data);
    //       setPillHistory(res.data);
    //       return res.data;
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // }
    // getPrescriptionAndPillHist(userId);
    //todo uncomment after endpoint is built
  }, []);
  return (
    <Container>
      <div className="med-tracker">
        <h1 style={{ color: '#1B2F44', fontWeight: 'bolder', paddingLeft: '5px', paddingTop: '10px' }}>Medicine Tracker</h1>
        <h1>Paul Town</h1>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>
            Dropdown
        </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Header</DropdownItem>
            <DropdownItem>Some Action</DropdownItem>
            <DropdownItem disabled>Action (disabled)</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Foo Action</DropdownItem>
            <DropdownItem>Bar Action</DropdownItem>
            <DropdownItem>Quo Action</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Timeline opts={opts}>
          <Events>
            {pillHistory.map((pillEvent)=>{
              return (
              <TextEvent 
              date={dateFormatter(pillEvent.date)} 
              // key={dateFormatter(pillEvent.date)}
              text={prescription[0] ? prescription[0].medName : "yo no data yet"} >
                  <Button onClick={() => { handleTookMed(pillEvent, prescription, userId)}}>
                  Took Medicine
                </Button>
              </TextEvent>);
            })}
            <TextEvent date="1/1/19" text={prescription[0] ? prescription[0].medName: "yo no data yet"}>
            </TextEvent>
            <TextEvent date="1/1/14" text="**Markdown** is *supported*" />
            <TextEvent date="1/1/12" text="**Markdown** is *supported*" />

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
