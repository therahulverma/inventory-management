import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
  disabled,
}) {
  return (
    <div style={{ width: "45%", margin: 5 }}>
      <FormControl fullWidth size="small">
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={label}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
        >
          {options.map((opt) => (
            <MenuItem key={opt.id.toString()} value={opt.value}>
              {opt.value}
            </MenuItem>
          ))}
        </Select>
        {required && !value && (
          <FormHelperText>{label} is required</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}

export default SelectField;
