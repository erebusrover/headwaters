import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import PillboxToast from './toasts/PillboxToast.jsx';
import { useAuth0 } from '../react-auth0-spa.jsx';
import MedList from './MedList.jsx';

import '../styles/event-form.css';
import '../styles/pillbox.css';

const { addUserMedication } = require('../utils/helpers');

const Pillbox = () => {
  const { user } = useAuth0();
  const [userId] = useState(user.id);
  const [medEntries, setMedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPillboxToastObj, setPillboxToastObj] = useState([]);

  useEffect(() => {
    async function getUserMedications() {
      await axios
        .get(`/pillbox/${userId}`)
        .then(res => {
          setMedEntries(res.data);
        })
        .catch(err => console.error(err));
    }
    getUserMedications().then(() => {
      setLoading(false);
    });
  }, []);

  const [med, setMed] = useState([]);
  const handleMed = e => {
    e.preventDefault();
    const { value } = e.target;
    setMed(value);
  };
  const [dosage, setDosage] = useState([]);
  const handleDosage = e => {
    e.preventDefault();
    const { value } = e.target;
    setDosage(value);
  };

  const [practitioner, setPractitioner] = useState([]);
  const handlePractitioner = e => {
    e.preventDefault();
    const { value } = e.target;
    setPractitioner(value);
  };

  const [time, setTime] = useState([]);
  const handleTime = e => {
    e.preventDefault();
    const { value } = e.target;
    setTime(value);
  };

  const [date, setDate] = useState([]);
  const handleDate = e => {
    e.preventDefault();
    const { value } = e.target;
    setDate(value);
  };

  const [frequency, setFrequency] = useState([]);

  const [times] = useState([]);
  const addTime = () => {
    times.push(time);
  };

  const [notes, setNotes] = useState([]);
  const handleNotes = e => {
    e.preventDefault();
    const { value } = e.target;
    setNotes(value);
  };

  const [url, setUrl] = useState([]);
  const handleUrl = e => {
    console.log(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  };

  const [showPillboxToast, setPillboxToast] = useState(false);
  const togglePillboxToast = () => {
    setPillboxToast(!showPillboxToast);
  };

  const submitMed = e => {
    e.preventDefault();
    const medEntryObj = {
      med,
      dosage,
      practitioner,
      frequency,
      times,
      dateTime: `${date} ${time}`,
      notes,
      url,
      userId,
    };
    addUserMedication(medEntryObj);
    setPillboxToastObj(medEntryObj);
    togglePillboxToast();
    setMed('');
    setDosage('');
    setPractitioner('');
    setTime('');
    setNotes('');
    setUrl('');
    setLoading(false);
  };

  if (loading) {
    return 'Loading...';
  }

  console.log(date + ' ' + time);
  return (
    <Container className="new-medication-form">
      <div>
        <div className="form-container">
          <h1 style={{ color: '#1B2F44', fontWeight: 'bolder', paddingLeft: '10px', paddingTop: '20px' }}>Pillbox</h1>
        </div>
        <Row>
          <Col sm={8}>
            <form className="med-form" onSubmit={submitMed}>
              <FormGroup>
                <Label for="med">Medication</Label>
                <Input
                  type="text"
                  name="med"
                  id="med"
                  placeholder="medication"
                  value={med}
                  onChange={handleMed}
                />
              </FormGroup>
              <FormGroup>
                <Label for="dosage">Dosage (mg)</Label>
                <Input
                  type="text"
                  name="dosage"
                  id="dosage"
                  placeholder="dosage"
                  value={dosage}
                  onChange={handleDosage}
                />
              </FormGroup>
              <FormGroup>
                <Label for="practitioner">Practitioner</Label>
                <Input
                  type="text"
                  name="practitioner"
                  id="practitioner"
                  placeholder="name"
                  value={practitioner}
                  onChange={handlePractitioner}
                />
              </FormGroup>
              <FormGroup>
                <Label for="time">Time</Label>
                <Input
                  type="time"
                  name="time"
                  id="time"
                  dateformat="HH:mm"
                  placeholder="time placeholder"
                  value={time}
                  onChange={handleTime}
                />
                <br />
                <Button
                  style={{ backgroundColor: '#083855', border: '0px' }}
                  size="sm"
                  onClick={addTime}
                >
                  Set time
                </Button>{' '}
              </FormGroup>

                <FormGroup>
                  <Label for="time">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    id="date"
                    dateformat="YYYY-MM-DD"
                    placeholder="date placeholder"
                    value={date}
                    onChange={handleDate}
                  />
                  <br />
                  <Button
                    style={{ backgroundColor: '#083855', border: '0px' }}
                    size="sm"
                    onClick={addTime}
                  >
                    Set date
                </Button>{' '}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="status">How often should it be taken?</Label>
                <Input
                  name="frequency"
                  id="frequency"
                  type="select"
                  bsSize="sm"
                  onChange={e => {
                    setFrequency(e.target.value);
                  }}
                >
                  <option value="1x daily">daily</option>
                  <option value="2x daily">2x daily</option>
                  <option value="3x daily">3x daily</option>
                  <option value="1x weekly">weekly</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  type="textarea"
                  name="notes"
                  id="notes"
                  value={notes}
                  onChange={handleNotes}
                />
              </FormGroup>
              {/* form to save images */}
              {/* <Label for="imgUpload">Medication image upload:</Label>{' '}
              <div>
                <input type="file" name="url" onChange={handleUrl} />
                <img src={url} height="100" width="100" alt="" />
              </div>
              <br />
              <br /> */}
              <Button style={{ backgroundColor: '#083855', border: '0px' }}>
                save
              </Button>{' '}
            </form>
          </Col>
          <Col sm={4}>
            {!showPillboxToast && <MedList medEntries={medEntries} />}
            {showPillboxToast && (
              <PillboxToast
                className="pillbox-toast"
                isOpen={showPillboxToast}
                newMed={newPillboxToastObj}
                toggle={togglePillboxToast}
              />
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Pillbox;
