import React from 'react';
import { Field as FormikField, ErrorMessage } from 'formik';
import { TextField } from '@material-ui/core';

const Fields = ({ name,type, label, variant, size, fullWidth,touched,errors }) => {
  
  const error = errors[name] && touched[name];
  return (
    <FormikField
      as={TextField}
      type={type}
      name={name}
      label={label}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      error={error}
      helperText={<ErrorMessage name={name} />}
    />
  );
};

export default Fields;
