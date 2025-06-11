import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  FormGroup,
  Rating,
  InputAdornment,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface InterviewData {
  date: string;
  name: string;
  phone: string;
  location: string;
  position: 'Helper' | 'Painter' | 'Foreman';
  bilingual: 'Yes' | 'No';
  desiredRate: string;
  startRate: string;
  experience: number;
  previousCompanies: string;
  skills: {
    painting: boolean;
    staining: boolean;
    spraying: boolean;
  };
  transportation: 'Truck' | 'Car' | 'None';
  hasTools: 'Yes' | 'No';
  okWithPayroll: 'Yes' | 'No';
  felonyConviction: 'Yes' | 'No';
  okWithWeekends: 'Yes' | 'No';
  hobbies: string;
  firedBefore: 'Yes' | 'No';
  firingReason: string;
  rating: number;
  notes: string;
}

interface InterviewFormProps {
  initialData?: any;
  onComplete: (data: any) => void;
  interviewDate?: string;
}

const LOCATIONS = [
  'Santa Barbara',
  'Ventura',
  'Lompoc',
  'Santa Maria',
  'Oxnard'
];

const InterviewForm: React.FC<InterviewFormProps> = ({ initialData, onComplete, interviewDate }) => {
  const [formData, setFormData] = useState<InterviewData>({
    date: interviewDate || new Date().toISOString().split('T')[0],
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    location: initialData?.location || 'Santa Barbara',
    position: initialData?.position || 'Helper',
    bilingual: initialData?.bilingual || 'No',
    desiredRate: initialData?.desiredRate || '',
    startRate: initialData?.startRate || '',
    experience: initialData?.experience || 0,
    previousCompanies: initialData?.previousCompanies || '',
    skills: initialData?.skills || {
      painting: false,
      staining: false,
      spraying: false,
    },
    transportation: initialData?.transportation || 'None',
    hasTools: initialData?.hasTools || 'No',
    okWithPayroll: initialData?.okWithPayroll || 'No',
    felonyConviction: initialData?.felonyConviction || 'No',
    okWithWeekends: initialData?.okWithWeekends || 'No',
    hobbies: initialData?.hobbies || '',
    firedBefore: initialData?.firedBefore || 'No',
    firingReason: initialData?.firingReason || '',
    rating: initialData?.rating || 0,
    notes: initialData?.notes || '',
    ...initialData,
  });

  const [showFiringReason, setShowFiringReason] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'firedBefore' && value === 'Yes') {
      setShowFiringReason(true);
    } else if (name === 'firedBefore' && value === 'No') {
      setShowFiringReason(false);
      setFormData(prev => ({
        ...prev,
        firingReason: ''
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (skill: keyof typeof formData.skills) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: e.target.checked }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Desired Rate of Pay"
              type="number"
              value={formData.startRate}
              onChange={(e) => setFormData({ ...formData, startRate: e.target.value.toString() })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                label="Location"
                onChange={handleSelectChange}
                name="location"
              >
                {LOCATIONS.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Are you Bilingual?</Typography>
              <RadioGroup
                row
                value={formData.bilingual}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Years of Experience</Typography>
            <RadioGroup
              row
              value={formData.experience}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                <FormControlLabel
                  key={year}
                  value={year}
                  control={<Radio />}
                  label={year === 10 ? '10+' : year}
                />
              ))}
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Previous Companies"
              value={formData.previousCompanies}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Painting Skills
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.skills.painting}
                    onChange={handleSkillsChange('painting')}
                  />
                }
                label="Painting"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.skills.staining}
                    onChange={handleSkillsChange('staining')}
                  />
                }
                label="Staining"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.skills.spraying}
                    onChange={handleSkillsChange('spraying')}
                  />
                }
                label="Spraying"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Transportation</Typography>
              <RadioGroup
                row
                value={formData.transportation}
                onChange={handleChange}
              >
                <FormControlLabel value="Truck" control={<Radio />} label="Truck" />
                <FormControlLabel value="Car" control={<Radio />} label="Car" />
                <FormControlLabel value="None" control={<Radio />} label="None" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Do you have basic painters' tools?</Typography>
              <RadioGroup
                row
                value={formData.hasTools}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">OK with Payroll?</Typography>
              <RadioGroup
                row
                value={formData.okWithPayroll}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Felony Conviction?</Typography>
              <RadioGroup
                row
                value={formData.felonyConviction}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">OK with weekends?</Typography>
              <RadioGroup
                row
                value={formData.okWithWeekends}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Hobbies"
              value={formData.hobbies}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Have you ever been fired?</FormLabel>
              <RadioGroup
                name="firedBefore"
                value={formData.firedBefore}
                onChange={handleChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {showFiringReason && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for being fired"
                name="firingReason"
                value={formData.firingReason}
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Rating (1 = Poor, 5 = Excellent)</Typography>
              <Rating
                name="rating"
                value={formData.rating || 0}
                onChange={(_, newValue) => {
                  handleChange({ target: { name: 'rating', value: newValue || 0 } });
                }}
                precision={1}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Submit Interview
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default InterviewForm; 