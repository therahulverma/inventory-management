// Header.js
import React, { useEffect, useState } from "react";
import "./header.css";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useAuth } from "../../../AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import {
  setPermissions,
  setRole,
} from "../../../redux/slices/roleManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";

export default function Header({ onClose }) {
  const [profilePopUp, setProfilePopUp] = React.useState(null);
  const [createUser, setCreateUser] = React.useState(null);
  const [isEmail, setIsEmail] = useState(false);
  const { logout, decodedToken } = useAuth();

  const role = useSelector((state) => state.roleManagement.role);
  console.log("Role:", role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cachedToken = Cookies.get("token");

  useEffect(() => {
    async function fetchData() {
      try {
        if (
          decodedToken?.realm_access?.roles &&
          decodedToken.realm_access.roles.length > 0 &&
          !role // only set if not already selected
        ) {
          const { data } = await axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/role/${decodedToken.realm_access.roles[0]}`,
            {
              headers: {
                Authorization: `Bearer ${cachedToken}`,
              },
            }
          );

          const permissions = await axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/roles/${data?.data?.id}/permissions`,
            {
              headers: {
                Authorization: `Bearer ${cachedToken}`,
              },
            }
          );

          const allPermissionKeys = permissions?.data?.data.map(
            (val) => val.accessKey
          );

          dispatch(
            setRole({
              role: decodedToken.realm_access.roles[0],
              roleId: data?.data?.id,
            })
          );

          dispatch(setPermissions({ allPermissions: allPermissionKeys }));
        }
      } catch (err) {
        alert(err);
        console.log("error", err);
      }
    }
    fetchData();
  }, [decodedToken, dispatch, role]);

  const handleProfilePopUp = (event) => {
    setProfilePopUp(event.currentTarget);
  };

  const handleCloseProfilePopUp = () => {
    setProfilePopUp(null);
  };

  const handleChangeRole = async (e) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/role/${e.target.value}`,
      {
        headers: {
          Authorization: `Bearer ${cachedToken}`,
        },
      }
    );

    const permissions = await axios.get(
      `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_USER_SUPPLIER_PARTNER_API_PORT}/api/v1/roles/${data?.data?.id}/permissions`,
      {
        headers: {
          Authorization: `Bearer ${cachedToken}`,
        },
      }
    );
    console.log(permissions?.data?.data, "permissions");
    const allPermissionKeys = permissions?.data?.data.map(
      (val) => val.accessKey
    );

    dispatch(
      setRole({
        role: e.target.value,
        roleId: data?.data?.id,
      })
    );

    dispatch(setPermissions({ allPermissions: allPermissionKeys }));
    onClose();
    navigate("/");
  };

  const handleCreateUser = (event) => {
    setCreateUser(event.currentTarget);
  };

  const handleCloseCreateUser = () => {
    setCreateUser(null);
  };

  const openProfilePopUP = Boolean(profilePopUp);
  const idProfilePopUP = openProfilePopUP
    ? "simple-popover-Profile"
    : undefined;
  const openCreateUser = Boolean(createUser);
  const idCreadeUser = openCreateUser ? "simple-popover-User" : undefined;

  return (
    <div className="ServiceContainer">
      <div className="jss11">
        <div className="Search">
          <Typography variant="h3" className="MuiTypography-h3 py-4">
            Welcome
          </Typography>
        </div>
        <div className="topRightSec">
          <div className="quick-actions">
            <IconButton
              aria-describedby={idCreadeUser}
              onClick={handleCreateUser}
            >
              <AddCircleOutlinedIcon />
            </IconButton>
          </div>
          <div className="quick-actions">
            <IconButton>
              <LanguageOutlinedIcon />
            </IconButton>
          </div>
          <div className="quick-actions">
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>
          </div>
          <div>
            <section className="TopUserContainer">
              <div>
                <div
                  aria-describedby={idProfilePopUP}
                  onClick={handleProfilePopUp}
                  className="ProfileDetails jss24"
                >
                  <div className="AddNewCustomer">
                    <div>
                      <p className="MuiTypography-root UserName MuiTypography-body1">
                        Hi, {decodedToken?.name}
                      </p>
                    </div>
                    {/* <img
                      className="Avatar"
                      alt="avatar"
                      src="https://www.gstatic.com/webp/gallery/1.sm.webp"
                    /> */}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div>
        <div className="agentDashboard">
          <Outlet />
        </div>
      </div>

      <Popover
        id={idProfilePopUP}
        open={openProfilePopUP}
        anchorEl={profilePopUp}
        onClose={handleCloseProfilePopUp}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ mt: 2 }}
      >
        <Paper elevation={3}>
          <div className="jss26">
            <div className="ProfilePic">
              <div
                className="hoverColor"
                style={{ height: isEmail ? "5.5rem" : "4rem" }}
              >
                <div className="profileImg">
                  {/* <img
                    className="Avatar"
                    alt="avatar"
                    src="/images/avatar@2x.webp"
                  /> */}
                </div>
                <div className="detailsDiv">
                  <Typography variant="body1" className="NewSale">
                    {role}
                  </Typography>
                  <Typography variant="body1" className="UserName">
                    {decodedToken?.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="department"
                  ></Typography>
                  {isEmail && (
                    <Typography
                      variant="body1"
                      className="Email"
                      sx={{ mt: 2 }}
                    >
                      E-mail: {decodedToken?.email}
                    </Typography>
                  )}
                </div>
                <div className="arrowUpDown">
                  {isEmail ? (
                    <KeyboardArrowUpOutlinedIcon
                      onClick={() => setIsEmail(!isEmail)}
                    />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon
                      onClick={() => setIsEmail(!isEmail)}
                    />
                  )}
                </div>
              </div>
            </div>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small-label">
                Assigned Roles
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={role}
                label="Assigned Roles"
                onChange={handleChangeRole}
              >
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                {decodedToken?.realm_access?.roles.length > 0 &&
                  decodedToken?.realm_access?.roles.map((val, idx) => (
                    <MenuItem key={idx.toString()} value={val}>
                      {val}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* <Typography variant="body1" className="ProfileSetting">
              Profile Settings
            </Typography> */}
            <Typography variant="body1" className="Logout" onClick={logout}>
              Logout
            </Typography>
          </div>
        </Paper>
      </Popover>

      <Popover
        id={idCreadeUser}
        open={openCreateUser}
        anchorEl={createUser}
        onClose={handleCloseCreateUser}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper elevation={3}>
          <MenuList
            sx={{
              width: "calc(100% + 4px)",
              color: "#0f2e66",
            }}
          >
            <MenuItem>
              <ListItemText>Create B2C customer</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText>Create B2B customer</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText>Create new opportunity</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    </div>
  );
}
