import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  OutlinedInput,
} from '@mui/material';

interface InterviewDate {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  slots: InterviewSlot[];
}

interface InterviewSlot {
  id: string;
  time: string;
  isBooked: boolean;
  interviewee?: {
    name: string;
    phone: string;
    position: string;
  };
}

const ReserveSlot: React.FC = () => {
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    setInterviewDates(dates);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedSlot || !name || !phone || !position) {
      setError('Please fill in all fields');
      return;
    }

    const dateIndex = interviewDates.findIndex(d => d.id === selectedDate);
    if (dateIndex === -1) return;

    const slotIndex = interviewDates[dateIndex].slots.findIndex(s => s.id === selectedSlot);
    if (slotIndex === -1) return;

    // Create a copy of the dates array
    const updatedDates = [...interviewDates];
    
    // Update the slot
    updatedDates[dateIndex].slots[slotIndex] = {
      ...updatedDates[dateIndex].slots[slotIndex],
      isBooked: true,
      interviewee: {
        name,
        phone,
        position
      }
    };

    // Save to localStorage
    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    setInterviewDates(updatedDates);
    
    // Reset form
    setSelectedDate('');
    setSelectedSlot('');
    setName('');
    setPhone('');
    setPosition('');
    setError('');
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const availableDates = interviewDates.filter(date => 
    date.slots.some(slot => !slot.isBooked)
  );

  const availableSlots = selectedDate
    ? interviewDates
        .find(date => date.id === selectedDate)
        ?.slots || []
    : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reserve Your Interview Slot
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your interview slot has been reserved successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Interview Date</InputLabel>
                  <Select
                    value={selectedDate}
                    label="Select Interview Date"
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot('');
                    }}
                    required
                  >
                    {availableDates.map((date) => (
                      <MenuItem key={date.id} value={date.id}>
                        {formatDate(date.date)} ({date.startTime} - {date.endTime})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedDate && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Time Slot</InputLabel>
                    <Select
                      value={selectedSlot}
                      label="Select Time Slot"
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      required
                    >
                      {availableSlots.map((slot) => (
                        <MenuItem 
                          key={slot.id} 
                          value={slot.id}
                          disabled={slot.isBooked}
                          sx={{
                            opacity: slot.isBooked ? 0.5 : 1,
                            backgroundColor: slot.isBooked ? '#f5f5f5' : 'inherit',
                          }}
                        >
                          <ListItemText
                            primary={slot.time}
                            secondary={
                              slot.isBooked && slot.interviewee
                                ? `Booked by ${slot.interviewee.name}`
                                : 'Available'
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Position Applying For"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Reserve Slot
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ReserveSlot; 