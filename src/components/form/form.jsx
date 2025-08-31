import { Button, Paper } from "@mui/material";
import DynamicField from "./dynamicFields";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DynamicForm({
  formConfig,
  formData,
  setFormData,
  isEditMode,
  handleSubmit,
  createButtonText,
  updateButtonText,
}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleChange = (field, value) => {
    const config = formConfig.find((f) => f.name === field);

    let finalValue = value;
    if (config?.transform) {
      finalValue = config.transform(value); // only clean, don’t validate here
    }

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const validateField = (field, value) => {
    const config = formConfig.find((f) => f.name === field);

    let finalValue = value;

    if (config?.validate) {
      const error = config.validate(value);

      if (error) {
        // alert(error); // show error once
        finalValue = ""; // clear value
        setErrors((prev) => ({ ...prev, [field]: error }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    }

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            padding: 25,
          }}
        >
          {formConfig.map((field) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "45%",
                margin: 5,
              }}
            >
              <DynamicField
                key={field?.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
                isEditMode={isEditMode}
                onBlur={validateField}
              />
              <span
                style={{
                  color: "red",
                  minHeight: "0.8rem",
                  fontSize: "0.8rem",
                  display: "block",
                }}
              >
                {errors[field?.name] || ""}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              gap: 10,
            }}
          >
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? updateButtonText : createButtonText}
            </Button>
          </div>
        </div>
      </Paper>
    </form>
  );
}

export default DynamicForm;
