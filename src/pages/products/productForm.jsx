import "../users/users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "../../components/form/form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";

const apiEndpoints = {
  brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/Brand`,
  size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/size`,
  color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/color`,
  os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/os`,
};

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const cachedToken = Cookies.get("token");
  const isEditMode = Boolean(id);
  const [files, setFiles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [versions, setVersions] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    price: "",
    brand: "",
    category: "",
    version: "",
    size: "",
    color: "",
    os: "",
    description: "",
  });

  const [options, setOptions] = useState({
    brand: [],
    size: [],
    color: [],
    os: [],
  });

  const handleBrand = async (e) => {
    setFormData({ ...formData, brand: e.target.value });
  };

  const handleCategory = async (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleVersion = async (e) => {
    setFormData({ ...formData, version: e.target.value });
  };

  const handleFile = (event) => {
    const selectedFiles = Array.from(event.target.files); // convert FileList → Array
    console.log(selectedFiles);
    setFiles(selectedFiles); // store all files
  };

  const formConfig = [
    {
      name: "brand",
      label: "Brand",
      type: "custom-component",
      options: brands,
      required: true,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`brand-label`} required={true}>
              Brand
            </InputLabel>
            <Select
              labelId={`brand-label`}
              id="Brand"
              value={formData.brand}
              label="Brand"
              onChange={handleBrand}
              disabled={false}
            >
              {brands.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.value}>
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "category",
      label: "Category",
      type: "custom-component",
      options: categories,
      required: true,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`category-label`} required={true}>
              Category
            </InputLabel>
            <Select
              labelId={`category-label`}
              id="Category"
              value={formData.category}
              label="Category"
              onChange={handleCategory}
              disabled={false}
            >
              {categories.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.value}>
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "version",
      label: "Version",
      type: "custom-component",
      required: true,
      disabledOnEdit: true,
      CustomComponent: () => (
        <div>
          <FormControl fullWidth size="small" required={true}>
            <InputLabel id={`version-label`} required={true}>
              Version
            </InputLabel>
            <Select
              labelId={`version-label`}
              id="Version"
              value={formData.version}
              label="Version"
              onChange={handleVersion}
              disabled={false}
            >
              {versions.map((opt) => (
                <MenuItem key={opt.id.toString()} value={opt.value}>
                  {opt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
    {
      name: "size",
      label: "Size",
      type: "select",
      options: options.size,
      required: true,
    },
    {
      name: "color",
      label: "Color",
      type: "select",
      options: options.color,
      required: true,
    },
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      required: true,
      disabledOnEdit: true,
    },
    {
      name: "sku",
      label: "SKU Id",
      type: "text",
      required: true,
      disabledOnEdit: true,
    },
    {
      name: "price",
      label: "Base Price",
      type: "text",
      transform: (val) => (/^\d*$/.test(val) ? val : ""),
      required: true,
    },

    {
      name: "os",
      label: "Operating System",
      type: "select",
      options: options.os,
      required: true,
    },
    // {
    //   name: "images",
    //   label: "Upload Images",
    //   type: "custom-component",
    //   required: true,
    //   CustomComponent: () => (
    //     <div>
    //       <TextField
    //         type="file"
    //         id="images"
    //         // label="Outlined"
    //         variant="outlined"
    //         onChange={handleFile}
    //         size="small"
    //         inputProps={{
    //           accept: "image/*", // ✅ only image files (jpg, png, gif, etc.)
    //           multiple: true, // ✅ allow multiple selection
    //         }}
    //       />
    //     </div>
    //   ),
    // },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const [brand, size, color, os] = await Promise.all([
          axios.get(apiEndpoints.brand, {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }),
          axios.get(apiEndpoints.size, {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }),
          axios.get(apiEndpoints.color, {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }),
          axios.get(apiEndpoints.os, {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }),
        ]);

        setOptions({
          brand: brand.data.data || [],
          size: size.data.data || [],
          color: color.data.data || [],
          os: os.data.data || [],
        });
        setBrands(brand?.data?.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        )
        .then((res) => {
          const { data } = res.data;
          setFormData({
            productName: data.name,
            sku: data.sku,
            price: data.basePrice,
            brand: data.brand,
            category: data.category,
            size: data.specification?.size,
            color: data.specification?.color,
            os: data.specification?.["Operating System"],
            description: data.description,
          });
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (!formData.brand) return;

    const selected = brands.find((c) => c.value === formData.brand);
    if (!selected) return;

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/children/${selected.shortCode}`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );

        setCategories(res.data?.data);

        // ❌ remove unconditional reset
        if (!isEditMode) {
          setVersions([]);
          setFormData((prev) => ({ ...prev, category: "", version: "" }));
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    })();
  }, [formData.brand, brands, isEditMode]);

  console.log(categories, "categories");
  console.log(formData, "form data");

  useEffect(() => {
    if (!formData.category) return;

    const selected = categories.find((s) => s.value === formData.category);
    if (!selected) return;

    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/children/${selected.shortCode}`,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
            },
          }
        );
        setVersions(res.data?.data);

        if (!isEditMode) {
          setFormData((prev) => ({ ...prev, version: "" }));
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    })();
  }, [formData.category, categories, isEditMode]);

  useEffect(() => {
    if (
      formData.brand &&
      formData.category &&
      formData.version &&
      formData.size &&
      formData.color
    ) {
      setFormData((prev) => ({
        ...prev,
        productName: `${prev.brand}_${prev.category}_${prev.version}_${prev.size}_${prev.color}`,
        sku: `${prev.category}_${prev.version}_${prev.size}_${prev.color}`,
      }));
    }

    // Auto-set OS based on brand (only if value needs change)
    if (formData.brand !== "") {
      const expectedOS = formData.brand === "AP" ? "iOS" : "Android";
      if (formData.os !== expectedOS) {
        setFormData((prev) => ({
          ...prev,
          os: expectedOS,
        }));
      }
    }
  }, [
    formData.brand,
    formData.category,
    formData.version,
    formData.size,
    formData.color,
    formData.productName,
    formData.os,
  ]);

  console.log("Options:", options);

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
      category: formData.category,
      description: formData.description,
      basePrice: Number(formData.price),
      specification: {
        color: formData.color,
        size: formData.size,
        "Operating System": formData.os,
      },
    };

    const formDataToSend = new FormData();

    formDataToSend.append(
      "product",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (files?.length) {
      files.forEach((file, index) => {
        formDataToSend.append(`files`, file);
      });
    }

    console.log(formDataToSend, "Payload");

    try {
      if (isEditMode) {
        // ✅ PUT API for update
        const res = await axios.put(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products/${id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Product updated successfully!");
        console.log("Updated ✅:", res.data);
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${cachedToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!res?.data?.success) {
          return alert(`${res?.data?.message}`);
        }

        alert("Product created successfully!");
        console.log("Created ✅:", res.data);
      }
      navigate("/products");
    } catch (err) {
      console.error("Error saving product ❌:", err);
      alert(`Failed to save product: ${err.response.data.message}`);
    }
  };

  return (
    <div className="jss1267">
      <div className="serviceOrderListContainer customerListPage">
        <div className="MuiPickTable">
          <div>
            <DynamicForm
              formData={formData}
              setFormData={setFormData}
              formConfig={formConfig}
              isEditMode={isEditMode}
              handleSubmit={handleSubmit}
              createButtonText="Create Product"
              updateButtonText="Update Product"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
