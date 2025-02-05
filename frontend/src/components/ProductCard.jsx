import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import api from "../api/config";

const ProductCard = ({ product }) => {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    _id: product._id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    discountRate: product.discountRate || 0,
    calculatedPrice: product.calculatedPrice || product.price,
    images: [...product.images], // Store existing images
  });

  const [previewImages, setPreviewImages] = useState([...product.images]);
  const [removedImages, setRemovedImages] = useState([]);

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle discount rate change
  const handleDiscountRateChange = (event) => {
    const discount = event.target.value;
    if (discount < 0 || discount > 100) {
      toast.error('Discount rate must be between 0 and 100', {
        autoClose: 2000,
      });
      return;
    }

    const discountedPrice = formData.price - (formData.price * discount) / 100;
    setFormData({
      ...formData,
      discountRate: discount,
      calculatedPrice: discountedPrice.toFixed(2),
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));

    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    });
    setPreviewImages([...previewImages, ...newImagePreviews]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const removedImage = formData.images[index];
    setRemovedImages((prev) => [...prev, removedImage.name || removedImage]);

    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);

    setFormData({ ...formData, images: updatedImages });
    setPreviewImages(updatedPreviews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("calculatedPrice", formData.calculatedPrice);
    form.append("discountRate", formData.discountRate);

    formData.images.forEach((file) => form.append("images", file));
    form.append("removedImages", JSON.stringify(removedImages));

    try {
      const response = await api.put(`/product/update/${product._id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      if (response.data) {
        toast.success("Product updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, { autoClose: 2000, theme: "colored" });
    }
  };

  return (
    <>
      {/* Product Card */}
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-between">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg mb-4 aspect-square"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 text-center">
          {product.description || "No description available."}
        </p>
        <div className="flex justify-between items-center w-full">
          <p className="text-lg font-semibold text-green-600">
            ${product.price}
          </p>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            onClick={() => setOpen(true)} // Open modal on edit click
          >
            Edit
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              type="number"
            />
            <TextField
              label="Discount Rate (%)"
              variant="outlined"
              fullWidth
              type="number"
              value={formData.discountRate}
              onChange={handleDiscountRateChange}
              InputLabelProps={{ className: "text-gray-400" }}
              InputProps={{ className: "text-white" }}
            />
            <TextField
              label="Calculated Price"
              variant="outlined"
              fullWidth
              value={formData.calculatedPrice}
              InputLabelProps={{ className: "text-gray-400" }}
              InputProps={{ className: "text-white" }}
              disabled
            />

            {/* Preview and remove images */}
            <Typography variant="subtitle1" className="mt-3">
              Images
            </Typography>
            <div className="flex gap-2 flex-wrap mt-2">
              {previewImages.map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border border-gray-300 rounded-lg"
                >
                  <img
                    src={img} // Object URL preview
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "red",
                      color: "white",
                      ":hover": { backgroundColor: "darkred" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>

            {/* Image Upload Button */}
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
            >
              Add More Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                color="error"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="success">
                Save Changes
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ProductCard;
