import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import IntervieweeList from './components/IntervieweeList';
import AdminLanding from './pages/AdminLanding';
import CreateInterview from './pages/CreateInterview';
import ReserveSlot from './pages/ReserveSlot';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Purple Painting Interview System
        </Typography>
        {isAdminPage ? (
          <>
            <Button color="inherit" component={Link} to="/admin">
              Admin Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/admin/create">
              Create Interview
            </Button>
            <Button color="inherit" component={Link} to="/admin/interviewees">
              View Interviewees
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/admin">
            Admin Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Container>
        <Routes>
          <Route path="/" element={<ReserveSlot />} />
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/admin/create" element={<CreateInterview />} />
          <Route path="/admin/interviewees" element={<IntervieweeList />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App; 