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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
    const storedDates = localStorage.getItem('interviewDates');
    if (storedDates) {
      const dates = JSON.parse(storedDates);
      // Filter out future dates and sort in descending order
      const pastDates = dates.filter((date: InterviewDate) => 
        new Date(date.date) < new Date()
      ).sort((a: InterviewDate, b: InterviewDate) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setInterviewDates(pastDates);
    }
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
        position,
        confirmed: false,
        interviewCompleted: false
      }
    };

    localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
    setInterviewDates(updatedDates);
    handleCloseDialog();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (dateId: string) => {
    navigate(`/admin/interviewees?date=${dateId}`);
  };

  const handleViewSummary = (slot: InterviewSlot) => {
    if (slot.interviewee?.interviewData) {
      // Open a dialog or navigate to show the interview summary
      console.log('View interview summary:', slot.interviewee.interviewData);
    }
  };

  const getBookedSlotsCount = (date: InterviewDate) => {
    return date.slots.filter(slot => slot.isBooked).length;
  };

  const copyReservationLink = (dateId: string) => {
    const link = `${window.location.origin}/reserve?date=${dateId}`;
    navigator.clipboard.writeText(link);
  };

  const handleDeleteDate = (dateId: string) => {
    if (window.confirm('Are you sure you want to delete this interview date?')) {
      const storedDates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
      const updatedDates = storedDates.filter((date: InterviewDate) => date.id !== dateId);
      localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
      setInterviewDates(updatedDates.filter((date: InterviewDate) => 
        new Date(date.date) < new Date()
      ).sort((a: InterviewDate, b: InterviewDate) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Interview History
      </Typography>
      <Paper sx={{ p: 2 }}>
        {interviewDates.length > 0 ? (
          <List>
            {interviewDates.map((date) => (
              <ListItem 
                key={date.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteDate(date.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                        color: 'primary.main'
                      }}
                      onClick={() => navigate(`/admin/interviewees?date=${date.id}`)}
                    >
                      {formatDate(date.date)}
                    </Typography>
                  }
                  secondary={`${getBookedSlotsCount(date)} slots booked`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    value={`${window.location.origin}/reserve?date=${date.id}`}
                    InputProps={{ readOnly: true }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => copyReservationLink(date.id)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">No interview history available</Typography>
        )}
      </Paper>

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
    </Container>
  );
};

export default InterviewHistory; 