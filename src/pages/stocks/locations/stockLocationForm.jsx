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

// const apiEndpoints = {
//   brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Brands`,
//   size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Size`,
//   color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/color`,
//   os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Operating%20System`,
// };

function StockLocationForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const [suppliers, setSuppliers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [supplierID, setSupplierID] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [stateCode, setStateCode] = useState(null);
  const [cityCode, setCityCode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    supplier: "",
    // gst: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleCountry = async (e) => {
    setCountryCode(e.target.value);
  };

  const handleSupplier = async (e) => {
    setSupplierID(e.target.value);
    setFormData({ ...formData, supplier: e.target.value });
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
      name: "name",
      label: "Warehouse Name",
      type: "text",
      required: true,
      transform: (val) => val.trim(),
      validate: (val) => (val ? null : "Warehouse name is required"),
    },

    // {
    //   name: "gst",
    //   label: "GST Number",
    //   type: "text",
    //   required: true,
    //   transform: (val) => val.toUpperCase().trim(),
    //   validate: (val) =>
    //     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)
    //       ? null
    //       : "Invalid GSTIN (e.g., 27ABCDE1234F1Z5)",
    //   maxLength: 15,
    // },
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
              value={supplierID}
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
              value={countryCode || ""}
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
              value={stateCode || ""}
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
              value={cityCode || ""}
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
      label: "Pin Code",
      type: "text",
      required: true,
      transform: (val) => val.trim(),
      validate: (val) =>
        /^\d{6}$/.test(val) ? null : "Invalid Pin Code (must be 6 digits)",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
      transform: (val) => val.trim(),
      validate: (val) => (val ? null : "Address is required"),
    },
  ];

  console.log(formData, "forrm data");

  useEffect(() => {
    (async () => {
      try {
        // const country = await axios.get(
        //   `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/country`
        // );
        // setCountries(country?.data?.data);
        const [country, supplier] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/country`
          ),
          axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/suppliers/names`
          ),
        ]);
        setCountries(country?.data?.data);
        setSuppliers(supplier?.data?.data);
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
            name: data.name,
            address: data.address,
            supplier: data.supplierId,
            // gst: data.name,
            country: data.country,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
          });
          setCountryCode(data.country);
          setStateCode(data.state);
          setCityCode(data.city);
          setSupplierID(data.supplierId);
        })
        .catch((err) => console.error("Error fetching location:", err));
    }
  }, [id, isEditMode]);

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
      capacity: 500,
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
          payload
        );
        alert("Warehouse updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`,
          payload
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
