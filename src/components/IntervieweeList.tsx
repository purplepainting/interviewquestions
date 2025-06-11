import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InterviewForm from './InterviewForm';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useLocation, useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

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
    confirmed?: boolean;
    interviewCompleted?: boolean;
    interviewData?: any;
    isDuplicate?: boolean;
    rating?: number;
    startRate?: string;
  };
}

const POSITIONS = ['Foreman', 'Painter', 'Helper'];

const IntervieweeList: React.FC = () => {
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);
  const [editingSlot, setEditingSlot] = useState<InterviewSlot | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [newTime, setNewTime] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const dateId = searchParams.get('date');
  const [showSummary, setShowSummary] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    console.log('Date ID from URL:', dateId);
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    console.log('All dates from localStorage:', dates);
    
    if (dateId) {
      const currentDate = dates.find((d: any) => d.id === dateId);
      console.log('Found date:', currentDate);
      
      if (currentDate) {
        const allInterviews = [...dates];
        const currentSlots = currentDate.slots.map((slot: any) => {
          if (slot.interviewee) {
            const isDuplicate = allInterviews.some((date: any) => {
              if (date.id === currentDate.id) return false;
              return date.slots.some((s: any) => 
                s.interviewee && (
                  s.interviewee.name.toLowerCase() === slot.interviewee.name.toLowerCase() ||
                  s.interviewee.phone === slot.interviewee.phone
                )
              );
            });
            return { ...slot, interviewee: { ...slot.interviewee, isDuplicate } };
          }
          return slot;
        });
        setInterviewDates([{ ...currentDate, slots: currentSlots }]);
      } else {
        setError('Interview date not found');
      }
    } else {
      setError('No date specified');
    }
    setIsLoading(false);
  }, [dateId]);

  const handleEdit = (slot: InterviewSlot) => {
    setEditingSlot(slot);
    setName(slot.interviewee?.name || '');
    setPhone(slot.interviewee?.phone || '');
    setPosition(slot.interviewee?.position || '');
    setNewTime(slot.time);
    setOpenEditDialog(true);
  };

  const getAvailableTimeSlots = (currentSlot: InterviewSlot) => {
    const dateIndex = interviewDates.findIndex(d => 
      d.slots.some(s => s.id === currentSlot.id)
    );
    if (dateIndex === -1) return [];

    const date = interviewDates[dateIndex];
    return date.slots
      .filter(s => !s.isBooked || s.id === currentSlot.id)
      .map(s => s.time);
  };

  const handleDeleteInterviewee = (slot: InterviewSlot) => {
    if (window.confirm('Are you sure you want to delete this interviewee?')) {
      const updatedDates = interviewDates.map(date => ({
        ...date,
        slots: date.slots.map(s => {
          if (s.id === slot.id) {
            return { ...s, isBooked: false, interviewee: undefined };
          }
          return s;
        })
      }));
      setInterviewDates(updatedDates);
      localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    }
  };

  const handleConfirmAttendance = (slot: InterviewSlot) => {
    const updatedSlots = interviewDates[0].slots.map(s => {
      if (s.id === slot.id && s.interviewee) {
        return {
          ...s,
          interviewee: {
            ...s.interviewee,
            confirmed: true
          }
        };
      }
      return s;
    });

    const updatedDates = [...interviewDates];
    updatedDates[0].slots = updatedSlots;
    setInterviewDates(updatedDates);
    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
  };

  const handleCancelAttendance = (slot: InterviewSlot) => {
    const updatedSlots = interviewDates[0].slots.map(s => {
      if (s.id === slot.id && s.interviewee) {
        return {
          ...s,
          interviewee: {
            ...s.interviewee,
            confirmed: false
          }
        };
      }
      return s;
    });

    const updatedDates = [...interviewDates];
    updatedDates[0].slots = updatedSlots;
    setInterviewDates(updatedDates);
    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
  };

  const handleStartInterview = (slot: InterviewSlot) => {
    setEditingSlot(slot);
    setOpenInterviewDialog(true);
  };

  const handleInterviewComplete = (interviewData: any) => {
    if (!editingSlot) return;

    const dateIndex = interviewDates.findIndex(d => 
      d.slots.some(s => s.id === editingSlot.id)
    );
    if (dateIndex === -1) return;

    const slotIndex = interviewDates[dateIndex].slots.findIndex(s => s.id === editingSlot.id);
    if (slotIndex === -1) return;

    const updatedDates = [...interviewDates];
    updatedDates[dateIndex].slots[slotIndex] = {
      ...updatedDates[dateIndex].slots[slotIndex],
      interviewee: {
        ...updatedDates[dateIndex].slots[slotIndex].interviewee!,
        interviewCompleted: true,
        interviewData
      }
    };

    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    setInterviewDates(updatedDates);
    setOpenInterviewDialog(false);
    setEditingSlot(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingSlot(null);
    setName('');
    setPhone('');
    setPosition('');
    setNewTime('');
  };

  const handleSaveEdit = () => {
    if (!editingSlot) return;

    // Get all dates from localStorage
    const allDates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    
    // Find the date and slot in the full list
    const dateIndex = allDates.findIndex((d: InterviewDate) => d.id === interviewDates[0].id);
    if (dateIndex === -1) return;

    const slotIndex = allDates[dateIndex].slots.findIndex(s => s.id === editingSlot.id);
    if (slotIndex === -1) return;

    // Update the slot in the full list
    allDates[dateIndex].slots[slotIndex] = {
      ...allDates[dateIndex].slots[slotIndex],
      time: newTime,
      interviewee: {
        name,
        phone,
        position,
        confirmed: editingSlot.interviewee?.confirmed || false,
        interviewCompleted: editingSlot.interviewee?.interviewCompleted || false,
        interviewData: editingSlot.interviewee?.interviewData,
        rating: editingSlot.interviewee?.rating,
        startRate: editingSlot.interviewee?.startRate
      }
    };

    // Save the updated full list back to localStorage
    localStorage.setItem('interviewDates', JSON.stringify(allDates));

    // Update the local state with just the filtered date
    const updatedDates = interviewDates.map(date => ({
      ...date,
      slots: date.slots.map(s => {
        if (s.id === editingSlot.id) {
          return {
            ...s,
            time: newTime,
            interviewee: {
              name,
              phone,
              position,
              confirmed: s.interviewee?.confirmed || false,
              interviewCompleted: s.interviewee?.interviewCompleted || false,
              interviewData: s.interviewee?.interviewData,
              rating: s.interviewee?.rating,
              startRate: s.interviewee?.startRate
            }
          };
        }
        return s;
      })
    }));
    setInterviewDates(updatedDates);
    handleCloseEditDialog();
  };

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  const handleDeleteSession = () => {
    if (window.confirm('Are you sure you want to delete this interview session?')) {
      const allDates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
      const updatedDates = allDates.filter((d: InterviewDate) => d.id !== dateId);
      localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
      navigate('/admin');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (interviewDates.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>No interview date found</Typography>
      </Container>
    );
  }

  const currentDate = interviewDates[0];
  const bookedSlots = currentDate.slots.filter(slot => slot.isBooked);
  const completedInterviews = bookedSlots.filter(slot => 
    slot.interviewee?.interviewCompleted
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                {formatDate(currentDate.date)}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SummarizeIcon />}
                  onClick={handleViewSummary}
                  sx={{ mr: 1 }}
                >
                  View Summary
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSession}
                >
                  Delete Session
                </Button>
              </Box>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              {bookedSlots.length} slots booked
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDate.slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{slot.time}</TableCell>
                    <TableCell>
                      {slot.isBooked ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {slot.interviewee?.name}
                          {slot.interviewee?.isDuplicate && (
                            <Chip
                              label="Duplicate"
                              color="warning"
                              size="small"
                            />
                          )}
                        </Box>
                      ) : (
                        'Available'
                      )}
                    </TableCell>
                    <TableCell>{slot.interviewee?.phone || '-'}</TableCell>
                    <TableCell>{slot.interviewee?.position || '-'}</TableCell>
                    <TableCell>
                      {slot.isBooked && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {slot.interviewee?.confirmed ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Confirmed"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<CancelIcon />}
                              label="Not Confirmed"
                              color="error"
                              size="small"
                            />
                          )}
                          {slot.interviewee?.interviewCompleted && (
                            <Chip
                              icon={<StarIcon />}
                              label="Completed"
                              color="primary"
                              size="small"
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {slot.isBooked ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(slot)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteInterviewee(slot)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          {!slot.interviewee?.confirmed && (
                            <Tooltip title="Confirm Attendance">
                              <IconButton
                                size="small"
                                onClick={() => handleConfirmAttendance(slot)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {slot.interviewee?.confirmed && !slot.interviewee?.interviewCompleted && (
                            <Tooltip title="Start Interview">
                              <IconButton
                                size="small"
                                onClick={() => handleStartInterview(slot)}
                              >
                                <PlayArrowIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        <Typography color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Interviewee</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={position}
                label="Position"
                onChange={(e) => setPosition(e.target.value)}
              >
                {POSITIONS.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Time Slot</InputLabel>
              <Select
                value={newTime}
                label="Time Slot"
                onChange={(e) => setNewTime(e.target.value)}
              >
                {getAvailableTimeSlots(editingSlot!).map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interview Form Dialog */}
      <Dialog
        open={openInterviewDialog}
        onClose={() => setOpenInterviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Interview Form</DialogTitle>
        <DialogContent>
          {editingSlot && (
            <InterviewForm
              initialData={editingSlot.interviewee?.interviewData}
              interviewDate={currentDate.date}
              onComplete={handleInterviewComplete}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog
        open={showSummary}
        onClose={() => setShowSummary(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Interview Summary</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overview
                  </Typography>
                  <Typography>
                    Total Slots: {currentDate.slots.length}
                  </Typography>
                  <Typography>
                    Booked Slots: {bookedSlots.length}
                  </Typography>
                  <Typography>
                    Completed Interviews: {completedInterviews.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {completedInterviews.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Completed Interviews
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Start Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {completedInterviews.map((slot) => (
                            <TableRow key={slot.id}>
                              <TableCell>{slot.time}</TableCell>
                              <TableCell>{slot.interviewee?.name}</TableCell>
                              <TableCell>{slot.interviewee?.position}</TableCell>
                              <TableCell>{slot.interviewee?.rating || '-'}</TableCell>
                              <TableCell>{slot.interviewee?.startRate || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummary(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IntervieweeList; 