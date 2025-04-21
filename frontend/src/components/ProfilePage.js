import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { getProfile, updateProfile } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./common/Navbar";
import { useToast } from "./common/ToastProvider";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      console.log("Profile data:", res.data);
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      
      // Append all form fields correctly
      form.append("name", formData.name || "");
      form.append("email", formData.email || "");
      form.append("phone_num", formData.phone_num || ""); // Changed field name to match backend
      form.append("location", formData.location || "");
      
      // Only append image if one was selected
      if (image) {
        form.append("profile_picture", image);
      }

      console.log("Submitting form data:", Object.fromEntries(form));
      
      // Send profile update request
      await updateProfile(form);
      
      // Fetch updated profile data
      const res = await getProfile();
      console.log("Updated profile data:", res.data);
      
      // Update local state
      setProfile(res.data);
      setFormData(res.data);
      
      // Update the user in AuthContext with new profile data
      if (user) {
        const updatedUser = { ...user, profile_picture: res.data.profile_picture };
        console.log("Updating user in context:", updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      // Reset file state
      setImage(null);
      setPreviewUrl("");
      showToast("Profile updated successfully.", "success");
    } catch (err) {
      console.error("Profile update error:", err);
      showToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar transparent={false} />
      <Box sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            alt={profile.name}
            src={previewUrl || (profile.profile_picture ? profile.profile_picture : "")}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone_num" // Changed to match backend field
            value={formData.phone_num || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Box sx={{ position: "relative", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;