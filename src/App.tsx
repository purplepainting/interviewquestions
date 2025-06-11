import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import AdminLanding from './pages/AdminLanding';
import CreateInterview from './pages/CreateInterview';
import ReserveSlot from './pages/ReserveSlot';
import IntervieweeList from './components/IntervieweeList';
import InterviewHistory from './pages/InterviewHistory';
import TopCandidates from './pages/TopCandidates';
import { useNavigate, useLocation } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (!isAdminPage) return null;

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Interview System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/admin')}
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/admin/create')}
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Create Interview
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/admin/history')}
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            History
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<AdminLanding />} />
            <Route path="/admin/create" element={<CreateInterview />} />
            <Route path="/admin/top-candidates" element={<TopCandidates />} />
            <Route path="/admin/interviewees" element={<IntervieweeList />} />
            <Route path="/admin/history" element={<InterviewHistory />} />
            <Route path="/admin/history/:dateId" element={<IntervieweeList />} />
            <Route path="/reserve" element={<ReserveSlot />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App; 