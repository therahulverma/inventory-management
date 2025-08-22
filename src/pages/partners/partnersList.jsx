import React from "react";
import Paper from "@mui/material/Paper";
import "../users/users.css";
import useFetchData from "../../hooks/useFetchData";
import DynamicTable from "../../components/table/dynamicTable";
import Loading from "../../components/loading/loading";
import Error from "../../components/error/error";
import TableTopBar from "../../components/table-top-bar/tableTopBar";

const selectedColumns = {
  companyName: "Partner Name",
  contactPerson: "Contact Person",
  email: "Email Address",
  phone: "Phone",
};

function Partners() {
  const { data, loading, error } = useFetchData(
    `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/partners`
  );

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="jss1267">
      <div className="serviceOrderListContainer customerListPage">
        <div className="MuiPickTable">
          <div>
            <Paper elevation={3}>
              <TableTopBar totalRecords={data?.data?.length} title="Partners" />
              <div className="jss1275 borderBottomRadius">
                <DynamicTable data={data.data} columns={selectedColumns} />
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
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Partners);
