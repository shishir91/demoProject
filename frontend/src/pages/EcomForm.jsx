import React, { useState, useRef } from "react";
import { TextField, Button, Typography, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function EcomForm() {
  // State variables for each input field
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Only take the first image
    if (file) {
      setBannerImage(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleImageRemove = () => {
    setBannerImage(null); // Remove the image
    fileInputRef.current.value = ""; // Clear the file input value
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page on submit

    // Log or display the form values
    console.log({
      whatsappNumber,
      storeDescription,
      instagramUrl,
      facebookUrl,
      tiktokUrl,
      bannerImage,
    });

    // Optionally, show the values on the UI after submit
    alert("Form Submitted! Check console for values.");
  };

  return (
    <div className="p-4 sm:ml-64 bg-stone-800 min-h-screen mr-6 mt-7 rounded-xl text-whitesmoke-200 flex items-center justify-center overflow-hidden">
      <Box
        sx={{
          backgroundColor: "#2d2d2d",
          padding: 4,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          maxWidth: 600,
          width: "100%",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "whitesmoke" }}
          align="center"
        >
          E-Commerce Form
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 2,
          }}
        >
          <TextField
            label="WhatsApp Number"
            type="tel"
            variant="outlined"
            fullWidth
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: { color: "white" },
              inputMode: "numeric", // This helps bring up the numeric keypad on mobile devices
              pattern: "[0-9]*", // Restrict to numbers only
            }}
          />
          <TextField
            label="Store Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <TextField
            label="Instagram Page URL"
            type="url"
            variant="outlined"
            fullWidth
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <TextField
            label="Facebook Page URL"
            type="url"
            variant="outlined"
            fullWidth
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <TextField
            label="TikTok URL"
            type="url"
            variant="outlined"
            fullWidth
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <div>
            <Typography style={{ color: "white", marginBottom: "8px" }}>
              Store Banner
            </Typography>
            <input
              ref={fileInputRef} // Attach the ref to the input
              type="file"
              accept="image/*"
              style={{ color: "white" }}
              onChange={handleImageChange}
            />
            {bannerImage && (
              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <img
                  src={bannerImage}
                  alt="Banner Preview"
                  className="w-20 h-20 object-cover"
                />
                <IconButton
                  onClick={handleImageRemove}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: 450,
                    backgroundColor: "red",
                    color: "white",
                    ":hover": { backgroundColor: "darkred" },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </div>
  );
}
