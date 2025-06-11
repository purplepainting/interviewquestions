import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import InterviewForm from './InterviewForm';

interface Interviewee {
  id: string;
  name: string;
  phone: string;
  interviewDate: string;
  confirmed: boolean;
  interviewCompleted: boolean;
  interviewData?: any; // Will store the interview form data
}

const IntervieweeList: React.FC = () => {
  const [interviewees, setInterviewees] = useState<Interviewee[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openInterview, setOpenInterview] = useState(false);
  const [selectedInterviewee, setSelectedInterviewee] = useState<Interviewee | null>(null);
  const [newInterviewee, setNewInterviewee] = useState({
    name: '',
    phone: '',
    interviewDate: new Date().toISOString().split('T')[0],
  });

  const handleAddInterviewee = () => {
    const newId = Date.now().toString();
    setInterviewees([
      ...interviewees,
      {
        id: newId,
        ...newInterviewee,
        confirmed: false,
        interviewCompleted: false,
      },
    ]);
    setOpenDialog(false);
    setNewInterviewee({
      name: '',
      phone: '',
      interviewDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleStartInterview = (interviewee: Interviewee) => {
    setSelectedInterviewee(interviewee);
    setOpenInterview(true);
  };

  const handleInterviewComplete = (interviewData: any) => {
    if (selectedInterviewee) {
      setInterviewees(interviewees.map(interviewee =>
        interviewee.id === selectedInterviewee.id
          ? { ...interviewee, interviewCompleted: true, interviewData }
          : interviewee
      ));
    }
    setOpenInterview(false);
    setSelectedInterviewee(null);
  };

  const handleConfirmAttendance = (id: string) => {
    setInterviewees(interviewees.map(interviewee =>
      interviewee.id === id
        ? { ...interviewee, confirmed: true }
        : interviewee
    ));
  };

  const handleCancelAttendance = (id: string) => {
    setInterviewees(interviewees.map(interviewee =>
      interviewee.id === id
        ? { ...interviewee, confirmed: false }
        : interviewee
    ));
  };

  const handleEditInterview = (interviewee: Interviewee) => {
    setSelectedInterviewee(interviewee);
    setOpenInterview(true);
  };

  const handleDeleteInterviewee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this interviewee?')) {
      setInterviewees(interviewees.filter(interviewee => interviewee.id !== id));
    }
  };

  const exportToCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedInterviews = interviewees.filter(i => i.interviewCompleted);
    
    if (completedInterviews.length === 0) {
      alert('No completed interviews to export');
      return;
    }

    const headers = [
      'Name',
      'Phone',
      'Interview Date',
      'Position',
      'Location',
      'Bilingual',
      'Experience',
      'Skills',
      'Transportation',
      'Has Tools',
      'OK with Payroll',
      'Felony Conviction',
      'OK with Weekends',
      'Rating'
    ].join(',');

    const rows = completedInterviews.map(interviewee => {
      const data = interviewee.interviewData;
      return [
        interviewee.name,
        interviewee.phone,
        interviewee.interviewDate,
        data.position,
        data.location,
        data.bilingual,
        data.experience,
        Object.entries(data.skills)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(';'),
        data.transportation,
        data.hasTools,
        data.okWithPayroll,
        data.felonyConviction,
        data.okWithWeekends,
        data.rating
      ].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `interviews_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Interviewee List</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mr: 2 }}
          >
            Add Interviewee
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            Export Today's Interviews
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Interview Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interviewees.map((interviewee) => (
              <TableRow key={interviewee.id}>
                <TableCell>{interviewee.name}</TableCell>
                <TableCell>{interviewee.phone}</TableCell>
                <TableCell>{interviewee.interviewDate}</TableCell>
                <TableCell>
                  {interviewee.interviewCompleted ? (
                    <Typography color="success.main">Completed</Typography>
                  ) : interviewee.confirmed ? (
                    <Typography color="info.main">Confirmed</Typography>
                  ) : (
                    <Typography color="warning.main">Pending</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {!interviewee.interviewCompleted ? (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleStartInterview(interviewee)}
                        sx={{ mr: 1 }}
                      >
                        Start Interview
                      </Button>
                      {!interviewee.confirmed && (
                        <Tooltip title="Confirm Attendance">
                          <IconButton
                            color="success"
                            onClick={() => handleConfirmAttendance(interviewee.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Cancel Attendance">
                        <IconButton
                          color="error"
                          onClick={() => handleCancelAttendance(interviewee.id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip title="Edit Interview">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditInterview(interviewee)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Interviewee">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteInterviewee(interviewee.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Interviewee Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Interviewee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newInterviewee.name}
            onChange={(e) => setNewInterviewee({ ...newInterviewee, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newInterviewee.phone}
            onChange={(e) => setNewInterviewee({ ...newInterviewee, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Interview Date"
            type="date"
            fullWidth
            value={newInterviewee.interviewDate}
            onChange={(e) => setNewInterviewee({ ...newInterviewee, interviewDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddInterviewee} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interview Form Dialog */}
      <Dialog
        open={openInterview}
        onClose={() => setOpenInterview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedInterviewee?.interviewCompleted ? 'Edit Interview' : 'New Interview'} for {selectedInterviewee?.name}
        </DialogTitle>
        <DialogContent>
          <InterviewForm
            initialData={{
              ...selectedInterviewee?.interviewData,
              name: selectedInterviewee?.name,
              phone: selectedInterviewee?.phone,
              date: selectedInterviewee?.interviewDate
            }}
            onComplete={handleInterviewComplete}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IntervieweeList; 