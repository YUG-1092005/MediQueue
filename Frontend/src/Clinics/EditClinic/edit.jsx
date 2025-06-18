import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./edit.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const EditClinic = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  const [clinicData, setClinicData] = useState({
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
    clinicDescription: "",
    clinicImage: null,
    clinicImagePreview: "",
  });

  const isEditing = !!clinicId;

  useEffect(() => {
    if (isEditing) {
      axios
        .get(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/clinic/${clinicId}`)
        .then((res) => {
          if (res.data.success) {
            const {
              clinicName,
              clinicAddress,
              clinicPhone,
              clinicDescription,
              clinicImage,
            } = res.data.clinic;
            setClinicData({
              clinicName: clinicName || "",
              clinicAddress: clinicAddress || "",
              clinicPhone: clinicPhone || "",
              clinicDescription: clinicDescription || "",
              clinicImage: null, // Reset file input
              clinicImagePreview: clinicImage || "", // Show existing image
            });
          }
        })
        .catch(() => {
          toast.error("Failed to load clinic data.");
        });
    }
  }, [isEditing, clinicId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinicData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("clinicName", clinicData.clinicName);
    formData.append("clinicAddress", clinicData.clinicAddress);
    formData.append("clinicPhone", clinicData.clinicPhone);
    formData.append("clinicDescription", clinicData.clinicDescription);

    // Only append image if a new file is selected
    if (clinicData.clinicImage) {
      formData.append("clinicImage", clinicData.clinicImage);
    }

    try {
      const endpoint = isEditing
        ? `/api/clinic/${clinicId}/edit`
        : "/api/clinic/create";

      const res = await axios.put(
        `${import.meta.env.VITE_MAIN_SERVER_URL}${endpoint}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Clinic Updated!!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/api/list/clinic"); // Adjust route as needed
      } else {
        toast.error("Something went wrong. Try again", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Server error please try after some time.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);
      setClinicData((prev) => ({
        ...prev,
        clinicImage: file,
        clinicImagePreview: imageUrl,
      }));
    }
  };

  return (
    <div className="edit-clinic-container">
      <h2>{isEditing ? `Edit ${clinicData.clinicName}` : "Create New Clinic"}</h2>
      <form className="edit-clinic-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Clinic Name</label>
          <input
            type="text"
            name="clinicName"
            value={clinicData.clinicName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="clinicAddress"
            value={clinicData.clinicAddress}
            onChange={handleChange}
            rows={2}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="clinicPhone"
            value={clinicData.clinicPhone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="clinicDescription"
            value={clinicData.clinicDescription}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <p style={{ color: "#333" }}>Image Preview</p>
        {clinicData.clinicImagePreview && (
          <img
            src={clinicData.clinicImagePreview}
            alt="Preview"
            style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
          />
        )}
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            name="clinicImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="submit-btn">
          {isEditing ? "Update Clinic" : "Create Clinic"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditClinic;
