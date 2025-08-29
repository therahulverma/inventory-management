import React from "react";
import Paper from "@mui/material/Paper";
import "../users/users.css";
import useFetchData from "../../hooks/useFetchData";
import DynamicTable from "../../components/table/dynamicTable";
import Loading from "../../components/loading/loading";
import Error from "../../components/error/error";
import TableTopBar from "../../components/table-top-bar/tableTopBar";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "../../utils/constants";

const selectedColumns = {
  companyName: "Supplier Name",
  contactPerson: "Contact Person",
  email: "Email Address",
  phone: "Phone",
};

function Suppliers() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/suppliers`
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
                title="Suppliers"
                CustomComponent={() =>
                  rolePermissions?.includes(PERMISSIONS.SUPPLIER_CREATE) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => {
                        navigate("/suppliers/create");
                      }}
                    >
                      Create Supplier
                    </Button>
                  )
                }
              />
              {rolePermissions?.includes(PERMISSIONS.SUPPLIER_VIEW) && (
                <div className="jss1275 borderBottomRadius">
                  <DynamicTable
                    data={data.data}
                    columns={selectedColumns}
                    editRoute="/suppliers/edit/"
                    isEdit={
                      rolePermissions?.includes(PERMISSIONS.SUPPLIER_EDIT)
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

export default React.memo(Suppliers);
