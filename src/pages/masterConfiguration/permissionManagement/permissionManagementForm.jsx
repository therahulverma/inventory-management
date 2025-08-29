import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../../components/select/select";
import { Button, Paper, TextareaAutosize, TextField } from "@mui/material";

// const apiEndpoints = {
//   brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Brands`,
//   size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Size`,
//   color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/color`,
//   os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Operating%20System`,
// };

function PermissionManagementForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    accessKey: "",
    frontend: "FE",
    screen: "",
    section: "",
    subSection: "",
    action: "",
    category: "NA",
    description: "",
  });

  useEffect(() => {
    (async () => {
      try {
        // const [brand, size, color, os] = await Promise.all([
        //   axios.get(apiEndpoints.brand),
        //   axios.get(apiEndpoints.size),
        //   axios.get(apiEndpoints.color),
        //   axios.get(apiEndpoints.os),
        // ]);
      } catch (error) {
        console.error("Error fetching options", error);
      }
    })();

    if (isEditMode) {
      axios
        .get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/warehouses/${id}`
        )
        .then((res) => {
          const { data } = res.data;
          console.log("Updated Form Data:", data);
          setFormData({
            productName: data.name,
            sku: data.sku,
            price: data.basePrice,
            brand: data.brand,
            size: data.specification?.size || "",
            color: data.specification?.color || "",
            os: data.specification?.os || "",
            description: data.description,
          });
        })
        .catch((err) => console.error("Error fetching location:", err));
    }
  }, [id, isEditMode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const requiredFields = [
      "accessKey",
      "screen",
      "section",
      "subSection",
      "action",
    ];

    const missing = requiredFields.filter((f) => !formData[f]);

    if (missing.length > 0) {
      alert(`Missing fields: ${missing.join(", ")}`);
      return;
    }

    console.log("Submitting:", formData);

    const payload = {
      accessKey: formData.accessKey,
      frontend: "FE",
      screen: formData.screen,
      section: formData.section,
      subSection: formData.subSection,
      action: formData.action,
      category: "NA",
      description: formData.description,
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/warehouses/${id}`,
          payload
        );
        alert("Location updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/permissions`,
          payload
        );
        alert("Permission created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/role/permission-management");
    } catch (err) {
      console.error("Error saving location ❌:", err);
      alert("Failed to save location");
    }
  };

  return (
    <div className="jss1267">
      <div className="serviceOrderListContainer customerListPage">
        <div className="MuiPickTable">
          <div>
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
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Access Key"
                      size="small"
                      value={formData.name}
                      onChange={(e) =>
                        handleChange("accessKey", e.target.value)
                      }
                      disabled={isEditMode}
                    />
                  </div>
                  {/* <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="Frontend"
                      size="small"
                      value={formData.address}
                      onChange={(e) => handleChange("frontend", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div> */}
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Screen"
                      size="small"
                      value={formData.name}
                      onChange={(e) => handleChange("screen", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Section"
                      size="small"
                      value={formData.address}
                      onChange={(e) => handleChange("section", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Sub Section"
                      size="small"
                      value={formData.name}
                      onChange={(e) =>
                        handleChange("subSection", e.target.value)
                      }
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Action"
                      size="small"
                      value={formData.address}
                      onChange={(e) => handleChange("action", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div>
                  {/* <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="Category"
                      size="small"
                      value={formData.address}
                      onChange={(e) => handleChange("category", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div> */}
                  <div style={{ width: "100%", margin: 5 }}>
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Description"
                      style={{ width: "100%", minHeight: 120 }}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? "Update Permission" : "Create Permission"}
                  </Button>
                </div>
              </Paper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PermissionManagementForm);
