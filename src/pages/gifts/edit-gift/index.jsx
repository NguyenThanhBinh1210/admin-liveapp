import * as React from 'react';
import {
  Box,
  Button,
  Drawer,
  Grid,
  Stack,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createGiftAPI, updateGiftAPI } from '../../../api/auth';
import { EditOutlined } from '@ant-design/icons';

export default function EditGift({ gift }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError('');
    try {
      // Tạo object theo mong muốn
      const data = {
        name: values.name,
        iconUrl: values.iconUrl,
        price: parseFloat(values.price),
        status: values.status
      };
      console.log('Created object:', data);

      await updateGiftAPI(gift._id, data);
      // setOpen(false);
    } catch (err) {
      console.error('Create gift error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Tooltip title="Edit Gift">
        <IconButton size="small" variant="outlined" color="primary" onClick={toggleDrawer(true)}>
          <EditOutlined style={{ fontSize: '14px' }} />
        </IconButton>
      </Tooltip>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} sx={{ width: 500 }}>
        <Box sx={{ width: 400, p: 3 }}>
          <Formik
            initialValues={{
              name: gift.name,
              iconUrl: gift.imageUrl,
              price: gift.value,
              status: gift.isActive === true ? 'active' : 'inactive'
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Yêu cầu'),
              iconUrl: Yup.string().required('Yêu cầu'),
              price: Yup.number().typeError('Phải là số').positive('Lớn hơn 0').required('Yêu cầu'),
              status: Yup.string().required('Yêu cầu')
            })}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <Stack spacing={2}>
                  <div>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <OutlinedInput
                      id="name"
                      name="name"
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                    />
                    {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                  </div>
                  <div>
                    <InputLabel htmlFor="iconUrl">Icon URL</InputLabel>
                    <OutlinedInput
                      id="iconUrl"
                      name="iconUrl"
                      value={values.iconUrl}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={touched.iconUrl && Boolean(errors.iconUrl)}
                    />
                    {touched.iconUrl && errors.iconUrl && <FormHelperText error>{errors.iconUrl}</FormHelperText>}
                  </div>
                  <div>
                    <InputLabel htmlFor="price">Price</InputLabel>
                    <OutlinedInput
                      id="price"
                      name="price"
                      type="number"
                      value={values.price}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={touched.price && Boolean(errors.price)}
                    />
                    {touched.price && errors.price && <FormHelperText error>{errors.price}</FormHelperText>}
                  </div>
                  <div>
                    <InputLabel htmlFor="status">Status</InputLabel>
                    <Select
                      id="status"
                      name="status"
                      value={values.status}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={touched.status && Boolean(errors.status)}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                    {touched.status && errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
                  </div>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Drawer>
    </div>
  );
}
