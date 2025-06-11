import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface ShortlistedCandidate {
  name: string;
  phone: string;
  position: string;
  startRate: string;
  rating: number;
  interviewDate: string;
}

const TopCandidates: React.FC = () => {
  const [shortlistedCandidates, setShortlistedCandidates] = useState<ShortlistedCandidate[]>([]);

  useEffect(() => {
    // Get all interviews from history
    const dates = JSON.parse(localStorage.getItem('interviewDates') || '[]');
    const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    const shortlisted: ShortlistedCandidate[] = [];
    
    // Check both current and past interviews
    [...dates, ...history].forEach((date: any) => {
      if (date.slots) {
        date.slots.forEach((slot: any) => {
          if (slot.interviewee && slot.interviewee.rating && (slot.interviewee.rating === 4 || slot.interviewee.rating === 5)) {
            shortlisted.push({
              name: slot.interviewee.name,
              phone: slot.interviewee.phone,
              position: slot.interviewee.position,
              startRate: slot.interviewee.startRate || 'Not specified',
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
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Top Rated Candidates
        </Typography>

        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Desired Rate</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Interview Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortlistedCandidates.length > 0 ? (
                  shortlistedCandidates.map((candidate, index) => (
                    <TableRow key={index}>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>{candidate.startRate}</TableCell>
                      <TableCell>{candidate.phone}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {candidate.rating}
                          <StarIcon sx={{ color: 'gold', ml: 0.5 }} />
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(candidate.interviewDate)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No candidates rated 4-5 stars yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default TopCandidates; 