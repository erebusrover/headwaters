import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';
import { useAuth0 } from '../../react-auth0-spa.jsx';

import '../../styles/event-form.css';

const NewEvent = props => {
  const { user } = useAuth0();

  let { date } = props;
  date = date.toString().slice(0, 15);
  const dateFormat = moment(date, 'ddd MMM DD YYYY').format('MM/DD/YY');

  const [userId] = useState(user.id);
  const [name, setName] = useState('Counseling Session');
  const [prac, setPrac] = useState('Deanna Troi');
  const [eventDate, setDate] = useState(date);
  const [time, setTime] = useState('00:00');
  const [type, setType] = useState('other');
  const [notes, setNotes] = useState('Stardate 43125.8');
  const [locale, setLocale] = useState('Starship Enterprise');

  const handleEventSubmit = event => {
    event.preventDefault();

    const { handleEventPost } = props;
    // date and time conversion for mysql insertion
    const dateConvert = moment(eventDate, 'YYYY-MM-DD').format(
      'YYYY-MM-DD',
    );
    const dateTime = `${dateConvert} ${time}`;

    const newEvent = [
      {
        userId,
        name,
        dateTime,
        notes,
        prac,
        type,
        locale,
      },
    ];

    handleEventPost(newEvent);
  };

  return (
    <div className="new-event-form">
      <Form>
        <FormGroup>
          <Label for="event-name">Event Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder={name}
            onChange={event => {
              setName(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="practitioner">Practitioner</Label>
          <Input
            type="text"
            name="practitioner"
            id="practitioner"
            placeholder={prac}
            onChange={event => {
              setPrac(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleDate">Date</Label>
          <Input
            type="text"
            name="date"
            id="date"
            placeholder={dateFormat}
            onChange={event => {
              setDate(event.target.value);
            }}
            onFocus={e => (e.target.type = 'date')}
            onBlur={e => (e.target.type = 'text')}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleTime">Time</Label>
          <Input
            type="time"
            name="time"
            id="time"
            placeholder="time placeholder"
            onChange={event => {
              setTime(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="appointment">Appointment Type</Label>
          <Input
            type="select"
            name="appointment"
            id="appointment"
            placeholder={type}
            onChange={event => {
              setType(event.target.value);
            }}
          >
            <option>mental well-being</option>
            <option>physical well-being</option>
            <option>personal</option>
            <option>other</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input
            type="textarea"
            name="notes"
            id="notes"
            placeholder={notes}
            onChange={event => {
              setNotes(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="address">Location</Label>
          <Input
            type="text"
            name="location"
            id="location"
            placeholder={locale}
            onChange={event => {
              setLocale(event.target.value);
            }}
          />
        </FormGroup>
      </Form>
      <Button style={{ backgroundColor: '#083855', border: '0px' }} onClick={handleEventSubmit} size="sm">
        add event
      </Button>{' '}
    </div>
  );
};

export default NewEvent;
