import React from "react";
import Paper from "@mui/material/Paper";
import "../users/users.css";
import useFetchData from "../../hooks/useFetchData";
import DynamicTable from "../../components/table/dynamicTable";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import TableTopBar from "../../components/table-top-bar/tableTopBar";
import Loading from "../../components/loading/loading";
import Error from "../../components/error/error";

const selectedColumns = {
  name: "Product Name",
  sku: "SKU Id",
  brand: "Brand",
  "specification.size": "Size",
  "specification.color": "Color",
  basePrice: "Base Price",
  status: "Status",
};

function Products() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products?page=0&sizePerPage=10`
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
                totalRecords={data?.data?.content.length}
                title="Products"
                CustomComponent={() => (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => {
                      navigate("/create/product");
                    }}
                  >
                    Create Product
                  </Button>
                )}
              />
              <div className="jss1275 borderBottomRadius">
                <DynamicTable
                  data={data.data.content}
                  columns={selectedColumns}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Products);
