import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';

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
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);

  useEffect(() => {
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    setInterviewDates(dates);
  }, []);

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
          Interview Management Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/create')}
              sx={{ height: '100%', py: 2 }}
            >
              Create New Interview Date
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/admin/interviewees')}
              sx={{ height: '100%', py: 2 }}
            >
              View All Interviewees
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/admin/interviewees')}
              sx={{ height: '100%', py: 2 }}
            >
              View Interview History
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>
          Upcoming Interview Dates
        </Typography>

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
                        <ListItem>
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
                              slot.isBooked && slot.interviewee ? (
                                <>
                                  <Typography variant="body2">
                                    {slot.interviewee.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {slot.interviewee.position}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {slot.interviewee.phone}
                                  </Typography>
                                </>
                              ) : null
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
      </Box>
    </Container>
  );
};

export default AdminLanding; 