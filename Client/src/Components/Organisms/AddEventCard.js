import '../../Style/Profile.css';
import calendar from '../../Images/calendar.png';
import React, { useState, useEffect } from 'react';
import '../../Style/AddEventCard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ProfileCard = () => {
  const [title, setEventName] = useState("");
  const [startdate, setEventstartDate] = useState("");
  const [enddate, setEventendDate] = useState("");
  const [details, setEventDetails] = useState("");
  const [person, setEventPerson] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setWarningMessage('');

    if (!title || !startdate || !enddate || !details || !person) {
      setErrorMessage('Toate câmpurile sunt obligatorii.');
      return;
    }

    const startDate = new Date(startdate);
    const endDate = new Date(enddate);
  
    if (endDate < startDate) {
      setErrorMessage('Data de sfârșit nu poate fi înainte de data de început.');
      return;
    }
  
    if (endDate < new Date()) {
      setErrorMessage('Data de sfârșit nu poate fi în trecut.');
      return;
    }
  
    if (startDate < new Date()) {
      setWarningMessage('Evenimentul este programat pentru o dată din trecut.');
      setDialogOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4444/event/create', {
        title,
        startdate,
        enddate,
        details,
        person,
      });
  
      navigate('/calendar');
  
    } catch (error) {
      console.error(error);
      const backendErrorMessage = error.response?.data?.message;
      setErrorMessage(backendErrorMessage || 'Eroare nu e adaugat event');
    }
  };
  
  const handleConfirmSubmit = async () => {
    handleDialogClose();

    try {
      const response = await axios.post('http://localhost:4444/event/create', {
        title,
        startdate,
        enddate,
        details,
        person,
      });
  
      navigate('/calendar');
  
    } catch (error) {
      console.error(error);
      const backendErrorMessage = error.response?.data?.message;
      setErrorMessage(backendErrorMessage || 'Eroare nu e adaugat event');
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Add Event</h2>
      </div>
      {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
      {warningMessage && <Alert variant="filled" severity="warning">{warningMessage}</Alert>}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>{"Ești sigur că vrei să continue?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Evenimentul este programat pentru o dată din trecut. Ești sigur că vrei să adaugi acest eveniment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Anulează</Button>
          <Button onClick={handleConfirmSubmit} color="primary">Continuă</Button>
        </DialogActions>
      </Dialog>
      <div className="card-body">
        <img src={calendar} alt="Profile Picture" className="profile-add" />
        <div className="profile-det">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="eventName">Name:</label>
              <input
                type="text"
                className="form-control input-field"
                id="titlu"
                placeholder="Enter event name"
                value={title}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventDate">Start Date:</label>
              <input
                type="datetime-local"
                className="form-control input-field"
                id="startdate"
                placeholder="Enter event start date"
                value={startdate}
                onChange={(e) => setEventstartDate(e.target.value)}
              />
            </div>
            

            <div className="form-group">
              <label htmlFor="eventDate">End Date:</label>
              <input
                type="datetime-local"
                className="form-control input-field"
                id="enddate"
                placeholder="Enter event end date"
                value={enddate}
                onChange={(e) => setEventendDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventDetails">Event Details:</label>
              <textarea
                className="form-control input-field"
                id="details"
                rows="3"
                placeholder="Enter event details"
                value={details}
                onChange={(e) => setEventDetails(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="eventPerson">Persons:</label>
              <input
                type="text"
                className="form-control input-field"
                id="person"
                placeholder="Add persons to the event"
                value={person}
                onChange={(e) => setEventPerson(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
