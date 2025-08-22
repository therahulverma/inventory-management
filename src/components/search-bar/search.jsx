import React from "react";
import { styled } from "@mui/material/styles";

function Search() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));
  return (
    <>
      {/* <div className="jss1288 jss1270">
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Item>
                        <div className="position-relative jss1289">
                          <FormControl fullWidth>
                            <TextField
                              size="small"
                              variant="outlined"
                              placeholder="Search by customer name orSearch by customer name or customer ID"
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      edge="end"
                                      onClick={() => alert("Filter clicked!")}
                                    >
                                      <FilterListIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    border: "none",
                                  },
                                  "&:hover fieldset": {
                                    border: "none",
                                  },
                                  "&.Mui-focused fieldset": {
                                    border: "none",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#0f2e66",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "#0f2e66",
                                },
                              }}
                            />
                          </FormControl>
                        </div>
                      </Item>
                    </Grid>
                  </Grid>
                </Box>
              </div> */}
    </>
  );
}

export default React.memo(Search);
