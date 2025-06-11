import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import IntervieweeList from './components/IntervieweeList';
import AdminLanding from './pages/AdminLanding';
import CreateInterview from './pages/CreateInterview';
import ReserveSlot from './pages/ReserveSlot';

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Purple Painting Interview System
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Reserve Slot
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        </Toolbar>
      </AppBar>

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