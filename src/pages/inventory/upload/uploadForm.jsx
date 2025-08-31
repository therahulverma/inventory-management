import React, { useState } from "react";
import "../../users/users.css";
import { Button, Paper, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableTopBar from "../../../components/table-top-bar/tableTopBar";

function InventoryUploadForm() {
  const [file, setFile] = useState("");

  const handleFile = (event) => {
    console.log(event.target.files);
    setFile(event.target.files[0]);
  };

  const submitFile = async () => {
    if (!file) {
      alert("Please select file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_INVENTORY_STOCK_API_PORT}/api/inventory/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("File uploaded successfully!");
      console.log("Created ✅:", res.data);
      navigate("/inventory/upload-list");
    } catch (err) {
      console.error("Error saving product ❌:", err);
      alert(`Failed to save product: ${err.response.data.message}`);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="jss1267">
      <div className="serviceOrderListContainer customerListPage">
        <div className="MuiPickTable">
          <div>
            <Paper elevation={3}>
              <TableTopBar title="Inventory Upload" />
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
                  <TextField
                    type="file"
                    id="file"
                    // label="Outlined"
                    variant="outlined"
                    onChange={handleFile}
                    size="small"
                    inputProps={{
                      accept:
                        ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: 10, justifyContent: "center" }}
                >
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitFile}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(InventoryUploadForm);
