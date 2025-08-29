import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SELECT_TYPE } from "../../utils/constants";

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
  disabled,
  type,
}) {
  return (
    <div style={{ width: "45%", margin: 5 }}>
      <FormControl fullWidth size="small" required={required}>
        <InputLabel id={`${name}-label`} required={required}>
          {label}
        </InputLabel>
        {SELECT_TYPE.SELECT_NORMAL && (
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
        )}
        {SELECT_TYPE.SELECT_COUNTRY && (
          <Select
            labelId={`${name}-label`}
            id={label}
            value={value || ""}
            label={label}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
          >
            {options.map((opt) => (
              <MenuItem key={opt.id.toString()} value={opt.shortCode}>
                {opt.value}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    </div>
  );
}

export default SelectField;
