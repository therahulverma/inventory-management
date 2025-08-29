import { TextField, TextareaAutosize } from "@mui/material";
import SelectField from "../../components/select/select";
import { SELECT_TYPE } from "../../utils/constants";

function DynamicField({ field, value, onChange, isEditMode, onBlur }) {
  const { name, label, type, required, disabledOnEdit, options } = field;

  switch (type) {
    case "text":
    case "number":
      return (
        <TextField
          key={name}
          fullWidth
          required={required}
          label={label}
          size="small"
          type={type === "number" ? "text" : "text"} // use regex to allow only digits
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={(e) => onBlur(name, e.target.value)}
          disabled={disabledOnEdit && isEditMode}
          style={{ width: "45%", margin: 5 }}
        />
      );

    case "select":
      return (
        <SelectField
          key={name}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          options={options || []}
          required={required}
          type={SELECT_TYPE.SELECT_NORMAL}
        />
      );

    case "select-country":
      return (
        <SelectField
          key={name}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          options={options || []}
          required={required}
          type={SELECT_TYPE.SELECT_COUNTRY}
        />
      );

    case "textarea":
      return (
        <div key={name} style={{ width: "100%", margin: 5 }}>
          <TextareaAutosize
            aria-label={label}
            placeholder={label}
            style={{ width: "100%", minHeight: 120 }}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            required={required}
          />
        </div>
      );

    default:
      return null;
  }
}

export default DynamicField;
