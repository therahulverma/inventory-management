import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../../components/select/select";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import DynamicForm from "../../../components/form/form";
import Cookies from "js-cookie";

// const apiEndpoints = {
//   brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Brands`,
//   size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Size`,
//   color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/color`,
//   os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Operating%20System`,
// };

function StockLocationForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const cachedToken = Cookies.get("token");
  const isEditMode = Boolean(id);
  const [suppliers, setSuppliers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [supplierID, setSupplierID] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    supplier: "",
    // gst: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    capacity: "",
  });

  const handleCountry = async (e) => {
    setFormData({ ...formData, country: e.target.value });
  };

  const handleSupplier = async (e) => {
    setSupplierID(e.target.value);
    setFormData({ ...formData, supplier: e.target.value });
  };
  const handleState = async (e) => {
    setFormData({ ...formData, state: e.target.value });
  };

  const handleCity = async (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  useEffect(() => {
    (async () => {
      try {
        const [countryRes, supplierRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/country`,
            {
              headers: {
                Authorization: `Bearer ${cachedToken}`,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/suppliers/names`,
            {
              headers: {
                Authorization: `Bearer ${cachedToken}`,
              },
            }
          ),
        ]);
        setCountries(countryRes.data?.data || []);
        setSuppliers(supplierRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    axios
      .get(
        `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cachedToken}`,
          },
        }
      )
      .then((res) => {
        const { data } = res.data;
        setFormData({
          name: data.name,
          address: data.address,
          supplier: data.supplierId,
          country: data.country,
          state: data.state,
          city: data.city,
          postalCode: data.postalCode,
          capacity: data.capacity,
        });
      })
      .catch((err) => console.error("Error fetching location:", err));
  }, [id, isEditMode]);

  useEffect(() => {
    if (!formData.country) return;

    const selected = countries.find((c) => c.value === formData.country);
    if (!selected) return;

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/children/${selected.shortCode}`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        setStates(res.data?.data || []);

        // ❌ remove unconditional reset
        if (!isEditMode) {
          setCities([]);
          setFormData((prev) => ({ ...prev, state: "", city: "" }));
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    })();
  }, [formData.country, countries, isEditMode]);

  // ✅ Fetch cities when state changes
  useEffect(() => {
    if (!formData.state) return;

    const selected = states.find((s) => s.value === formData.state);
    if (!selected) return;

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/children/${selected.shortCode}`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        setCities(res.data?.data || []);

        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, city: "" }));
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    })();
  }, [formData.state, states, isEditMode]);

  const formConfig = [
    {
      name: "name",
      label: "Warehouse Name",
      type: "text",
      required: true,
      validate: (val) => (val ? null : "Warehouse name is required"),
    },

    {
      name: "supplier",
      label: "Supplier",
      type: "custom-component",
      required: true,
      options: suppliers,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`supplier-label`} required={true}>
              Supplier
            </InputLabel>
            <Select
              labelId={`supplier-label`}
              id="Supplier"
              value={formData.supplier}
              label="Supplier"
              onChange={handleSupplier}
              disabled={false}
            >
              {suppliers.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.id}>
                  {opt.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "text",
      required: true,
      transform: (val) => val,
      validate: (val) => {
        if (!/^\d+$/.test(val)) {
          return "Only numbers are allowed";
        }
        if (Number(val) > 10000) {
          return "Value must not exceed 10000";
        }
      },
      // maxLength: 15,
    },
    {
      name: "country",
      label: "Country",
      type: "custom-component",
      options: countries,
      required: true,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`country-label`} required={true}>
              Country
            </InputLabel>
            <Select
              labelId={`country-label`}
              id="Country"
              value={formData.country || ""}
              label="Country"
              onChange={handleCountry}
              disabled={false}
            >
              {countries.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.value}>
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "state",
      label: "State",
      type: "custom-component",
      options: states,
      required: true,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`state-label`} required={true}>
              State
            </InputLabel>
            <Select
              labelId={`state-label`}
              id="State"
              value={formData.state}
              label="State"
              onChange={handleState}
              disabled={false}
            >
              {states.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.value}>
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "city",
      label: "City",
      type: "custom-component",
      options: cities,
      required: true,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`city-label`} required={true}>
              City
            </InputLabel>
            <Select
              labelId={`city-label`}
              id="City"
              value={formData.city}
              label="City"
              onChange={handleCity}
              disabled={false}
            >
              {cities.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.value}>
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "postalCode",
      label: "Pin Code",
      type: "text",
      required: true,
      transform: (val) => val,
      validate: (val) =>
        /^\d{6}$/.test(val) ? null : "Invalid Pin Code (must be 6 digits)",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
      transform: (val) => val,
      validate: (val) => (val ? null : "Address is required"),
    },
  ];

  console.log(formData, "form data");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const requiredFields = [
      "name",
      "address",
      "supplier",
      // "gst",
      "country",
      "city",
      "state",
      "postalCode",
      "capacity",
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
      country: formData.country,
      postalCode: formData.postalCode,
      capacity: formData.capacity,
      phone: "1234",
      email: "abc@gmailcom",
      isActive: true,
      supplierId: formData.supplier,
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        alert("Warehouse updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        alert("Warehouse created successfully!");
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
            <DynamicForm
              formData={formData}
              setFormData={setFormData}
              formConfig={formConfig}
              isEditMode={isEditMode}
              handleSubmit={handleSubmit}
              createButtonText="Create Warehouse"
              updateButtonText="Update Warehouse"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StockLocationForm);
