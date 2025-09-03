// Sidebar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SvgIcon from "@mui/material/SvgIcon";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Tooltip from "@mui/material/Tooltip";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { PERMISSIONS } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { useAuth } from "../../../AuthContext";

const initialNavItems = [
  {
    label: "Dashboard",
    icon: <HomeOutlinedIcon style={{ marginRight: 15 }} />,
    status: true, // or "inactive"
    path: "/", // optional if you use routes
    children: null, // no nested menu
    permissionKey: "",
  },
  {
    label: "Users",
    icon: <PersonOutlinedIcon style={{ marginRight: 15 }} />,
    status: false, // or "inactive"
    path: "/users", // optional if you use routes
    children: null, // no nested menu
    permissionKey: PERMISSIONS.USERS_MENU,
  },
  {
    label: "Partner",
    icon: <HandshakeIcon style={{ marginRight: 15 }} />,
    status: false,
    path: "/partners",
    children: null,
    permissionKey: PERMISSIONS.PARTNER_MENU,
  },
  {
    label: "Suppliers",
    icon: <ShoppingCartOutlinedIcon style={{ marginRight: 15 }} />,
    status: false,
    path: "/suppliers",
    children: null,
    permissionKey: PERMISSIONS.SUPPLIER_MENU,
  },
  {
    label: "Products",
    icon: <SmartphoneIcon style={{ marginRight: 15 }} />,
    status: false,
    path: "/products",
    children: null,

    permissionKey: PERMISSIONS.PRODUCT_MENU,
  },
  {
    label: "Inventory",
    icon: <Inventory2OutlinedIcon style={{ marginRight: 15 }} />,
    status: false,
    path: null,
    permissionKey: PERMISSIONS.INVENTORY_MENU,
    children: [
      // {
      //   label: "Inventory Transfer",
      //   path: "/inventory/transfer",
      //   status: false,
      //   permissionKey: PERMISSIONS.INVENTORY_TRANSFER_MENU,
      // },
      {
        label: "Inventory Upload",
        path: "/inventory/upload-list",
        status: false,
        permissionKey: PERMISSIONS.INVENTORY_UPLOAD_MENU,
      },
      // {
      //   label: "Inventory Search",
      //   path: "/inventory/search",
      //   status: false,
      //   permissionKey: PERMISSIONS.INVENTORY_SEARCH_MENU,
      // },
    ],
  },
  {
    label: "Stock",
    icon: <ShowChartIcon style={{ marginRight: 15 }} />,
    status: false,
    path: null,
    permissionKey: PERMISSIONS.STOCK_MENU,
    children: [
      {
        label: "Stock Locations",
        path: "/stock/locations",
        status: false,
        permissionKey: PERMISSIONS.STOCK_LOCATIONS_MENU,
      },
      {
        label: "Stock Items",
        path: "/stock/items",
        status: false,
        permissionKey: PERMISSIONS.STOCK_ITEMS_MENU,
      },
      {
        label: "Stock by warehouse",
        path: "/stock/stock-by-warehouse",
        status: false,
        permissionKey: PERMISSIONS.STOCK_STOCKBYWAREHOUSE_MENU,
      },
    ],
  },
  ,
  {
    label: "Master Configuration",
    icon: <SettingsIcon style={{ marginRight: 15 }} />,
    status: false,
    path: null,
    permissionKey: PERMISSIONS.MASTERCONFIG_MENU,
    children: [
      {
        label: "Role Management",
        path: "/role/role-management",
        status: false,
        permissionKey: PERMISSIONS.MASTERCONFIG_ROLEMANAGEMENT_MENU,
      },
      {
        label: "Permission Management",
        path: "/role/permission-management",
        status: false,
        permissionKey: PERMISSIONS.MASTERCONFIG_PERMISSIONMANAGEMENT_MENU,
      },
      {
        label: "Master Data",
        path: "/role/master-data",
        status: false,
        permissionKey: PERMISSIONS.MASTERCONFIG_MASTERDATA_MENU,
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const [navItems, setNavItems] = useState(initialNavItems);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const rolePermissions = useSelector(
    (state) => state.roleManagement.rolePermissions
  );

  console.log("rolePermissions:", rolePermissions);
  const handleClick = (event, idx) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(idx);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenIndex(null);
  };

  const toggleStatus = (index, type) => {
    if (type === "UP") {
      setNavItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: true } : { ...item, status: false }
        )
      );
    } else if (type === "DOWN") {
      setNavItems((prev) =>
        prev.map((item, i) =>
          i === index + 1
            ? { ...item, status: true }
            : { ...item, status: false }
        )
      );
    }
  };

  return (
    <div className={`left-panel ${isOpen ? "" : "collapsed"}`}>
      <div className="HeaderLogo">
        <div className="MuiButtonBase-root MuiIconButton-root HeaderIcon">
          <img src={`${process.env.PUBLIC_URL}/images/logo_1.svg`} alt="logo" />
        </div>

        <div className="HeaderImage">
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.svg`}
            alt="Stock Management"
          />
        </div>

        <IconButton
          onClick={onClose}
          className="MuiButtonBase-root MuiIconButton-root MiniNav"
        >
          {isOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>
      </div>
      <Divider className="MuiDivider-root BlockDivider" />
      <div className="NavItemsContainer">
        <div className="Mui-ScrollBar-Container">
          <div className="jss18">
            <div className="ScrollbarsCustom trackYVisible jss5">
              <div className="ScrollbarsCustom-Wrapper">
                <div className="ScrollbarsCustom-Scroller">
                  <div className="ScrollbarsCustom-Content">
                    <div>
                      <div className="NavBlock">
                        {navItems.slice(0, 1).map((item, idx) => (
                          <div key={idx}>
                            <Tooltip
                              title={`${!isOpen ? item.label : ""}`}
                              disableInteractive
                            >
                              <Button
                                onClick={() => {
                                  toggleStatus(idx, "UP");
                                  navigate(item.path);
                                }}
                                className={`MuiButtonBase-root MuiButton-root MuiButton-text NavItem MuiButton-fullWidth ${
                                  item.status && "NavActive"
                                }`}
                                // disabled={item.status !== false}
                              >
                                {item.icon}
                                <span className="NavItemText">
                                  {item.label}
                                </span>
                              </Button>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                      <div className="NavBlock">
                        <Divider className="MuiDivider-root BlockDivider" />
                        {navItems.slice(1).map((item, idx) => {
                          const hasChildren = !!item.children;
                          const isPopoverOpen = openIndex === idx;
                          return (
                            rolePermissions?.includes(item.permissionKey) && (
                              <div key={idx}>
                                <Tooltip
                                  title={`${!isOpen ? item.label : ""}`}
                                  disableInteractive
                                >
                                  <Button
                                    onClick={(e) => {
                                      toggleStatus(idx, "DOWN");
                                      if (hasChildren) {
                                        handleClick(e, idx); // open popover
                                      } else if (item.path) {
                                        navigate(item.path);
                                      }
                                    }}
                                    className={`MuiButtonBase-root MuiButton-root MuiButton-text NavItem MuiButton-fullWidth ${
                                      item.status && "NavActive"
                                    }`}
                                    // disabled={item.status !== false}
                                  >
                                    {item.icon}
                                    <span className="NavItemText">
                                      {item.label}
                                    </span>
                                    {hasChildren &&
                                      rolePermissions?.includes(
                                        item.permissionKey
                                      ) && (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            width: "100%",
                                          }}
                                        >
                                          <KeyboardArrowRightIcon />
                                        </div>
                                      )}
                                  </Button>
                                </Tooltip>
                                {hasChildren &&
                                  rolePermissions?.includes(
                                    item.permissionKey
                                  ) && (
                                    <Popover
                                      open={isPopoverOpen}
                                      anchorEl={anchorEl}
                                      onClose={handleClose}
                                      anchorOrigin={{
                                        vertical: "left",
                                        horizontal: "right",
                                      }}
                                      sx={{
                                        marginLeft: "8px",
                                      }}
                                    >
                                      <Paper elevation={3}>
                                        <MenuList>
                                          {item.children.map(
                                            (child, cIdx) =>
                                              rolePermissions?.includes(
                                                child.permissionKey
                                              ) && (
                                                <MenuItem
                                                  key={cIdx}
                                                  onClick={() => {
                                                    navigate(child.path);
                                                    handleClose();
                                                  }}
                                                >
                                                  <span className="NavItemText">
                                                    {child.label}
                                                  </span>
                                                </MenuItem>
                                              )
                                          )}
                                        </MenuList>
                                      </Paper>
                                    </Popover>
                                  )}
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY">
                <div className="ScrollbarsCustom-Thumb ScrollbarsCustom-ThumbY"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
