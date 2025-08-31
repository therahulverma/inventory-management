import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../../components/select/select";
import { Button, Paper, TextareaAutosize, TextField } from "@mui/material";
import DynamicTable from "../../../components/table/dynamicTable";
import "../../users/users.css";
import { useDispatch, useSelector } from "react-redux";
import { setPermissions } from "../../../redux/slices/roleManagementSlice";

// const apiEndpoints = {
//   brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Brands`,
//   size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Size`,
//   color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/color`,
//   os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Operating%20System`,
// };

const selectedColumns = {
  accessKey: "Access Key",
  screen: "Screen",
  action: "Action",
  description: "Description",
};

function RoleManagementForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);
  const [allPermissions, setAllPermissions] = useState([]);

  const role_Id = useSelector((state) => state.roleManagement.roleId);

  console.log(role_Id, "riiii");

  const [selected, setSelected] = useState([]);

  const [formData, setFormData] = useState({
    roleName: "",
    roleDescription: "",
  });

  const handleSelectRow = (row) => {
    setSelected((prev) => {
      const exists = prev.some((p) => p.accessKey === row.accessKey);
      if (exists) {
        return prev.filter((p) => p.accessKey !== row.accessKey);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(allPermissions);
    } else {
      setSelected([]);
    }
  };

  console.log("Selected:", selected, id);

  const handleSave = async () => {
    try {
      const allPermissionKeys = selected.map((val) => val.accessKey);
      const payload = {
        permissionAccessKeys: allPermissionKeys,
        granted: true,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/roles/${id}/permissions`,
        payload
      );

      if (res && role_Id == id) {
        dispatch(setPermissions({ allPermissions: allPermissionKeys }));
      }
      alert("Privilege Saved successfully!");
      console.log("Created ✅:", res.data);

      navigate("/role/role-management");
    } catch (err) {
      console.error("Error saving location ❌:", err);
      alert("Failed to save location");
    }
  };

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

      if (isEditMode) {
        try {
          const [permission, selectedPermissions] = await Promise.all([
            axios.get(
              `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/permissions`
            ),
            axios.get(
              `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/roles/${id}/permissions`
            ),
          ]);

          setAllPermissions(permission?.data?.data);
          setSelected(selectedPermissions?.data?.data);
        } catch (error) {
          console.error("Error fetching options", error);
        }
      }
    })();
  }, [id, isEditMode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const requiredFields = ["roleName"];

    const missing = requiredFields.filter((f) => !formData[f]);

    if (missing.length > 0) {
      alert(`Missing fields: ${missing.join(", ")}`);
      return;
    }

    console.log("Submitting:", formData);

    const payload = {
      roleName: formData.roleName,
      description: formData.roleDescription,
      departmentId: 1,
      designationId: 1,
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
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/role`,
          payload
        );
        alert("Role created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/role/role-management");
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
            {isEditMode ? (
              <>
                <Paper elevation={3}>
                  <div className="jss1275 borderBottomRadius">
                    <DynamicTable
                      data={allPermissions}
                      columns={selectedColumns}
                      isEdit={false}
                      isCheckbox={true}
                      selected={selected}
                      onSelectRow={handleSelectRow}
                      onSelectAll={handleSelectAll}
                    />
                  </div>
                </Paper>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    gap: 10,
                    marginTop: 15,
                  }}
                >
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              </>
            ) : (
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
                    <div style={{ width: "100%", margin: 5 }}>
                      <TextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Role Name"
                        size="small"
                        value={formData.name}
                        onChange={(e) =>
                          handleChange("roleName", e.target.value)
                        }
                        disabled={isEditMode}
                      />
                    </div>
                    {/* <div style={{ width: "45%", margin: 5 }}>
                      <TextField
                        fullWidth
                        required
                        id="outlined-required"
                        label="Role ID"
                        size="small"
                        value={formData.address}
                        onChange={(e) => handleChange("roleId", e.target.value)}
                        disabled={isEditMode}
                      />
                    </div> */}
                    <div style={{ width: "100%", margin: 5 }}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Role Description"
                        style={{ width: "100%", minHeight: 120 }}
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("roleDescription", e.target.value)
                        }
                        required
                      />
                    </div>
                    <Button type="submit" variant="contained" color="primary">
                      {isEditMode ? "Update Role" : "Create Role"}
                    </Button>
                  </div>
                </Paper>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RoleManagementForm);
