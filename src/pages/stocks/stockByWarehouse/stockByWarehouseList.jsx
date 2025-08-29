import React from "react";
import Paper from "@mui/material/Paper";
import "../../users/users.css";
import useFetchData from "../../../hooks/useFetchData";
import DynamicTable from "../../../components/table/dynamicTable";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import TableTopBar from "../../../components/table-top-bar/tableTopBar";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { PERMISSIONS } from "../../../utils/constants";
import { useSelector } from "react-redux";

const selectedColumns = {
  name: "Warehouse Name",
  postalCode: "PIN Code",
  city: "City",
  state: "State",
};

function StockByWarehouseList() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`
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
              <TableTopBar title="Stock by warehouse" />
              <div
                style={{
                  width: "100%",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <div>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`warehouse-label`}>Warehouse</InputLabel>
                    <Select
                      labelId={`warehouse-label`}
                      id="Warehouse"
                      //   value={value || ""}
                      label="Warehouse"
                      //   onChange={(e) => onChange(name, e.target.value)}
                      //   disabled={disabled}
                    >
                      {/* {options.map((opt) => (
                        <MenuItem key={opt.id.toString()} value={opt.value}>
                          {opt.value}
                        </MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>
                </div>
                <div
                  style={{ display: "flex", gap: 10, justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={submitFile}
                  >
                    Search
                  </Button>
                </div>
              </div>
              {rolePermissions?.includes(PERMISSIONS.LOCATIONS_VIEW) && (
                <div className="jss1275 borderBottomRadius">
                  <DynamicTable
                    data={data.data}
                    columns={selectedColumns}
                    isEdit={
                      rolePermissions?.includes(PERMISSIONS.LOCATIONS_VIEW)
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

export default React.memo(StockByWarehouseList);
