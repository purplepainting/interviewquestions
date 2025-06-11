import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
  Grid,
  Paper,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

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
}

interface InterviewFormProps {
  initialData?: any;
  onComplete: (data: any) => void;
}

const LOCATIONS = [
  'Santa Barbara',
  'Ventura',
  'Lompoc',
  'Santa Maria',
  'Oxnard'
];

const InterviewForm: React.FC<InterviewFormProps> = ({ initialData, onComplete }) => {
  const [formData, setFormData] = useState<InterviewData>({
    date: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    location: 'Santa Barbara',
    position: 'Helper',
    bilingual: 'No',
    desiredRate: '',
    startRate: '',
    experience: 0,
    previousCompanies: '',
    skills: {
      painting: false,
      staining: false,
      spraying: false,
    },
    transportation: 'None',
    hasTools: 'No',
    okWithPayroll: 'No',
    felonyConviction: 'No',
    okWithWeekends: 'No',
    hobbies: '',
    firedBefore: 'No',
    firingReason: '',
    rating: 0,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                label="Location"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              <Typography variant="subtitle1">Position</Typography>
              <RadioGroup
                row
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as 'Helper' | 'Painter' | 'Foreman' })}
              >
                <FormControlLabel value="Helper" control={<Radio />} label="Helper" />
                <FormControlLabel value="Painter" control={<Radio />} label="Painter" />
                <FormControlLabel value="Foreman" control={<Radio />} label="Foreman" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Are you Bilingual?</Typography>
              <RadioGroup
                row
                value={formData.bilingual}
                onChange={(e) => setFormData({ ...formData, bilingual: e.target.value as 'Yes' | 'No' })}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Desired Rate of Pay"
              value={formData.desiredRate}
              onChange={(e) => setFormData({ ...formData, desiredRate: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Willing to start at for 90 days"
              value={formData.startRate}
              onChange={(e) => setFormData({ ...formData, startRate: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Years of Experience</Typography>
            <RadioGroup
              row
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
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
              onChange={(e) => setFormData({ ...formData, previousCompanies: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Painting Skills</Typography>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.skills.painting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, painting: e.target.checked },
                      })
                    }
                  />
                }
                label="Painting"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.skills.staining}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, staining: e.target.checked },
                      })
                    }
                  />
                }
                label="Staining"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.skills.spraying}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, spraying: e.target.checked },
                      })
                    }
                  />
                }
                label="Spraying"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Transportation</Typography>
              <RadioGroup
                row
                value={formData.transportation}
                onChange={(e) => setFormData({ ...formData, transportation: e.target.value as 'Truck' | 'Car' | 'None' })}
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
                onChange={(e) => setFormData({ ...formData, hasTools: e.target.value as 'Yes' | 'No' })}
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
                onChange={(e) => setFormData({ ...formData, okWithPayroll: e.target.value as 'Yes' | 'No' })}
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
                onChange={(e) => setFormData({ ...formData, felonyConviction: e.target.value as 'Yes' | 'No' })}
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
                onChange={(e) => setFormData({ ...formData, okWithWeekends: e.target.value as 'Yes' | 'No' })}
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
              onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Fired before?</Typography>
              <RadioGroup
                row
                value={formData.firedBefore}
                onChange={(e) => setFormData({ ...formData, firedBefore: e.target.value as 'Yes' | 'No' })}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {formData.firedBefore === 'Yes' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Reason for being fired"
                value={formData.firingReason}
                onChange={(e) => setFormData({ ...formData, firingReason: e.target.value })}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1">Rating (1-5)</Typography>
            <RadioGroup
              row
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <FormControlLabel
                  key={rating}
                  value={rating}
                  control={<Radio />}
                  label={rating}
                />
              ))}
            </RadioGroup>
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
      </form>
    </Paper>
  );
};

export default InterviewForm; 