import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';

const Persons = ({ open, handleClose, handleEmails, showEmailInput }) => {
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [databaseEmails, setDatabaseEmails] = useState(['']); // useState(['john.doe@example.com']);
    const [groupList, setGroupList] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('http://localhost:4444/emails');
                const emails = response.data;
                setDatabaseEmails(emails);
            } catch (error) {
                console.error('Error fetching emails:', error);
            }
        };

        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:4444/groups');
                const groups = response.data;
                setGroupList(groups);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchEmails();
        fetchGroups();
    }, []);

    const handleEmailToggle = (email) => {
        const selectedIndex = selectedEmails.indexOf(email);
        let newSelectedEmails = [];

        if (selectedIndex === -1) {
            newSelectedEmails = newSelectedEmails.concat(selectedEmails, email);
        } else {
            newSelectedEmails = selectedEmails.filter((selectedEmail) => selectedEmail !== email);
        }

        setSelectedEmails(newSelectedEmails);
    };

    const handleEmailInputChange = (event) => {
        setEmailInput(event.target.value);
    };

    const handleEmailFilterChange = (event) => {
        setEmailFilter(event.target.value);
    };

    const handleGroupFilterChange = (event) => {
        setGroupFilter(event.target.value);
    };

    const handleAddEmail = () => {
        if (emailInput.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(emailInput.trim())) {
                if (!databaseEmails.includes(emailInput.trim())) {
                    setDatabaseEmails([...databaseEmails, emailInput.trim()]);
                    setSelectedEmails([...selectedEmails, emailInput.trim()]);
                    setSuccessMessage('The email address has been added successfully.');
                    setErrorMessage('');
                } else {
                    setErrorMessage('The email address already exists in the list.');
                }
                setSnackbarOpen(true);
            } else {
                setErrorMessage('Please enter a valid email address.');
                setSuccessMessage('');
                setSnackbarOpen(true);
            }
        }
    };

    const handleGroupToggle = (group) => {
        const allGroupEmailsSelected =
            group.emails.length > 0 &&
            group.emails.every((email) => selectedEmails.includes(email));

        if (allGroupEmailsSelected) {
            const newSelectedEmails = selectedEmails.filter((email) => !group.emails.includes(email));
            setSelectedEmails(newSelectedEmails);
        } else {
            const newSelectedEmails = [...selectedEmails, ...group.emails];
            setSelectedEmails(newSelectedEmails);
        }
    };
    

    const handleRemoveEmail = () => {
        setSelectedEmails([]);
    };

    const handleSelectAllEmails = () => {
        setSelectedEmails(filteredEmails);
    };

    const filteredEmails = databaseEmails.filter((email) => email.includes(emailFilter));
    const filteredGroups = groupList.filter((group) => group.groupName.toLowerCase().includes(groupFilter.toLowerCase()));


    const handleSendEmails = () => {
        handleEmails(selectedEmails.join('\n'));
        handleClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Select email addresses</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            flex: '1',
                            overflowY: 'auto',
                            maxHeight: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <TextField
                            placeholder="Filter email addresses..."
                            onChange={handleEmailFilterChange}
                            variant="outlined"
                            fullWidth
                            style={{ marginBottom: '10px' }}
                        />
                        {filteredEmails.map((email) => (
                            <FormControlLabel
                                key={email}
                                control={
                                    <Checkbox
                                        checked={selectedEmails.indexOf(email) !== -1}
                                        onChange={() => handleEmailToggle(email)}
                                    />
                                }
                                label={email}
                            />
                        ))}
                    </div>
                    <div style={{ flex: '1', marginLeft: '20px' }}>
                        <Typography variant="subtitle1">Selected emails:</Typography>
                        <TextField
                            value={selectedEmails.join('\n')}
                            variant="outlined"
                            multiline
                            rows={10}
                            fullWidth
                            disabled
                            style={{ marginTop: '10px' }}
                        />
                        {showEmailInput && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                                    Add a new email address:
                                </Typography>
                                <TextField
                                    value={emailInput}
                                    onChange={handleEmailInputChange}
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="off"
                                />

                                <Button onClick={handleAddEmail} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                    Add email
                                </Button>
                            </>
                        )}
                        <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                            Select groups:
                        </Typography>

                        <TextField
                            placeholder="Filtrează grupurile..."
                            onChange={handleGroupFilterChange}
                            variant="outlined"
                            fullWidth
                            style={{ marginBottom: '10px' }}
                        />

                        {filteredGroups.map((group) => (
                            <FormControlLabel
                                key={group._id}
                                control={
                                    <Checkbox
                                        checked={group.emails.every((email) => selectedEmails.includes(email))}
                                        onChange={() => handleGroupToggle(group)}
                                    />
                                }
                                label={group.groupName}
                            />
                        ))}


                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRemoveEmail} variant="outlined" color="secondary">
                    Delete all emails
                </Button>
                <Button onClick={handleSelectAllEmails} variant="outlined" color="primary">
                    Select all emails
                </Button>
                <Button onClick={handleClose} variant="outlined">
                    Close
                </Button>
                <Button onClick={handleSendEmails} variant="contained" color="primary">
                    Save emails
                </Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                {errorMessage !== '' ? (
                    <Alert onClose={handleSnackbarClose} severity="error">
                        {errorMessage}
                    </Alert>
                ) : (
                    <Alert onClose={handleSnackbarClose} severity="success">
                        {successMessage}
                    </Alert>
                )}
            </Snackbar>
        </Dialog>
    );
};

export default Persons;
