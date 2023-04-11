import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const AutocompleteField = ({
  options,
  name,
  onChange,
  onBlur,
  value,
  error,
  label,
  helperText,
  getOptionSelected,
  getOptionLabel,
  multiple,
  placeholder,
  filterSelectedOptions,
  ...rest
}) => {
  return (
    <Autocomplete
    options={
      name === "Transaction"
        ? [...options].sort((a, b) => a.amount - b.amount)
        : options
    }
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          size="small"
          fullWidth
          error={error}
          placeholder={placeholder}
          helperText={helperText}
        />
      )}
      multiple={multiple}
     
      filterSelectedOptions={filterSelectedOptions}
      {...rest}
    />
  );
};

const FormAutocomplete = ({ name,placeholder, options,multiple,onChangeSelect,filterSelectedOptions, ...rest }) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const { errors, touched, setFieldValue, setFieldTouched } = form;
        const { value } = field;

        const handleChangeSelect = (event, value) => {
          setFieldValue(name, value);
          onChangeSelect && onChangeSelect(value);
        };

        const handleBlur = () => {
          setFieldTouched(name, true);
        };

        const error = errors[name] && touched[name];
        const helperText = <ErrorMessage name={name} />;

        return (
          <AutocompleteField
          options={
            name === "Transaction"
              ? [...options].sort((a, b) => a.amount - b.amount)
              : options
          }
            name={name}
            value={value}
            onChange={handleChangeSelect}
            onBlur={handleBlur}
            error={error}
            helperText={helperText}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            multiple={multiple}
            placeholder={placeholder}
            filterSelectedOptions={filterSelectedOptions}
            {...rest}

          />
        );
      }}
    </Field>
  );
};

const FormAutocompleteClient = ({ name, options, ...rest }) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const { errors, touched, setFieldValue, setFieldTouched } = form;
        const { value } = field;
        const handleChangeSelect = (event, value) => {
          setFieldValue(name, value);
        };
        const handleBlur = () => {
          setFieldTouched(name, true);
        };
        const error = errors[name] && touched[name];
        const helperText = <ErrorMessage name={name} />;

        return (
          <AutocompleteField
            options={options}
            name={name}
            value={value}
            onChange={handleChangeSelect}
            onBlur={handleBlur}
            error={error}
            helperText={helperText}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => name=='Payment' ? option.orderNumber+`-`+option.owner: option.fullName}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

export { FormAutocomplete, FormAutocompleteClient };
