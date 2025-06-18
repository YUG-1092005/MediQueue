import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";

const Signup = ({ setIsAuthenticated }) => {
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "protonmail.com",
    "aol.com",
    "live.com",
    "zoho.com",
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationType: "user",

    // Clinic fields
    clinicName: "",
    clinicPhone: "",
    clinicAddress: "",
    clinicDescription: "",
    clinicImage: null,

    // NGO fields
    ngoName: "",
    ngoPhone: "",
    ngoAddress: "",
    ngoDescription: "",
    ngoImage: null,

    // User
    userPhone: "",
  });
  const [toastShown, setToastShown] = useState(false);

  const navigate = useNavigate();

  // Function to check if the email domain is allowed
  const isAllowedEmail = (email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return allowedDomains.includes(domain);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAllowedEmail(formData.email)) {
      toast.error(
        `Please use a valid official email (e.g., Gmail, Yahoo, Outlook, etc.)`,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(`Passwords do not match`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    console.log("Signup attempt:", formData);

    try {
      const submitData = new FormData();

      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("organizationType", formData.organizationType);

      if (formData.organizationType === "clinic") {
        submitData.append("clinicName", formData.clinicName || "");
        submitData.append("clinicAddress", formData.clinicAddress || "");
        submitData.append("clinicPhone", formData.clinicPhone || "");
        submitData.append(
          "clinicDescription",
          formData.clinicDescription || ""
        );

        // Add clinic image if exists
        if (formData.clinicImage) {
          submitData.append("clinicImage", formData.clinicImage);
        }
      } else if (formData.organizationType === "ngo") {
        submitData.append("ngoName", formData.ngoName || "");
        submitData.append("ngoPhone", formData.ngoPhone || "");
        submitData.append("ngoAddress", formData.ngoAddress || "");
        submitData.append("ngoDescription", formData.ngoDescription || "");

        // Add NGO image if exists
        if (formData.ngoImage) {
          submitData.append("ngoImage", formData.ngoImage);
        }
      } else if (formData.organizationType === "user") {
        submitData.append("personalPhone", formData.personalPhone || "");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_MAIN_SERVER_URL}/user/signup`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: "include",
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        setIsAuthenticated(true);
        if (!toastShown) {
          toast.success(`${formData.name} welcome to MediQueue!`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setToastShown(true);
        }
        setTimeout(() => {
          navigate("/");
          toast.dismiss();
        }, 2000);
        console.log("User registered successfully");
      } else {
        toast.error(response.data.message || `Registration failed`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Registration failed: " + response.data.message);
      }
    } catch (e) {
      console.log("Error while registrating through frontend:", e);
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle file changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file, // Store the actual file object, not just the name
      }));
    }
  };

  return (
    <div className="Signup-container">
      <div className="Signup-wrapper">
        <div className="Signup-header">
          <Link to="/" className="Signup-title">
            MediQueue
          </Link>
          <p className="Signup-subtitle">Create your account to get started</p>
        </div>

        <div className="Signup-card">
          <div className="Signup-card-header">
            <FaUserPlus className="Signup-icon" />
            <h2 className="Signup-card-title">Sign Up</h2>
          </div>
          <div className="Signup-card-content">
            <form onSubmit={handleSubmit} className="Signup-form">
              <div className="Signup-form-group">
                <label htmlFor="name" className="Signup-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="Signup-input"
                  required
                />
              </div>
              <div className="Signup-form-group">
                <label htmlFor="email" className="Signup-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="Signup-input"
                  required
                />
              </div>
              <div className="Signup-form-group">
                <label htmlFor="organizationType" className="Signup-label">
                  Organization Type
                </label>
                <select
                  id="organizationType"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="Signup-select"
                >
                  <option value="clinic">Clinic</option>
                  <option value="user" defaultChecked>
                    User
                  </option>
                </select>
              </div>

              {/* Conditional fields for Clinic */}
              {formData.organizationType === "clinic" && (
                <>
                  <div className="Signup-form-group">
                    <label htmlFor="clinicImage" className="Signup-label">
                      Clinic Image
                    </label>
                    <input
                      id="clinicImage"
                      name="clinicImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="Signup-input"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="clinicName" className="Signup-label">
                      Clinic Name
                    </label>
                    <input
                      id="clinicName"
                      name="clinicName"
                      type="text"
                      placeholder="Enter clinic name"
                      value={formData.clinicName || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="clinicAddress" className="Signup-label">
                      Clinic Address
                    </label>
                    <textarea
                      id="clinicAddress"
                      name="clinicAddress"
                      placeholder="Enter clinic address"
                      value={formData.clinicAddress || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="clinicPhone" className="Signup-label">
                      Clinic Phone Number
                    </label>
                    <input
                      id="clinicPhone"
                      name="clinicPhone"
                      type="tel"
                      placeholder="Enter clinic phone number"
                      value={formData.clinicPhone || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="clinicDescription" className="Signup-label">
                      Short Description
                    </label>
                    <textarea
                      id="clinicDescription"
                      name="clinicDescription"
                      placeholder="Brief description of your clinic"
                      value={formData.clinicDescription || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      rows="3"
                      required
                    />
                  </div>
                </>
              )}

              {/* Conditional fields for NGO */}
              {formData.organizationType === "ngo" && (
                <>
                  <div className="Signup-form-group">
                    <label htmlFor="ngoImage" className="Signup-label">
                      NGO Image
                    </label>
                    <input
                      id="ngoImage"
                      name="ngoImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="Signup-input"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="ngoName" className="Signup-label">
                      NGO Name
                    </label>
                    <input
                      id="ngoName"
                      name="ngoName"
                      type="text"
                      placeholder="Enter NGO name"
                      value={formData.ngoName || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="ngoPhone" className="Signup-label">
                      NGO Phone Number
                    </label>
                    <input
                      id="ngoPhone"
                      name="ngoPhone"
                      type="tel"
                      placeholder="Enter NGO phone number"
                      value={formData.ngoPhone || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="ngoAddress" className="Signup-label">
                      NGO Address
                    </label>
                    <textarea
                      id="ngoAddress"
                      name="ngoAddress"
                      placeholder="Enter NGO address"
                      value={formData.ngoAddress || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="Signup-form-group">
                    <label htmlFor="ngoDescription" className="Signup-label">
                      Description
                    </label>
                    <textarea
                      id="ngoDescription"
                      name="ngoDescription"
                      placeholder="Brief description of your NGO"
                      value={formData.ngoDescription || ""}
                      onChange={handleChange}
                      className="Signup-input"
                      rows="3"
                      required
                    />
                  </div>
                </>
              )}

              {/* Conditional fields for User */}
              {formData.organizationType === "user" && (
                <div className="Signup-form-group">
                  <label htmlFor="personalPhone" className="Signup-label">
                    Personal Phone Number
                  </label>
                  <input
                    id="personalPhone"
                    name="personalPhone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.personalPhone || ""}
                    onChange={handleChange}
                    className="Signup-input"
                    required
                  />
                </div>
              )}

              <div className="Signup-form-group">
                <label htmlFor="password" className="Signup-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="Signup-input"
                  required
                />
              </div>
              <div className="Signup-form-group">
                <label htmlFor="confirmPassword" className="Signup-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="Signup-input"
                  required
                />
              </div>
              <button type="submit" className="Signup-button">
                Create Account
              </button>
            </form>

            <div className="Signup-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="Signup-login-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
