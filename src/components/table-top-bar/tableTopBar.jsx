import React from "react";
import { Typography } from "@mui/material";

function TableTopBar(props) {
  const { totalRecords, title, CustomComponent } = props;
  console.log("Props of Top Bar :", props);

  return (
    <div className="BlockContainer">
      <Typography variant="h4" gutterBottom>
        {`${totalRecords ? totalRecords : ""} ${title}`}
      </Typography>
      <div className="heading-bar">
        {CustomComponent && <CustomComponent />}
      </div>
    </div>
  );
}

export default React.memo(TableTopBar);
