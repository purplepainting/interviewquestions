import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
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
    rating?: number;
    startRate?: string;
    isDuplicate?: boolean;
  };
}

interface ShortlistedCandidate {
  name: string;
  phone: string;
  position: string;
  startRate: string;
  rating: number;
  interviewDate: string;
}

const AdminLanding: React.FC = () => {
  const navigate = useNavigate();
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);
  const [pastInterviewDates, setPastInterviewDates] = useState<InterviewDate[]>([]);
  const [showCopied, setShowCopied] = useState(false);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<ShortlistedCandidate[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<InterviewDate[]>([]);

  useEffect(() => {
    const storedDates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter upcoming interviews (today and future)
    const upcoming = storedDates.filter((date: InterviewDate) => {
      const interviewDate = new Date(date.date);
      interviewDate.setHours(0, 0, 0, 0);
      return interviewDate >= today;
    });
    
    // Filter past interviews (before today)
    const past = storedDates.filter((date: InterviewDate) => {
      const interviewDate = new Date(date.date);
      interviewDate.setHours(0, 0, 0, 0);
      return interviewDate < today;
    });
    
    setInterviewDates(upcoming);
    setPastInterviewDates(past);

    // Get all interviews from history
    const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    
    // Check both current and past interviews for top candidates
    const shortlisted: ShortlistedCandidate[] = [];
    [...upcoming, ...past].forEach((date: InterviewDate) => {
      if (date.slots) {
        date.slots.forEach((slot: any) => {
          if (slot.interviewee && slot.interviewee.rating >= 4) {
            shortlisted.push({
              name: slot.interviewee.name,
              position: slot.interviewee.position,
              startRate: slot.interviewee.startRate,
              phone: slot.interviewee.phone,
              rating: slot.interviewee.rating,
              interviewDate: date.date
            });
          }
        });
      }
    });

    // Sort by rating (highest first) and then by date (most recent first)
    shortlisted.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime();
    });

    setShortlistedCandidates(shortlisted);
  }, []);

  const handleDeleteDate = (dateId: string) => {
    if (window.confirm('Are you sure you want to delete this interview date?')) {
      const updatedDates = interviewDates.filter(date => date.id !== dateId);
      localStorage.setItem('interviewDates', JSON.stringify(updatedDates));
      setInterviewDates(updatedDates);
    }
  };

  const copyReservationLink = (dateId: string) => {
    const link = `${window.location.origin}/reserve?date=${dateId}`;
    navigator.clipboard.writeText(link);
    setShowCopied(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookedSlotsCount = (date: InterviewDate) => {
    return date.slots.filter(slot => slot.isBooked).length;
  };

  const handleCreateInterview = () => {
    navigate('/admin/create');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateInterview}
              sx={{ mb: 2 }}
            >
              Add Interview Day
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/admin/history')}
              sx={{ mb: 2 }}
            >
              View Interview History
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<StarIcon />}
              onClick={() => navigate('/admin/top-candidates')}
              sx={{ mb: 2 }}
            >
              View Top Candidates
            </Button>
          </Paper>
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Interviews
            </Typography>
            {interviewDates.length > 0 ? (
              <List>
                {interviewDates.map((date) => (
                  <ListItem key={date.id}>
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
              <Typography color="text.secondary">No upcoming interviews scheduled</Typography>
            )}
          </Paper>
        </Grid>

        {/* Interview History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Interview History
            </Typography>
            {pastInterviewDates.length > 0 ? (
              <List>
                {pastInterviewDates.map((date) => (
                  <ListItem key={date.id}>
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
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No past interviews</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showCopied}
        autoHideDuration={3000}
        onClose={() => setShowCopied(false)}
        message="Reservation link copied to clipboard"
      />
    </Container>
  );
};

export default AdminLanding; 