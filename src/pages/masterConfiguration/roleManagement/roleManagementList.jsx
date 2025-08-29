import React from "react";
import Paper from "@mui/material/Paper";
import "../../users/users.css";
import useFetchData from "../../../hooks/useFetchData";
import DynamicTable from "../../../components/table/dynamicTable";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import TableTopBar from "../../../components/table-top-bar/tableTopBar";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "../../../utils/constants";

const selectedColumns = {
  roleName: "Role Name",
  description: "Role Description",
};

// if (loading) return <Loading />;
// if (error) return <Error />;

function RoleManagmentList() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/role`
  );

  const rolePermissions = useSelector(
    (state) => state.roleManagement.rolePermissions
  );

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="jss1267">
      <div className="serviceOrderListContainer customerListPage">
        <div className="MuiPickTable">
          <div>
            <Paper elevation={3}>
              <TableTopBar
                totalRecords={data?.data?.length}
                title="Roles"
                CustomComponent={() =>
                  rolePermissions?.includes(
                    PERMISSIONS.ROLEMANAGEMENT_CREATE
                  ) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => {
                        navigate("/role/create");
                      }}
                    >
                      Create Role
                    </Button>
                  )
                }
              />
              {rolePermissions?.includes(PERMISSIONS.ROLEMANAGEMENT_VIEW) && (
                <div className="jss1275 borderBottomRadius">
                  <DynamicTable
                    data={data?.data}
                    columns={selectedColumns}
                    editRoute="/role/edit/"
                    isEdit={
                      rolePermissions?.includes(PERMISSIONS.ROLEMANAGEMENT_EDIT)
                        ? true
                        : false
                    }
                    isCheckbox={false}
                  />
                </div>
              )}
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleManagmentList;
