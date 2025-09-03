import React from "react";
import { useNavigate } from "react-router-dom";
import "../../users/users.css";
import useFetchData from "../../../hooks/useFetchData";
import { useSelector } from "react-redux";
import Loading from "../../../components/loading/loading";
import Error from "../../../components/error/error";
import { PERMISSIONS } from "../../../utils/constants";
import TableTopBar from "../../../components/table-top-bar/tableTopBar";
import { Button, Paper } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DynamicTable from "../../../components/table/dynamicTable";

const selectedColumns = {
  key: "Key",
  value: "Value",
  parentCode: "Parent Code",
  description: "Description",
};

function MasterDataList() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants`
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
                title="Master Data"
                CustomComponent={() =>
                  rolePermissions?.includes(PERMISSIONS.MASTERDATA_CREATE) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => {
                        navigate("/role/master-data-create");
                      }}
                    >
                      Create Master Data
                    </Button>
                  )
                }
              />
              {rolePermissions?.includes(PERMISSIONS.MASTERDATA_VIEW) && (
                <div className="jss1275 borderBottomRadius">
                  <DynamicTable
                    data={data.data}
                    columns={selectedColumns}
                    editRoute={`/role/master-data-edit/`}
                    isEdit={
                      rolePermissions?.includes(PERMISSIONS.MASTERDATA_EDIT)
                        ? true
                        : false
                    }
                    isCheckbox={false}
                  />
                  {/* <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table> */}
                </div>
              )}
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MasterDataList);
