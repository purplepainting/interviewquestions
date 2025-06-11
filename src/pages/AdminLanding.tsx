import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
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

const AdminLanding: React.FC = () => {
  const navigate = useNavigate();
  const [interviewDates, setInterviewDates] = React.useState<InterviewDate[]>(() => {
    const saved = localStorage.getItem('interviewDates');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('interviewDates', JSON.stringify(interviewDates));
  }, [interviewDates]);

  const handleCreateNewInterview = () => {
    navigate('/admin/create-interview');
  };

  const handleViewInterviewees = () => {
    navigate('/admin/interviewees');
  };

  const handleViewHistory = () => {
    navigate('/admin/history');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Purple Painting
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Interview Management System
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Create New Interview Date" 
                    secondary="Schedule a new interview session"
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateNewInterview}
                    >
                      Create
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="View Interviewees" 
                    secondary="See all scheduled interviews"
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      startIcon={<PeopleIcon />}
                      onClick={handleViewInterviewees}
                    >
                      View
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Interview History" 
                    secondary="View past interview records"
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      startIcon={<HistoryIcon />}
                      onClick={handleViewHistory}
                    >
                      View
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Interview Dates
              </Typography>
              {interviewDates.length === 0 ? (
                <Typography color="text.secondary">
                  No upcoming interview dates scheduled
                </Typography>
              ) : (
                <List>
                  {interviewDates.map((date) => (
                    <ListItem key={date.id}>
                      <ListItemText
                        primary={new Date(date.date).toLocaleDateString()}
                        secondary={`${date.startTime} - ${date.endTime}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => navigate(`/admin/interview/${date.id}`)}
                        >
                          <ScheduleIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminLanding; 