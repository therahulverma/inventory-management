import React from "react";
import "../users/users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "../../components/form/form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function SupplierForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countryCode, setCountryCode] = useState(null);
  const [stateCode, setStateCode] = useState(null);
  const [cityCode, setCityCode] = useState(null);

  const handleCountry = async (e) => {
    setCountryCode(e.target.value);
  };

  const handleState = async (e) => {
    setStateCode(e.target.value);
  };

  const handleCity = async (e) => {
    setCityCode(e.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/children/${countryCode}`
        );

        setStates(data?.data);
        setFormData({ ...formData, country: countryCode });
      } catch (err) {
        alert("Error:", err);
        console.log("Error:", err);
      }
    }
    countryCode && fetchData();
  }, [countryCode]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/children/${stateCode}`
        );

        setCities(data?.data);
        setFormData({ ...formData, state: stateCode });
      } catch (err) {
        alert("Error:", err);
        console.log("Error:", err);
      }
    }
    stateCode && fetchData();
  }, [stateCode]);

  useEffect(() => {
    setFormData({ ...formData, city: cityCode });
  }, [cityCode]);

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
              value={countryCode}
              label="Country"
              onChange={handleCountry}
              disabled={false}
            >
              {countries.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.shortCode}>
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
              value={stateCode}
              label="State"
              onChange={handleState}
              disabled={false}
            >
              {states.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.shortCode}>
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
              value={cityCode}
              label="City"
              onChange={handleCity}
              disabled={false}
            >
              {cities.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.shortCode}>
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
      name: "pan",
      label: "PAN",
      type: "text",
      transform: (val) => val.trim(),
      validate: (val) =>
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)
          ? null
          : "Invalid PAN (e.g., ABCDE1234F)",
      required: true,
    },
    {
      name: "stateCode",
      label: "State Code",
      type: "text",
      transform: (val) => val.trim(),
      validate: (val) =>
        /^[0-9]{2}$/.test(val) ? null : "State code must be 2 digits",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
    },
  ];

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
    pan: "",
    stateCode: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const country = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/country`
        );
        setCountries(country?.data?.data);
        // const [brand, size, color, os] = await Promise.all([
        //   axios.get(apiEndpoints.brand),
        //   axios.get(apiEndpoints.size),
        //   axios.get(apiEndpoints.color),
        //   axios.get(apiEndpoints.os),
        // ]);
        // setOptions({
        //   brand: brand.data.data || [],
        //   size: size.data.data || [],
        //   color: color.data.data || [],
        //   os: os.data.data || [],
        // });
      } catch (error) {
        console.error("Error fetching options", error);
      }
    })();

    if (isEditMode) {
      axios
        .get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/suppliers/${id}`
        )
        .then((res) => {
          const { data } = res.data;
          // console.log("FormDAta:", data.supplierStateTaxDtoList[0]?.stateCode);

          setFormData({
            companyName: data.companyName,
            email: data.email,
            phone: data.phone,
            gstin: data.gstin,
            address: data.address,
            country: data.country,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            pan: data.pan,
            stateCode: data.supplierStateTaxDtoList[0]?.stateCode,
          });

          setCountryCode(data.country);
          setStateCode(data.state);
          setCityCode(data.city);
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id, isEditMode]);

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
      pan: formData.pan,
      supplierStateTaxDtoList: [
        {
          stateCode: formData.stateCode,
          gstin: formData.gstin,
          pan: formData.pan,
        },
      ],
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/suppliers/${id}`,
          payload
        );
        alert("Supplier updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/suppliers`,
          payload
        );
        alert("Supplier created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/suppliers");
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
              createButtonText="Create Supplier"
              updateButtonText="Update Supplier"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SupplierForm);
