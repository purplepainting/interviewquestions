import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const CreateInterview: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute <= endMinute)
    ) {
      slots.push(
        `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      );
      
      currentMinute += 15;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    
    return slots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const slots = generateTimeSlots(startTime, endTime).map(time => ({
        id: `${Date.now()}-${time}`,
        time,
        isBooked: false
      }));

      const newInterviewDate: InterviewDate = {
        id: Date.now().toString(),
        date,
        startTime,
        endTime,
        slots
      };

      // Get existing dates
      const existingDates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
      
      // Add new date
      localStorage.setItem('interviewDates', JSON.stringify([...existingDates, newInterviewDate]));

      // Show success message
      setSuccess(true);
      setError('');

      // Reset form
      setDate('');
      setStartTime('');
      setEndTime('');

      // Navigate back to admin page after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError('An error occurred while saving the interview date. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Interview Date
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Interview date created successfully! Redirecting to admin page...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Interview Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Start Time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="End Time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={success}
                  >
                    Create Interview Date
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateInterview; 