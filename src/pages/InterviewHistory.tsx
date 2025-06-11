import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useNavigate } from 'react-router-dom';

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
    confirmed: boolean;
    interviewCompleted: boolean;
    interviewData?: any;
  };
}

const POSITIONS = ['Foreman', 'Painter', 'Helper'];

const InterviewHistory: React.FC = () => {
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [editingSlot, setEditingSlot] = useState<InterviewSlot | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [newTime, setNewTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    // Sort dates in descending order (most recent first)
    const sortedDates = dates.sort((a: InterviewDate, b: InterviewDate) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setInterviewDates(sortedDates);
  }, []);

  const handleEdit = (slot: InterviewSlot) => {
    setEditingSlot(slot);
    setName(slot.interviewee?.name || '');
    setPhone(slot.interviewee?.phone || '');
    setPosition(slot.interviewee?.position || '');
    setNewTime(slot.time);
    setOpenDialog(true);
  };

  const handleDelete = (slot: InterviewSlot) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      const dateIndex = interviewDates.findIndex(d => 
        d.slots.some(s => s.id === slot.id)
      );
      if (dateIndex === -1) return;

      const slotIndex = interviewDates[dateIndex].slots.findIndex(s => s.id === slot.id);
      if (slotIndex === -1) return;

      const updatedDates = [...interviewDates];
      updatedDates[dateIndex].slots[slotIndex] = {
        ...updatedDates[dateIndex].slots[slotIndex],
        isBooked: false,
        interviewee: undefined
      };

      localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
      setInterviewDates(updatedDates);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
    setName('');
    setPhone('');
    setPosition('');
    setNewTime('');
  };

  const handleSave = () => {
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
      time: newTime,
      interviewee: {
        name,
        phone,
        position
      }
    };

    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    setInterviewDates(updatedDates);
    handleCloseDialog();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (dateId: string) => {
    navigate(`/admin/history/${dateId}`);
  };

  const handleViewSummary = (slot: InterviewSlot) => {
    if (slot.interviewee?.interviewData) {
      // Open a dialog or navigate to show the interview summary
      console.log('View interview summary:', slot.interviewee.interviewData);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Interview History
        </Typography>

        <Grid container spacing={3}>
          {interviewDates.map((date) => (
            <Grid item xs={12} key={date.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {formatDate(date.date)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${date.slots.filter(s => s.isBooked).length} Interviews`}
                        color="primary"
                        variant="outlined"
                      />
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(date.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Name</TableCell>
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
                              <TableCell>{slot.time}</TableCell>
                              <TableCell>{slot.interviewee?.name}</TableCell>
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
                                {slot.interviewee?.interviewCompleted && (
                                  <Tooltip title="View Summary">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleViewSummary(slot)}
                                    >
                                      <SummarizeIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
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

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Interview</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default InterviewHistory; 