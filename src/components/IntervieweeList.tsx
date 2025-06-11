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

  useEffect(() => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    
    if (dateId) {
      const currentDate = dates.find((d: any) => d.id === dateId);
      if (currentDate) {
        const allInterviews = [...dates, ...history];
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
      }
    }
  }, [dateId]);

  const handleEdit = (slot: InterviewSlot) => {
    setEditingSlot(slot);
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

    const dateIndex = interviewDates.findIndex(d => 
      d.slots.some(s => s.id === editingSlot.id)
    );
    if (dateIndex === -1) return;

    const slotIndex = interviewDates[dateIndex].slots.findIndex(s => s.id === editingSlot.id);
    if (slotIndex === -1) return;

    const updatedDates = [...interviewDates];
    const oldTime = updatedDates[dateIndex].slots[slotIndex].time;
    const newSlotIndex = updatedDates[dateIndex].slots.findIndex(s => s.time === newTime);

    // Clear the old slot
    updatedDates[dateIndex].slots[slotIndex] = {
      ...updatedDates[dateIndex].slots[slotIndex],
      isBooked: false,
      interviewee: undefined
    };

    // Update the new slot
    updatedDates[dateIndex].slots[newSlotIndex] = {
      ...updatedDates[dateIndex].slots[newSlotIndex],
      isBooked: true,
      interviewee: {
        name,
        phone,
        position,
        confirmed: false,
        interviewCompleted: false
      }
    };

    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    setInterviewDates(updatedDates);
    handleCloseEditDialog();
  };

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  const handleDeleteSession = () => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    const updatedDates = dates.filter((date: InterviewDate) => date.id !== dateId);
    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    navigate('/admin');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" color="primary">
            Interview List
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SummarizeIcon />}
              onClick={handleViewSummary}
            >
              View Session Summary
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete Session
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {interviewDates.map((date) => (
            <Grid item xs={12} key={date.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {formatDate(date.date)}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {date.startTime} - {date.endTime}
                  </Typography>

                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {date.slots
                          .filter(slot => slot.isBooked && slot.interviewee)
                          .map((slot) => (
                            <TableRow key={slot.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AccessTimeIcon color="primary" fontSize="small" />
                                  {slot.time}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {slot.interviewee?.name}
                                  {slot.interviewee?.isDuplicate && (
                                    <Chip
                                      label="Previous Applicant"
                                      color="warning"
                                      size="small"
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>{slot.interviewee?.phone}</TableCell>
                              <TableCell>{slot.interviewee?.position}</TableCell>
                              <TableCell>
                                {slot.interviewee?.interviewCompleted ? (
                                  <Chip label="Completed" color="success" size="small" />
                                ) : slot.interviewee?.confirmed ? (
                                  <Chip label="Confirmed" color="primary" size="small" />
                                ) : (
                                  <Chip label="Pending" color="warning" size="small" />
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  {!slot.interviewee?.interviewCompleted && (
                                    <>
                                      {!slot.interviewee?.confirmed ? (
                                        <Tooltip title="Confirm Attendance">
                                          <IconButton
                                            size="small"
                                            color="success"
                                            onClick={() => handleConfirmAttendance(slot)}
                                          >
                                            <CheckCircleIcon />
                                          </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="Cancel Attendance">
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleCancelAttendance(slot)}
                                          >
                                            <CancelIcon />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                      <Tooltip title="Start Interview">
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          onClick={() => handleStartInterview(slot)}
                                        >
                                          <PlayArrowIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                  <Tooltip title="Edit Interview">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEdit(slot)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Interview">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteInterviewee(slot)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Interview</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Available Time Slots</InputLabel>
                  <Select
                    value={newTime}
                    label="Available Time Slots"
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    {editingSlot && getAvailableTimeSlots(editingSlot).map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openInterviewDialog} onClose={() => setOpenInterviewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Interview Form</DialogTitle>
          <DialogContent>
            {editingSlot && editingSlot.interviewee && (
              <InterviewForm
                initialData={editingSlot.interviewee.interviewData}
                interviewDate={interviewDates[0]?.date}
                onComplete={(data) => {
                  const updatedSlots = interviewDates[0].slots.map(s => {
                    if (s.id === editingSlot.id) {
                      return {
                        ...s,
                        interviewee: {
                          ...s.interviewee,
                          interviewCompleted: true,
                          interviewData: data,
                          rating: data.rating
                        }
                      };
                    }
                    return s;
                  });

                  const updatedDates = [...interviewDates];
                  updatedDates[0].slots = updatedSlots;
                  setInterviewDates(updatedDates);
                  localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
                  setOpenInterviewDialog(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={showSummary}
          onClose={() => setShowSummary(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Interview Session Summary</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Desired Rate</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {interviewDates[0]?.slots
                    .filter(slot => slot.isBooked && slot.interviewee)
                    .sort((a, b) => {
                      const ratingA = a.interviewee?.rating || 0;
                      const ratingB = b.interviewee?.rating || 0;
                      return ratingB - ratingA;
                    })
                    .map((slot, index) => (
                      <TableRow key={index}>
                        <TableCell>{slot.interviewee?.name}</TableCell>
                        <TableCell>{slot.interviewee?.position}</TableCell>
                        <TableCell>{slot.interviewee?.startRate || 'Not specified'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {slot.interviewee?.rating || 'Not rated'}
                            {slot.interviewee?.rating && <StarIcon sx={{ color: 'gold', ml: 0.5 }} />}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSummary(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Delete Interview Session</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this interview session? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteSession} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default IntervieweeList; 