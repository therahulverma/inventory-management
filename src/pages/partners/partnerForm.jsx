import React from "react";
import "../users/users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "../../components/form/form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Cookies from "js-cookie";

function PartnerForm() {
  const navigate = useNavigate();
  const cachedToken = Cookies.get("token");
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleCountry = async (e) => {
    setFormData({ ...formData, country: e.target.value });
  };

  const handleState = async (e) => {
    setFormData({ ...formData, state: e.target.value });
  };

  const handleCity = async (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  const formConfig = [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      transform: (val) => val.trim(),
      validate: (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : "Invalid email address",
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      transform: (val) => val.trim(),
      validate: (val) =>
        /^\d{10}$/.test(val) ? null : "Phone number must be exactly 10 digits",
      required: true,
    },
    {
      name: "gstin",
      label: "GSTIN",
      type: "text",
      transform: (val) => val.trim(),
      // ✅ GST number: 15 characters (alphanumeric, usually format: 2 digits + PAN + 1 char + Z + checksum)
      validate: (val) =>
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)
          ? null
          : "Invalid GSTIN (e.g., 27ABCDE1234F1Z5)",
      required: true,
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
      label: "Postal Code",
      type: "text",
      transform: (val) => val.trim(),
      validate: (val) => (/^\d{6}$/.test(val) ? null : "Invalid postal code"),
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const country = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/country`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        setCountries(country?.data?.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners/${id}`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        )
        .then((res) => {
          const { data } = res.data;
          setFormData({
            companyName: data.companyName,
            email: data.email,
            phone: data.phone,
            gstin: data.gstin,
            country: data.country,
            address: data.address,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
          });
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
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

  //   console.log("Options:", options);

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const requiredFields = [
      "companyName",
      "email",
      "phone",
      "gstin",
      "address",
      "country",
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
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      gstin: formData.gstin,
      address: formData.address,
      country: formData.country,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        alert("Partner updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        alert("Partner created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/partners");
    } catch (err) {
      console.error("Error saving product ❌:", err);
      alert(`Failed to save product: ${err.response.data.message}`);
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
              createButtonText="Create Partner"
              updateButtonText="Update Partner"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PartnerForm);
