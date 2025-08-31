import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext";
import Users from "./pages/users/usersList.jsx";
import ProtectedRoute from "./protectedRoute.js";
import Partners from "./pages/partners/partnersList.jsx";
import Suppliers from "./pages/suppliers/suppliersList.jsx";
import Products from "./pages/products/productList.jsx";
import ProductForm from "./pages/products/productForm.jsx";
import StockLocationsList from "./pages/stocks/locations/stockLocationsList.jsx";
import StockLocationForm from "./pages/stocks/locations/stockLocationForm.jsx";
import InventoryUploadList from "./pages/inventory/upload/uploadList.jsx";
import InventoryUploadForm from "./pages/inventory/upload/uploadForm.jsx";
import RoleManagmentList from "./pages/masterConfiguration/roleManagement/roleManagementList.jsx";
import RoleManagementForm from "./pages/masterConfiguration/roleManagement/roleManagementForm.jsx";
import PermissionManagementList from "./pages/masterConfiguration/permissionManagement/permissionManagementList.jsx";
import PermissionManagementForm from "./pages/masterConfiguration/permissionManagement/permissionManagementForm.jsx";
import PartnerForm from "./pages/partners/partnerForm.jsx";
import SupplierForm from "./pages/suppliers/supplierForm.jsx";
import { RoleProvider } from "./contexts/RoleContext.js";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import StockItemsList from "./pages/stocks/items/stockItemsList.jsx";
import StockByWarehouseList from "./pages/stocks/stockByWarehouse/stockByWarehouseList.jsx";

function Dummy({ text }) {
  return <h2 style={{ padding: "20px" }}>{text}</h2>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/sms_ui">
      <AuthProvider>
        <Provider store={store}>
          <RoleProvider>
            <Routes>
              {/* Default Page after login */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <App />
                  </ProtectedRoute>
                }
              >
                {/* Inventory Section */}
                <Route
                  index
                  element={<Dummy text="Dashboard will be coming soon..." />}
                />

                <Route path="inventory">
                  <Route
                    path="transfer"
                    element={<Dummy text="Inventory → Transfer" />}
                  />
                  <Route path="upload-list" element={<InventoryUploadList />} />
                  <Route path="upload" element={<InventoryUploadForm />} />
                  <Route
                    path="search"
                    element={<Dummy text="Inventory → Search" />}
                  />
                </Route>

                <Route path="role">
                  <Route
                    path="role-management"
                    element={<RoleManagmentList />}
                  />
                  <Route
                    path="create"
                    element={<RoleManagementForm mode="create" />}
                  />

                  <Route
                    path="edit/:id"
                    element={<RoleManagementForm mode="edit" />}
                  />
                  <Route
                    path="permission-management"
                    element={<PermissionManagementList />}
                  />

                  <Route
                    path="permission-create"
                    element={<PermissionManagementForm mode="create" />}
                  />
                  <Route
                    path="role-permission-mapping"
                    element={<Dummy text="Inventory → Search" />}
                  />
                </Route>

                <Route path="partners">
                  <Route index element={<Partners />} />
                  <Route
                    path="create"
                    element={<PartnerForm mode="create" />}
                  />
                  <Route
                    path="edit/:id"
                    element={<PartnerForm mode="edit" />}
                  />
                </Route>

                <Route path="suppliers">
                  <Route index element={<Suppliers />} />
                  <Route
                    path="create"
                    element={<SupplierForm mode="create" />}
                  />
                  <Route
                    path="edit/:id"
                    element={<SupplierForm mode="edit" />}
                  />
                </Route>

                {/* Stock Section */}
                <Route path="stock">
                  <Route path="locations" element={<StockLocationsList />} />
                  <Route
                    path="create/location"
                    element={<StockLocationForm mode="create" />}
                  />
                  <Route
                    path="edit/:id"
                    element={<StockLocationForm mode="edit" />}
                  />
                  <Route path="items" element={<StockItemsList />} />
                  <Route
                    path="stock-by-warehouse"
                    element={<StockByWarehouseList />}
                  />
                </Route>

                {/* Purchase Section */}
                {/* <Route
              path="purchase"
              element={
                <div>
                  <h2>Purchase Section</h2>
                </div>
              }
            >
              <Route path="order" element={<Dummy text="Purchase Order" />} />
              <Route
                path="suppliers"
                element={<Dummy text="Supplier List" />}
              />
            </Route> */}

                {/* Settings & Logout */}
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route
                  path="create/product"
                  element={<ProductForm mode="create" />}
                />
                <Route
                  path="edit/product/:id"
                  element={<ProductForm mode="edit" />}
                />

                {/* <Route path="logout" element={<Dummy text="Logout" />} /> */}
              </Route>
            </Routes>
          </RoleProvider>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
