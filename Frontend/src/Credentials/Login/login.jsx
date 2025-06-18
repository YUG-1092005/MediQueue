import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = ({ setIsAuthenticated }) => {
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [toastShown, setToastShown] = useState(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInFormData({ ...signInFormData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { signInFormData });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MAIN_SERVER_URL}/user/login`,
        signInFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);

      if (response.data.success) {
        setIsAuthenticated(true);
        if (!toastShown) {
          toast.success(`Welcome back to MediQueue!`, {
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
        console.log("User logged successfully");
      } else {
        toast.error("Please check your credentials.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (e) {
      console.log("Error while login through frontend:", e);
      toast.error(
        "Wrong Password or Email, signup if you don't have an account",
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
    }
  };

  return (
    <div className="Login-container">
      <div className="Login-wrapper">
        <div className="Login-header">
          <Link to="/" className="Login-title">
            MediQueue
          </Link>
          <p className="Login-subtitle">Welcome back to your account</p>
        </div>

        <div className="Login-card">
          <div className="Login-card-header">
            <FaSignInAlt className="Login-icon" />
            <h2 className="Login-card-title">Sign In</h2>
          </div>
          <div className="Login-card-content">
            <form onSubmit={handleSubmit} className="Login-form">
              <div className="Login-form-group">
                <label htmlFor="email" className="Login-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={signInFormData.email}
                  name="email"
                  onChange={handleChange}
                  className="Login-input"
                  required
                />
              </div>
              <div className="Login-form-group">
                <label htmlFor="password" className="Login-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={signInFormData.password}
                  name="password"
                  onChange={handleChange}
                  className="Login-input"
                  required
                />
              </div>
              <button type="submit" className="Login-button">
                Sign In
              </button>
            </form>

            <div className="Login-footer">
              <p>
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="Login-signup-link">
                  Sign up
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

export default Login;
