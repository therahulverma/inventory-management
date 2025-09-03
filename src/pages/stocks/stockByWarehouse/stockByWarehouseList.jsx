import React, { useState } from "react";
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
import axios from "axios";
import Cookies from "js-cookie";

const selectedColumns = {
  sku: "SKU ID",
  warehouseName: "Warehouse Name",
  productName: "Product Name",
  quantity: "Quantity",
};

function StockByWarehouseList() {
  const [warehouseId, setWarehouseId] = useState(0);
  const [warehouseData, setWarehouseData] = useState([]);
  const navigate = useNavigate();
  const cachedToken = Cookies.get("token");
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`
  );
  const rolePermissions = useSelector(
    (state) => state.roleManagement.rolePermissions
  );

  const hndleChange = async (e) => {
    setWarehouseId(e.target.value);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/inventory/details/${e.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${cachedToken}`,
          },
        }
      );

      setWarehouseData(res?.data?.data);
    } catch (err) {
      alert("Error:", err);
      console.log("Error:", err);
    }
  };

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
                  <FormControl sx={{ width: "25%" }} size="small">
                    <InputLabel id={`warehouse-label`}>Warehouse</InputLabel>
                    <Select
                      labelId={`warehouse-label`}
                      id="Warehouse"
                      value={warehouseId || ""}
                      label="Warehouse"
                      onChange={hndleChange}
                      //   disabled={disabled}
                    >
                      {data?.data.map((opt) => (
                        <MenuItem key={opt.id.toString()} value={opt.id}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {/* <div
                  style={{ display: "flex", gap: 10, justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={submitFile}
                  >
                    Search
                  </Button>
                </div> */}
              </div>
              {warehouseData.length > 0 &&
                rolePermissions?.includes(
                  PERMISSIONS.STOCKBYWAREHOUSE_VIEW
                ) && (
                  <div className="jss1275 borderBottomRadius">
                    <DynamicTable
                      data={warehouseData}
                      columns={selectedColumns}
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
