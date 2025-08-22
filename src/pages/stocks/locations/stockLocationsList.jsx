import React from "react";
import Paper from "@mui/material/Paper";
import "../../users/users.css";
import useFetchData from "../../../hooks/useFetchData";
import DynamicTable from "../../../components/table/dynamicTable";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import TableTopBar from "../../../components/table-top-bar/tableTopBar";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";

const selectedColumns = {
  name: "Warehouse Name",
  postalCode: "PIN Code",
  city: "City",
  state: "State",
};

function StockLocationsList() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/warehouses`
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
                title="Stock Locations"
                CustomComponent={() => (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => {
                      navigate("/stock/create/location");
                    }}
                  >
                    Create Stock Location
                  </Button>
                )}
              />
              <div className="jss1275 borderBottomRadius">
                <DynamicTable data={data.data} columns={selectedColumns} />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StockLocationsList);
