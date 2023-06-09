import '../../Style/Profile.css';
import calendar from '../../Images/calendar.png';
import React, { useState, useEffect } from 'react';
import '../../Style/AddEventCard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Persons from '../Molecules/Persons';
import LocationPickerDialog from '../Molecules/LocationPickerDialog';


const ProfileCard = () => {
  const [title, setEventName] = useState("");
  const [startdate, setEventstartDate] = useState("");
  const [enddate, setEventendDate] = useState("");
  const [details, setEventDetails] = useState("");
  const [person, setEventPerson] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [personsDialogOpen, personsSetDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();


  const handleLocationDialogOpen = () => {
    setLocationDialogOpen(true);
  };

  const handleLocationDialogClose = () => {
    setLocationDialogOpen(false);
  };

  const handleLocationSelected = (location) => {
    console.log(location);  // această linie va afișa locația în consolă
    const locationUrl = `https://www.google.com/maps/?q=${location.lat},${location.lng}`;
    setLocation(locationUrl);
  };
  
  

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handlePersonsDialogClose = () => {
    personsSetDialogOpen(false);
  }

  const handlePersonsOpenDialog = () => {
    personsSetDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    setDialogOpen(false);
    try {
      const response = await axios.post('http://localhost:4444/event/create', {
        title,
        startdate,
        enddate,
        details,
        person,
        location,
      });
      navigate('/calendar');
    } catch (error) {
      console.error(error);
      const backendErrorMessage = error.response?.data?.message;
      setErrorMessage(backendErrorMessage || 'Error: event not added');
      setSnackbarMessage(backendErrorMessage || 'Error: event not added');
      setSnackbarOpen(true);
    }
  };

  const handleEmails = (emails) => {
    console.log(emails);
    const emailsArray = emails.split('\n');  // transformă stringul într-o listă de email-uri
    setEventPerson(emailsArray);  // setează lista de email-uri
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setWarningMessage('');

    if (!title || !startdate || !enddate || !details || !person) {  // || !location
      setErrorMessage('All fields are required.');
      setSnackbarMessage('All fields are required.');
      setSnackbarOpen(true);
      return;
    }

    const startDate = new Date(startdate);
    const endDate = new Date(enddate);

    if (endDate < startDate) {
      setErrorMessage('The end date cannot be before the start date.');
      setSnackbarMessage('The end date cannot be before the start date.');
      setSnackbarOpen(true);
      return;
    }

    if (endDate < new Date()) {
      setErrorMessage('The end date cannot be in the past.');
      setSnackbarMessage('The end date cannot be in the past.');
      setSnackbarOpen(true);
      return;
    }

    if (startDate < new Date()) {
      setWarningMessage('The start date is in the past.');
      setSnackbarMessage('The start date is in the past.');
      setSnackbarOpen(true);
      setWarningMessage('The event is scheduled for a date in the past. Do you want to continue?');
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
        location,
      });
      navigate('/calendar');
    } catch (error) {
      console.error(error);
      const backendErrorMessage = error.response?.data?.message;
      setErrorMessage(backendErrorMessage || 'Error: event not added');
      setSnackbarMessage(backendErrorMessage || 'Error: event not added');
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Add Event</h2>
      </div>
      <Snackbar open={snackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleSnackbarClose}>
        <Alert variant="filled" onClose={handleSnackbarClose} severity={errorMessage ? "error" : "warning"} sx={{ width: '100%' }}>
          {errorMessage || warningMessage}
        </Alert>
      </Snackbar>

      <LocationPickerDialog
        open={locationDialogOpen}
        onClose={handleLocationDialogClose}
        onLocationSelected={handleLocationSelected}
      />

      <Persons open={personsDialogOpen}
        handleClose={handlePersonsDialogClose}
        handleEmails={handleEmails}
        showEmailInput={true} />
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Avertisment"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {warningMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" autoFocus>
            Yes
          </Button>
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
              <Button onClick={handlePersonsOpenDialog}>Select emails</Button>
            </div>
            <div className="form-group">
            <Button onClick={handleLocationDialogOpen}>Select Location</Button>
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
