import React from "react";
import "../users/users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "../../components/form/form";

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

function PartnerForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  //   const [options, setOptions] = useState({
  //     brand: [],
  //     size: [],
  //     color: [],
  //     os: [],
  //   });

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
          : "Invalid GSTIN",
      required: true,
    },
    {
      name: "city",
      label: "City",
      type: "select",
      options: cities,
      required: true,
    },
    {
      name: "state",
      label: "State",
      type: "select",
      options: states,
      required: true,
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
      type: "textarea",
      required: true,
    },
  ];

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
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
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners/${id}`
        )
        .then((res) => {
          const { data } = res.data;
          setFormData({
            companyName: data.companyName,
            email: data.email,
            phone: data.phone,
            gstin: data.gstin,
            address: data.address,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
          });
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id, isEditMode]);

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
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners/${id}`,
          payload
        );
        alert("Partner updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners`,
          payload
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
