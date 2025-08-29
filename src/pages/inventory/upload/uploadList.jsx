import React from "react";
import Paper from "@mui/material/Paper";
import "../../users/users.css";
import useFetchData from "../../../hooks/useFetchData";
import DynamicTable from "../../../components/table/dynamicTable";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import TableTopBar from "../../../components/table-top-bar/tableTopBar";
import { Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { PERMISSIONS } from "../../../utils/constants";
import { useSelector } from "react-redux";

const selectedColumns = {
  name: "File Name",
  postalCode: "Total Record",
  city: "Success Record",
  state: "Error Record",
  state: "Status",
  state: "Error Details",
};

function InventoryUploadList() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`
  );
  const rolePermissions = useSelector(
    (state) => state.roleManagement.rolePermissions
  );

  console.log("data:", data);
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
                title="Inventory Upload"
                CustomComponent={() =>
                  rolePermissions?.includes(PERMISSIONS.UPLOAD_CREATE) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<FileUploadIcon />}
                      onClick={() => {
                        navigate("/inventory/upload");
                      }}
                    >
                      Upload Inventory
                    </Button>
                  )
                }
              />
              {rolePermissions?.includes(PERMISSIONS.UPLOAD_VIEW) && (
                <div className="jss1275 borderBottomRadius">
                  <DynamicTable
                    data={data.data}
                    columns={selectedColumns}
                    isEdit={
                      rolePermissions?.includes(PERMISSIONS.UPLOAD_EDIT) &&
                      false
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

export default React.memo(InventoryUploadList);
