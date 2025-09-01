import "../users/users.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "../../components/form/form";
import { TextField } from "@mui/material";

const apiEndpoints = {
  brand: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/Brand`,
  size: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/size`,
  color: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/color`,
  os: `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_MASTER_DATA_API_PORT}/api/v1/constants/key/os`,
};

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get productId from route (for edit)
  const isEditMode = Boolean(id);
  const [files, setFiles] = useState([]);

  const handleFile = (event) => {
    const selectedFiles = Array.from(event.target.files); // convert FileList → Array
    console.log(selectedFiles);
    setFiles(selectedFiles); // store all files
  };
  const [options, setOptions] = useState({
    brand: [],
    size: [],
    color: [],
    os: [],
  });

  const formConfig = [
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
      name: "brand",
      label: "Brand",
      type: "select",
      options: options.brand,
      required: true,
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
          setFormData({
            productName: data.name,
            sku: data.sku,
            price: data.basePrice,
            brand: data.brand,
            size: data.specification?.size || "",
            color: data.specification?.color || "",
            os: data.specification?.["Operating System"] || "",
            description: data.description,
          });
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id, isEditMode]);

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
      category: "MOBILE",
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
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // const res = await axios.post(
        //   `${process.env.REACT_APP_IP_ADDRESS}${process.env.REACT_APP_PRODUCT_API_PORT}/api/v1/products`,
        //   formDataToSend,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );
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
