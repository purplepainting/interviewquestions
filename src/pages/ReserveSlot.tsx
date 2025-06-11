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
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    setInterviewDates(dates);
  }, []);

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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Available Interview Slots
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your interview slot has been reserved successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {interviewDates.map((date) => (
            <Grid item xs={12} key={date.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {formatDate(date.date)}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {date.startTime} - {date.endTime}
                  </Typography>
                  
                  <List>
                    {date.slots.map((slot) => (
                      <React.Fragment key={slot.id}>
                        <ListItem
                          button
                          onClick={() => handleSlotClick(slot)}
                          disabled={slot.isBooked}
                          sx={{
                            opacity: slot.isBooked ? 0.5 : 1,
                            backgroundColor: slot.isBooked ? '#f5f5f5' : 'inherit',
                            '&:hover': {
                              backgroundColor: slot.isBooked ? '#f5f5f5' : 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">
                                  {slot.time}
                                </Typography>
                                {slot.isBooked ? (
                                  <Chip
                                    label="Booked"
                                    color="primary"
                                    size="small"
                                  />
                                ) : (
                                  <Chip
                                    label="Available"
                                    color="default"
                                    size="small"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              slot.isBooked && slot.interviewee
                                ? `Booked by ${slot.interviewee.name}`
                                : 'Click to reserve this slot'
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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
                  <TextField
                    fullWidth
                    label="Position Applying For"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
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
      </Box>
    </Container>
  );
};

export default ReserveSlot; 