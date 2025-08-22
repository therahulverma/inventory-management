import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const getNestedValue = (obj, path) => {
  try {
    const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);

    if (typeof value === "object" && value !== null) {
      return Array.isArray(value) ? value.join(", ") : JSON.stringify(value);
    }

    return value ?? "-";
  } catch (e) {
    return "-";
  }
};

const DynamicTable = ({ data, columns }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event, idx) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(idx);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenIndex(null);
  };

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const columnEntries =
    columns && Object.keys(columns).length > 0
      ? Object.entries(columns) // [["firstName", "First Name"], ...]
      : Object.keys(data[0]).map((key) => [key, key]);

  console.log("Columns:", columnEntries);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="tableWrapper">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columnEntries.map(([key, label]) => (
                <TableCell key={key} style={{ fontWeight: "bold" }}>
                  {label}
                </TableCell>
              ))}
              <TableCell style={{ fontWeight: "bold" }}>
                <IconButton>
                  <SortIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                const isPopoverOpen = openIndex === idx;
                return (
                  <TableRow key={idx} hover>
                    {columnEntries.map(([key]) => (
                      <TableCell key={key}>
                        {getNestedValue(row, key)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          handleClick(e, idx);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                    <Popover
                      open={isPopoverOpen}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <Paper>
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              navigate(`/edit/product/${row.id}`);
                              // handleClose();
                            }}
                          >
                            <span className="NavItemText">Edit</span>
                          </MenuItem>
                        </MenuList>
                      </Paper>
                    </Popover>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default React.memo(DynamicTable);
