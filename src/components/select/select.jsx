import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
      <FormControl fullWidth size="small" required={required}>
        <InputLabel id={`${name}-label`} required={required}>
          {label}
        </InputLabel>
        <Select
          labelId={`${name}-label`}
          id={label}
          value={value || ""}
          label={label}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
        >
          {options.map((opt) => (
            <MenuItem key={opt.id.toString()} value={opt.value}>
              {opt.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectField;
