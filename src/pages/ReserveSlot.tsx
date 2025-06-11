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
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation } from 'react-router-dom';

interface InterviewDate {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
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

const POSITIONS = ['Foreman', 'Painter', 'Helper'];

const ReserveSlot: React.FC = () => {
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<InterviewDate | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    const searchParams = new URLSearchParams(location.search);
    const dateId = searchParams.get('date');

    if (dateId) {
      const filteredDate = dates.find((date: InterviewDate) => date.id === dateId);
      if (filteredDate) {
        setSelectedDate(filteredDate);
        setInterviewDates([filteredDate]);
      }
    }
  }, [location.search]);

  const handleSlotClick = (slot: InterviewSlot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
    setName('');
    setPhone('');
    setPosition('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !name || !phone || !position) {
      setError('Please fill in all fields');
      return;
    }

    const dateIndex = interviewDates.findIndex(d => 
      d.slots.some(s => s.id === selectedSlot.id)
    );
    if (dateIndex === -1) return;

    const slotIndex = interviewDates[dateIndex].slots.findIndex(s => s.id === selectedSlot.id);
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
    
    // Reset form and show success
    handleCloseDialog();
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Purple Painting
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Interview Slot Reservation
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 4 }}>
            Your interview slot has been reserved successfully! We look forward to meeting you.
          </Alert>
        )}

        {selectedDate ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {formatDate(selectedDate.date)}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {selectedDate.startTime} - {selectedDate.endTime}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {selectedDate.slots.map((slot) => (
                      <Grid item xs={12} sm={6} md={4} key={slot.id}>
                        <Paper
                          elevation={slot.isBooked ? 0 : 1}
                          sx={{
                            p: 2,
                            cursor: slot.isBooked ? 'default' : 'pointer',
                            opacity: slot.isBooked ? 0.7 : 1,
                            backgroundColor: slot.isBooked ? 'grey.100' : 'white',
                            '&:hover': {
                              backgroundColor: slot.isBooked ? 'grey.100' : 'grey.50',
                            },
                          }}
                          onClick={() => handleSlotClick(slot)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccessTimeIcon color="primary" />
                            <Typography variant="subtitle1">
                              {slot.time}
                            </Typography>
                          </Box>
                          
                          {slot.isBooked ? (
                            <Typography variant="body2" color="text.secondary">
                              Unavailable
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="primary">
                              Click to reserve this slot
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="error" sx={{ mb: 4 }}>
            Invalid or expired interview date. Please check the reservation link.
          </Alert>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Reserve Interview Slot</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Grid container spacing={2}>
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
                  <FormControl fullWidth required>
                    <InputLabel>Position Applying For</InputLabel>
                    <Select
                      value={position}
                      label="Position Applying For"
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      {POSITIONS.map((pos) => (
                        <MenuItem key={pos} value={pos}>
                          {pos}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                Reserve Slot
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Interview slot booked successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ReserveSlot; 