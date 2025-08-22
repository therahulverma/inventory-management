import { Button, Paper, TextareaAutosize, TextField } from "@mui/material";
import "../users/users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../components/select/select";

const apiEndpoints = {
  brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Brands`,
  size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Size`,
  color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/color`,
  os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/Operating%20System`,
};

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const [options, setOptions] = useState({
    brand: [],
    size: [],
    color: [],
    os: [],
  });

  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    price: "",
    brand: "",
    size: "",
    color: "",
    os: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [brand, size, color, os] = await Promise.all([
          axios.get(apiEndpoints.brand),
          axios.get(apiEndpoints.size),
          axios.get(apiEndpoints.color),
          axios.get(apiEndpoints.os),
        ]);

        setOptions({
          brand: brand.data.data || [],
          size: size.data.data || [],
          color: color.data.data || [],
          os: os.data.data || [],
        });
      } catch (error) {
        console.error("Error fetching options", error);
      }
    })();

    if (isEditMode) {
      axios
        .get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products/${id}`
        )
        .then((res) => {
          const { data } = res.data;
          console.log(data, "fdefs");
          setFormData({
            productName: data.name,
            sku: data.sku,
            price: data.basePrice,
            brand: data.brand,
            size: data.specification?.size || "",
            color: data.specification?.color || "",
            os: data.specification?.os || "",
            description: data.description,
          });
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id, isEditMode]);

  console.log("Options:", options);
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const requiredFields = [
      "productName",
      "sku",
      "price",
      "brand",
      "size",
      "color",
      "os",
      "description",
    ];
    const missing = requiredFields.filter((f) => !formData[f]);

    if (missing.length > 0) {
      alert(`Missing fields: ${missing.join(", ")}`);
      return;
    }

    console.log("Submitting:", formData);

    const payload = {
      name: formData.productName,
      sku: formData.sku,
      brand: formData.brand,
      category: "MOBILE",
      description: formData.description,
      basePrice: formData.price,
      status: "Active",
      specification: {
        color: formData.color,
        size: formData.size,
        "Operating System": formData.os,
      },
    };

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products/${id}`,
          payload
        );
        alert("Product updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        // ✅ POST API for create
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products`,
          payload
        );
        alert("Product created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/products");
    } catch (err) {
      console.error("Error saving product ❌:", err);
      alert("Failed to save product");
    }
  };

  return (
    <div className="jss1267">
      <div className="serviceOrderListContainer customerListPage">
        <div className="MuiPickTable">
          <div>
            <form onSubmit={handleSubmit}>
              <Paper elevation={3} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    padding: 25,
                  }}
                >
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Product Name"
                      size="small"
                      value={formData.productName}
                      onChange={(e) =>
                        handleChange("productName", e.target.value)
                      }
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="SKU Id"
                      size="small"
                      value={formData.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      disabled={isEditMode}
                    />
                  </div>
                  <div style={{ width: "45%", margin: 5 }}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label="Base Price"
                      size="small"
                      value={formData.price}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          // ✅ only digits allowed
                          handleChange("price", value);
                        }
                      }}
                    />
                  </div>
                  <SelectField
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    options={options.brand}
                    required
                  />
                  <SelectField
                    label="Size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    options={options.size}
                    required
                  />
                  <SelectField
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    options={options.color}
                    required
                  />
                  <SelectField
                    label="Operating System"
                    name="os"
                    value={formData.os}
                    onChange={handleChange}
                    options={options.os}
                    required
                  />
                  <div style={{ width: "100%", margin: 5 }}>
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Description"
                      style={{ width: "100%", minHeight: 120 }}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </Paper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
