import React, {useState, useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
  Snackbar,
} from '@mui/material';
import {
  PersonAddOutlined,
  SaveOutlined,
  ClearOutlined,
  PersonOutline,
  Schedule,
  Emergency,
  ContactPhone,
} from '@mui/icons-material';
import {registerPatientWithQueue} from '../features/patientSlice';

// Validation schema
const patientSchema = yup.object({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  date_of_birth: yup
    .string()
    .required('Date of birth is required')
    .test('valid-date', 'Please enter a valid date', function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    }),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number (e.g., 1234567890 or +1234567890)'
    ),
  email: yup.string().email('Please enter a valid email address').nullable(),
  address: yup.string().nullable(),
  checkup_type: yup
    .string()
    .required('Checkup type is required')
    .min(3, 'Checkup type must be at least 3 characters'),
  priority: yup
    .number()
    .required('Priority is required')
    .min(0, 'Priority must be 0 or greater')
    .max(2, 'Priority must be 2 or less'),
  symptoms: yup.string().nullable(),
  emergency_contact: yup
    .string()
    .nullable()
    .test(
      'phone-format',
      'Please enter a valid phone number (e.g., 1234567890 or +1234567890)',
      function (value) {
        if (!value) return true; // Optional field
        return /^[\+]?[1-9][\d]{0,15}$/.test(value);
      }
    ),
  estimated_wait_time: yup
    .number()
    .required('Estimated wait time is required')
    .min(0, 'Wait time must be 0 or greater')
    .max(480, 'Wait time cannot exceed 8 hours (480 minutes)'),
});

const PatientRegistration = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {isLoading, error} = useSelector((state) => state.patients);

  const defaultValues = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      checkup_type: '',
      priority: 0,
      symptoms: '',
      emergency_contact: '',
      estimated_wait_time: 30,
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid, isDirty},
    setValue,
  } = useForm({
    resolver: yupResolver(patientSchema),
    mode: 'onChange',
    defaultValues,
  });

  const handleDateChange = useCallback(
    (fieldName, value) => {
      console.log(`📅 Date change for ${fieldName}:`, value);
      console.log(`📅 Date change type:`, typeof value);

      if (value && typeof value === 'string') {
        // Ensure we only get the date part
        const dateOnly = value.split('T')[0];
        console.log(`✅ Extracted date only:`, dateOnly);

        // Update the form with the clean date
        setValue(fieldName, dateOnly);
      }
    },
    [setValue]
  );

  const FormField = useCallback(
    ({
      name,
      label,
      type = 'text',
      required = false,
      multiline = false,
      rows = 1,
      placeholder = '',
      inputProps = {},
      select = false,
      options = [],
      helperText = '',
      control,
      errors,
    }) => (
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            type={type}
            required={required}
            multiline={multiline}
            rows={rows}
            placeholder={placeholder}
            variant="outlined"
            size="medium"
            error={!!errors[name]}
            helperText={errors[name]?.message || helperText}
            className="search-field focus-ring"
            InputLabelProps={type === 'date' ? {shrink: true} : {}}
            inputProps={inputProps}
            select={select}
            SelectProps={
              select ? {MenuProps: {PaperProps: {style: {maxHeight: 200}}}} : {}
            }
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);

              // Special handling for date fields
              if (type === 'date') {
                handleDateChange(name, value);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: multiline ? 'auto' : '56px',
                '& fieldset': {
                  borderColor: errors[name] ? '#ef4444' : '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: errors[name] ? '#ef4444' : '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: errors[name] ? '#ef4444' : '#3b82f6',
                },
              },
              '& .MuiInputLabel-root': {
                color: errors[name] ? '#ef4444' : '#6b7280',
              },
              '& .MuiFormHelperText-root': {
                marginLeft: 0,
                marginRight: 0,
              },
            }}>
            {select &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        )}
      />
    ),
    [control, errors, handleDateChange]
  );

  const FormSection = useCallback(
    ({title, description, icon, children, color = 'blue'}) => (
      <Grid item xs={12} className="w-full">
        <Box
          className={`bg-${color}-50/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-${color}-200/50`}>
          <Box className="flex items-center space-x-3 mb-6">
            <Box className={`p-3 bg-${color}-100 rounded-xl`}>{icon}</Box>
            <Box>
              <Typography
                variant="h5"
                className={`font-semibold text-${color}-800 mb-1`}>
                {title}
              </Typography>
              <Typography variant="body2" className={`text-${color}-700`}>
                {description}
              </Typography>
            </Box>
          </Box>
          {children}
        </Box>
      </Grid>
    ),
    []
  );

  const transformFormData = useCallback((data) => {
    // Format date to remove time information - backend expects date only
    const formatDate = (dateString) => {
      if (!dateString) return null;

      console.log('🔍 Original date string:', dateString);
      console.log('🔍 Type of date string:', typeof dateString);

      // Handle different date formats
      let date;
      if (typeof dateString === 'string') {
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          console.log('✅ Date is already in correct format:', dateString);
          return dateString;
        }

        // If it's a datetime string, extract just the date part
        if (dateString.includes('T')) {
          console.log('🔄 Converting datetime to date:', dateString);
          const datePart = dateString.split('T')[0];
          console.log('✅ Extracted date part:', datePart);
          return datePart;
        }

        // Parse the date string
        date = new Date(dateString);
      } else {
        date = dateString;
      }

      console.log('🔍 Parsed date object:', date);
      console.log('🔍 Date validity:', !isNaN(date.getTime()));

      if (isNaN(date.getTime())) {
        console.error('❌ Invalid date:', dateString);
        return null;
      }

      // Format to YYYY-MM-DD without timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      console.log('✅ Formatted date:', formattedDate);
      return formattedDate;
    };

    const transformed = {
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: formatDate(data.date_of_birth),
      gender: data.gender,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      emergency_contact: data.emergency_contact || null,
      medical_history: data.symptoms || null,
      checkup_type: data.checkup_type,
      priority: parseInt(data.priority),
      notes: data.symptoms || null,
      estimated_wait_time: parseInt(data.estimated_wait_time) || 30,
    };

    console.log('🚀 Final transformed data:', transformed);
    return transformed;
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        console.log('📝 Form submitted with data:', data);
        console.log('📅 Date of birth from form:', data.date_of_birth);
        console.log('📅 Date of birth type:', typeof data.date_of_birth);

        // Force date formatting before submission
        let processedData = {...data};
        if (data.date_of_birth) {
          // Ensure date is in correct format
          if (
            typeof data.date_of_birth === 'string' &&
            data.date_of_birth.includes('T')
          ) {
            const dateOnly = data.date_of_birth.split('T')[0];
            console.log(
              '🔄 Force converting datetime to date:',
              data.date_of_birth,
              '→',
              dateOnly
            );
            processedData.date_of_birth = dateOnly;
          }
        }

        const transformedData = transformFormData(processedData);
        console.log('🔄 Original form data:', data);
        console.log('🔄 Processed form data:', processedData);
        console.log(
          '🚀 Transformed data being sent to backend:',
          transformedData
        );
        console.log('📅 Final date of birth:', transformedData.date_of_birth);

        await dispatch(registerPatientWithQueue(transformedData)).unwrap();
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/queue');
        }, 2000);
      } catch (error) {
        console.error('❌ Failed to register patient:', error);
        // Error is already handled by Redux state
      }
    },
    [dispatch, navigate, transformFormData]
  );

  const handleClear = useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const getCurrentDate = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  return (
    <Box className="max-w-6xl mx-auto space-y-8 fade-in">
      {/* Header Section */}
      <Box className="text-center">
        <Box className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg">
          <PersonAddOutlined className="text-4xl text-blue-600" />
        </Box>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          className="font-bold text-slate-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Patient Registration
        </Typography>
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          className="text-slate-600 font-normal">
          Add new patients to the queue management system
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="content-spacing slide-up mb-6">
          {error}
        </Alert>
      )}

      {/* Form Section */}
      <Paper
        elevation={0}
        className="card p-8 slide-up"
        style={{animationDelay: '200ms'}}>
        {/* Form Validation Summary */}
        <Box className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center space-x-3">
              <Box className="p-2 bg-blue-100 rounded-lg">
                <PersonAddOutlined className="text-blue-600" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  className="font-semibold text-blue-800">
                  Form Status
                </Typography>
                <Typography variant="body2" className="text-blue-700">
                  {isValid
                    ? 'All fields are valid ✓'
                    : 'Please complete all required fields'}
                </Typography>
              </Box>
            </Box>
            <Box className="text-right">
              <Typography
                variant="h4"
                className={`font-bold ${
                  isValid ? 'text-green-600' : 'text-blue-600'
                }`}>
                {Object.keys(errors).length === 0
                  ? '✓'
                  : Object.keys(errors).length}
              </Typography>
              <Typography variant="caption" className="text-blue-600">
                {Object.keys(errors).length === 0 ? 'Ready' : 'Errors'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <FormSection
              title="Basic Information"
              description="Enter the patient's personal details"
              icon={<PersonOutline className="text-2xl text-blue-600" />}
              color="blue">
              <Grid container spacing={4}>
                <div className="flex justify-between items-start w-full space-x-3">
                  <Grid item xs={12} className="w-full">
                    <FormField
                      className="w-[150px]"
                      name="first_name"
                      label="First Name"
                      required
                      placeholder="Enter first name"
                      control={control}
                      errors={errors}
                    />
                  </Grid>

                  <Grid item xs={12} className="w-full">
                    <FormField
                      className="w-full"
                      name="last_name"
                      label="Last Name"
                      required
                      placeholder="Enter last name"
                      control={control}
                      errors={errors}
                    />
                  </Grid>

                  <Grid item xs={12} className="w-full">
                    <FormField
                      className="w-full"
                      name="date_of_birth"
                      label="Date of Birth"
                      type="date"
                      required
                      inputProps={{max: getCurrentDate()}}
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </div>
                <div className="flex justify-between items-start w-full space-x-3">
                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      className="!w-full"
                      name="gender"
                      label="Gender"
                      select
                      required
                      options={[
                        {value: 'male', label: 'Male'},
                        {value: 'female', label: 'Female'},
                        {value: 'other', label: 'Other'},
                      ]}
                      control={control}
                      errors={errors}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      name="phone"
                      label="Phone Number"
                      required
                      placeholder="Enter phone number"
                      helperText="Enter phone number without spaces (e.g., 1234567890)"
                      control={control}
                      errors={errors}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="Enter email address (optional)"
                      helperText="Optional - for appointment confirmations"
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </div>

                <Grid item xs={12} className="w-full">
                  <FormField
                    name="address"
                    label="Address"
                    multiline
                    rows={2}
                    placeholder="Enter full address (optional)"
                    control={control}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Appointment Details */}
            <FormSection
              title="Appointment Details"
              description="Schedule and prioritize the appointment"
              icon={<Schedule className="text-2xl text-emerald-600" />}
              color="emerald">
              <Grid container spacing={4}>
                <div className="flex justify-between items-start w-full space-x-3">
                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      className="w-full"
                      name="checkup_type"
                      label="Checkup Type"
                      required
                      placeholder="e.g., General Checkup, Consultation"
                      control={control}
                      errors={errors}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      className="w-full"
                      name="priority"
                      label="Priority Level"
                      select
                      required
                      options={[
                        {value: 0, label: 'Normal'},
                        {value: 1, label: 'Urgent'},
                        {value: 2, label: 'Emergency'},
                      ]}
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </div>
                <Grid item xs={12} className="w-full">
                  <FormField
                    className="w-full"
                    name="symptoms"
                    label="Symptoms/Reason for Visit"
                    multiline
                    rows={3}
                    placeholder="Describe the patient's symptoms or reason for the appointment..."
                    control={control}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Emergency Contact */}
            <FormSection
              title="Emergency Contact (Optional)"
              description="Additional contact information for emergencies"
              icon={<ContactPhone className="text-2xl text-orange-600" />}
              color="orange">
              <Grid container spacing={4}>
                <div className="flex justify-between items-start w-full space-x-3">
                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      name="emergency_contact"
                      label="Emergency Contact Phone"
                      placeholder="Enter emergency contact phone (optional)"
                      helperText="Optional - for urgent situations"
                      control={control}
                      errors={errors}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="w-full">
                    <FormField
                      name="estimated_wait_time"
                      label="Estimated Wait Time (minutes)"
                      type="number"
                      required
                      inputProps={{min: 0, max: 480}}
                      placeholder="30"
                      helperText="Estimated time until patient can be seen"
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </div>
              </Grid>
            </FormSection>
          </Grid>

          {/* Action Buttons */}
          <Box className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-10">
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearOutlined />}
              className="btn-secondary focus-ring"
              size="large"
              type="button"
              disabled={!isDirty}>
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !isValid}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <SaveOutlined />
              }
              className="btn-primary focus-ring"
              size="large">
              {isLoading ? 'Registering Patient...' : 'Register Patient'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{width: '100%'}}>
          Patient registered successfully! Redirecting to queue...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientRegistration;
