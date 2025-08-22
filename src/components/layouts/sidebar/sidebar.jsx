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
import {
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from "@mui/material";

const initialNavItems = [
  {
    label: "Dashboard",
    icon: <HomeOutlinedIcon style={{ marginRight: 15 }} />,
    status: true, // or "inactive"
    path: "/", // optional if you use routes
    children: null, // no nested menu
  },
  {
    label: "Users",
    icon: <PersonOutlinedIcon style={{ marginRight: 15 }} />,
    status: false, // or "inactive"
    path: "/users", // optional if you use routes
    children: null, // no nested menu
  },
  {
    label: "Partner",
    icon: <HandshakeIcon style={{ marginRight: 15 }} />,
    status: false,
    path: "/partners",
    children: null,
  },
  {
    label: "Suppliers",
    icon: <ShoppingCartOutlinedIcon style={{ marginRight: 15 }} />,
    status: false,
    path: "/suppliers",
    children: null,
  },
  {
    label: "Products",
    icon: <SmartphoneIcon style={{ marginRight: 15 }} />,
    status: false,
    path: "/products",
    children: null,
  },
  {
    label: "Inventory",
    icon: <Inventory2OutlinedIcon style={{ marginRight: 15 }} />,
    status: false,
    path: null,
    children: [
      {
        label: "Inventory Transfer",
        path: "/inventory/transfer",
        status: false,
      },
      {
        label: "Inventory Upload",
        path: "/inventory/upload",
        status: false,
      },
      {
        label: "Inventory Search",
        path: "/inventory/search",
        status: false,
      },
    ],
  },
  {
    label: "Stock",
    icon: <ShowChartIcon style={{ marginRight: 15 }} />,
    status: false,
    path: null,
    children: [
      { label: "Stock Locations", path: "/stock/locations", status: false },
      { label: "Stock Items", path: "/stock/items", status: false },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const [navItems, setNavItems] = useState(initialNavItems);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

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
          <img src="/images/logo.svg" alt="logo" />
        </div>

        <div className="HeaderImage">
          <img src="/images/logoTitle.svg" alt="Stock Management" />
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
                                  {hasChildren && (
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
                              {hasChildren && (
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
                                      {item.children.map((child, cIdx) => (
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
                                      ))}
                                    </MenuList>
                                  </Paper>
                                </Popover>
                              )}
                            </div>
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
