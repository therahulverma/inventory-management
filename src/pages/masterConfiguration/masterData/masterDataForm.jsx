import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../../users/users.css";
import DynamicForm from "../../../components/form/form";
import axios from "axios";

function MasterDataForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("payload", state);

  const cachedToken = Cookies.get("token");
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const value = state.value; // "mobile"
  const description = state.description;
  const key = state.key;
  const shortCode = state.shortCode;
  const parentCode = state.parentCode;
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
    parentCode: "",
    shortCode: "",
  });

  const formConfig = [
    {
      name: "key",
      label: "Key",
      type: "text",
      required: true,
      disabledOnEdit: true,
    },
    {
      name: "value",
      label: "Value",
      type: "text",
      required: true,
    },
    {
      name: "parentCode",
      label: "Parent Code",
      type: "text",
      required: true,
      disabledOnEdit: true,
    },
    {
      name: "shortCode",
      label: "Short Code",
      type: "text",
      required: true,
      disabledOnEdit: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
  ];

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        key: key,
        value: value,
        description: description,
        parentCode: parentCode,
        shortCode: shortCode,
      });
    }
  }, [id, isEditMode]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const requiredFields = [
      "key",
      "value",
      "description",
      "parentCode",
      "shortCode",
    ];
    const missing = requiredFields.filter((f) => !formData[f]);

    if (missing.length > 0) {
      alert(`Missing fields: ${missing.join(", ")}`);
      return;
    }

    // console.log("Submitting:", formData);

    const payload = {
      key: formData.key,
      value: formData.value,
      description: formData.description,
      parentCode: formData.parentCode,
      shortCode: formData.shortCode,
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.patch(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/${id}`,
          { value: formData.value, description: formData.description },
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );

        if (!res?.data?.success) {
          return alert(`${res?.data?.message}`);
        }
        alert("Data updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );

        if (!res?.data?.success) {
          return alert(`${res?.data?.message}`);
        }

        alert("Data created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/role/master-data");
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
              createButtonText="Create Data"
              updateButtonText="Update Data"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MasterDataForm);
