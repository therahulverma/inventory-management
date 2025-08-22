import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../../components/select/select";
import { Button, Paper, TextField } from "@mui/material";

// const apiEndpoints = {
//   brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Brands`,
//   size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Size`,
//   color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/color`,
//   os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Operating%20System`,
// };

// Cities
const cities = [
  { id: 1, name: "City", value: "Delhi", description: "", isActive: "Y" },
  { id: 2, name: "City", value: "Mumbai", description: "", isActive: "Y" },
  { id: 3, name: "City", value: "Bengaluru", description: "", isActive: "Y" },
  { id: 4, name: "City", value: "Chennai", description: "", isActive: "Y" },
  { id: 5, name: "City", value: "Kolkata", description: "", isActive: "Y" },
];

// States
const states = [
  {
    id: 6,
    name: "State",
    value: "Maharashtra",
    description: "",
    isActive: "Y",
  },
  { id: 7, name: "State", value: "Karnataka", description: "", isActive: "Y" },
  { id: 8, name: "State", value: "Tamil Nadu", description: "", isActive: "Y" },
  {
    id: 9,
    name: "State",
    value: "Uttar Pradesh",
    description: "",
    isActive: "Y",
  },
  {
    id: 10,
    name: "State",
    value: "West Bengal",
    description: "",
    isActive: "Y",
  },
];

// Suppliers
const suppliers = [
  {
    id: 11,
    name: "Supplier",
    value: "Reliance Retail",
    description: "",
    isActive: "Y",
  },
  {
    id: 12,
    name: "Supplier",
    value: "Tata Trent",
    description: "",
    isActive: "Y",
  },
  {
    id: 13,
    name: "Supplier",
    value: "Future Group",
    description: "",
    isActive: "Y",
  },
  {
    id: 14,
    name: "Supplier",
    value: "Aditya Birla Retail",
    description: "",
    isActive: "Y",
  },
  { id: 15, name: "Supplier", value: "DMart", description: "", isActive: "Y" },
];

function StockLocationForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const [options, setOptions] = useState({
    city: [],
    state: [],
    supplier: [],
  });

  //   {
  //     name: "",
  //     address: "",
  //     city: "",
  //     state: "",
  //     country: "India",
  //     postalCode: "",
  //     capacity: 0,
  //     phone: "",
  //     email: "",
  //     isActive: true,
  //   }

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    supplier: "",
    gst: "",
    city: "",
    state: "",
    postalCode: "",
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

        setOptions({
          city: cities || [],
          state: states || [],
          supplier: suppliers || [],
        });
      } catch (error) {
        console.error("Error fetching options", error);
      }
    })();

    if (isEditMode) {
      axios
        .get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses/${id}`
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
      "name",
      "address",
      "supplier",
      "gst",
      "city",
      "state",
      "postalCode",
    ];

    const missing = requiredFields.filter((f) => !formData[f]);

    if (missing.length > 0) {
      alert(`Missing fields: ${missing.join(", ")}`);
      return;
    }

    console.log("Submitting:", formData);

    const payload = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: "India",
      postalCode: formData.postalCode,
      capacity: 0,
      phone: "1234",
      email: "abc@gmailcom",
      isActive: true,
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses/${id}`,
          payload
        );
        alert("Location updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`,
          payload
        );
        alert("Location created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/stock/locations");
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
                      label="Warehouse Name"
                      size="small"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Address"
                      size="small"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="GST Number"
                      size="small"
                      value={formData.gst}
                      onChange={(e) => {
                        let value = e.target.value.toUpperCase();
                        if (/^[0-9A-Z]*$/.test(value)) {
                          // ✅ Limit max length to 15 characters
                          if (value.length <= 15) {
                            handleChange("gst", value);
                          }
                        }
                      }}
                    />
                  </div>
                  <SelectField
                    label="Supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    options={options.supplier}
                    required
                  />
                  <SelectField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    options={options.city}
                    required
                  />
                  <SelectField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    options={options.state}
                    required
                  />
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Pin Code"
                      size="small"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value)
                      }
                      disabled={isEditMode}
                    />
                  </div>

                  <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? "Update Location" : "Create Location"}
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

export default React.memo(StockLocationForm);
