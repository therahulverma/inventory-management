import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function Dummy({ text }) {
  return <h2 style={{ padding: "20px" }}>{text}</h2>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
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
            <Route index element={<Users />} />

            <Route path="inventory">
              <Route
                path="transfer"
                element={<Dummy text="Inventory → Transfer" />}
              />
              <Route
                path="upload"
                element={<Dummy text="Inventory → Upload" />}
              />
              <Route
                path="search"
                element={<Dummy text="Inventory → Search" />}
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
                path="edit/location/:id"
                element={<StockLocationForm mode="edit" />}
              />
              <Route path="items" element={<Dummy text="Stock → Items" />} />
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
            <Route path="partners" element={<Partners />} />
            <Route path="suppliers" element={<Suppliers />} />
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
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
