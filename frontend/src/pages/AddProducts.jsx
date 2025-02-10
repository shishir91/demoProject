import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "sonner";
import api from "../api/config";

function AddProducts() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState("");
  const [discountRate, setDiscountRate] = useState(0); // New state for discount rate
  const [calculatedPrice, setCalculatedPrice] = useState(0); // New state for calculated price

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleAddCategory = async () => {
    if (!storeId) {
      toast.error("Please select a store before adding a category", {
        duration: 2000,
      });
      return;
    }
    try {
      const response = await api.post(
        `/product/addCategory/${storeId}`,
        { categoryName: category },
        { headers: { token } }
      );
      if (response.data.success) {
        setCategories((prev) => [...prev, category]); // Add new category to the state
        setCategory(""); // Clear input field
        toast.success("Category added successfully!");
        fetchCategory(); // Fetch updated categories
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, { autoClose: 2000, theme: "colored" });
    }
  };

  const handleProductSubmit = async () => {
    if (
      !storeId ||
      !selectedCategory ||
      !productName ||
      !productPrice ||
      !image
    ) {
      toast.error("Please fill all required fields", { autoClose: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("description", description);
    formData.append("category", selectedCategory);
    formData.append("storeId", storeId);
    formData.append("image", image);
    formData.append("discountRate", discountRate);
    formData.append("calculatedPrice", calculatedPrice);

    console.log("FormData", formData);
    try {
      const response = await api.post(
        `/product/addProduct/${storeId}`,
        formData,
        {
          headers: { token, "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        setProductName("");
        setProductPrice("");
        setDescription("");
        setSelectedCategory("");
        setImage("");
        setDiscountRate(0);
        setCalculatedPrice(0); // Reset calculated price after submission
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, { duration: 2000 });
    }
  };

  const fetchCategory = async () => {
    if (!storeId) {
      toast.error("Please select a store before adding a category", {
        duration: 2000,
      });
      return;
    }
    try {
      const response = await api.get(`/product/getCategory/${storeId}`, {
        headers: { token },
      });
      if (response.data) {
        console.log("Fetched Categories", response.data);
        setCategories(response.data[0].name); // Update categories state
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, { duration: 2000 });
    }
  };

  // Handle discount rate change
  const handleDiscountRateChange = (event) => {
    const discount = event.target.value;
    if (discount < 0 || discount > 100) {
      toast.error("Discount rate must be 0 or between 0 -100", {
        duration: 200,
      });
    }
    setDiscountRate(discount);

    // Calculate the price after discount
    const discountedPrice = productPrice - (productPrice * discount) / 100;
    setCalculatedPrice(discountedPrice.toFixed(2)); // Set the calculated price
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response =
          user.role === "admin"
            ? await api.get("/store", { headers: { token } })
            : await api.get("/store/myStores", { headers: { token } });

        if (response.data.success) {
          setStores(response.data.stores);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message, { autoClose: 2000, theme: "colored" });
      }
    };

    fetchStores();
  }, [token]);

  useEffect(() => {
    if (storeId) {
      fetchCategory(); // Fetch categories when storeId changes
    }
  }, [storeId]);

  return (
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-6 mt-7 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-200 hover:text-gray-400 flex items-center"
        >
          <ArrowBackIcon />
          <span className="ml-2 hidden sm:inline">Back</span>
        </button>
        <h1 className="text-xl font-bold text-gray-200 mx-auto">
          Add Products
        </h1>
        <div className="w-19">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-gray-400">Store:</div>
            <div className="text-emerald-500">
              <select
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full px-2 py-2 rounded-lg bg-stone-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option disabled selected>
                  Select Store
                </option>
                {stores.map((store) => (
                  <option value={store._id} key={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Section */}
      <Accordion className="text-black">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-black" />}
        >
          <Typography className="text-black-500 font-semibold">
            Add Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-4">
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              value={category}
              onChange={handleCategoryChange}
              InputLabelProps={{ className: "text-gray-400" }}
              InputProps={{ className: "text-white" }}
              className="bg-inherit rounded-lg"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              className="w-full bg-blue-700 text-white hover:bg-gray-600"
            >
              Add Category
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Add Product Form */}
      <div className="mt-6 p-4 bg-whitesmoke-200 rounded-lg">
        <h2 className="text-lg font-bold text-black-300 mb-4">
          Add New Product
        </h2>
        <div className="flex flex-col gap-4">
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            InputLabelProps={{ className: "text-gray-800" }}
            className="text-gray"
            InputProps={{ className: "text-white" }}
          />
          <TextField
            label="Product Price"
            variant="outlined"
            fullWidth
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            InputLabelProps={{ className: "text-gray-400" }}
            InputProps={{ className: "text-white" }}
          />
          <TextField
            label="Discount Rate (%)"
            variant="outlined"
            fullWidth
            type="number"
            value={discountRate}
            onChange={handleDiscountRateChange}
            InputLabelProps={{ className: "text-gray-400" }}
            InputProps={{ className: "text-white" }}
          />
          <TextField
            label="Calculated Price"
            variant="outlined"
            fullWidth
            value={calculatedPrice}
            InputLabelProps={{ className: "text-gray-400" }}
            InputProps={{ className: "text-white" }}
            disabled
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ className: "text-gray-400" }}
            InputProps={{ className: "text-white" }}
          />
          <Select
            fullWidth
            value={selectedCategory}
            onChange={(e) => {
              const selectedCategoryName = e.target.value;
              setSelectedCategory(selectedCategoryName);
            }}
            displayEmpty
            className="bg-inherit text-white"
          >
            <MenuItem disabled value="">
              Select Category
            </MenuItem>
            {categories ? (
              categories.map((cat, index) => (
                <MenuItem key={index} value={cat}>
                  {cat}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No categories available
              </MenuItem>
            )}
          </Select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-white"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleProductSubmit}
            className="w-full bg-blue-700 text-white hover:bg-gray-600"
          >
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddProducts;
