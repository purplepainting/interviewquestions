import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@mui/material';
import IntervieweeList from './components/IntervieweeList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Purple color matching the company theme
    },
    secondary: {
      main: '#4a148c',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Purple Painting
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
            Interview Management System
          </Typography>
          <IntervieweeList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 