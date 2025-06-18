import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./invite_signup.css";

const InviteSignup = () => {
  const { clinicId, inviteId } = useParams();
  const navigate = useNavigate();

  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast function
  const showToast = (message, type = "info", duration = 4000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, duration);
  };

  // Validate invite on component mount
  useEffect(() => {
    const validateInvite = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_INVITE_SERVER_URL}/api/invite/validate/${clinicId}/${inviteId}`
        );
        setInviteData(res.data);
        showToast("Invite validated successfully!", "success");
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Invalid invite";
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    };

    validateInvite();
  }, [clinicId, inviteId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      showToast(errorMsg, "error");
      return;
    }

    if (password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      setError(errorMsg);
      showToast(errorMsg, "error");
      return;
    }

    setLoading(true);
    showToast("Processing your invitation...", "info");

    try {
      await axios.post(
        `${import.meta.env.VITE_INVITE_SERVER_URL}/api/invite/accept`,
        {
          clinicId,
          inviteId,
          fullName,
          email: inviteData.email,
          personalPhone,
          password,
          role: inviteData.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      showToast("🎉 Welcome aboard! Redirecting...", "success", 2000);

      setTimeout(() => {
        if (inviteData.role === "Receptionist") {
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/inventory-management?clinic=${clinicId}`;
        } else if (
          inviteData.role === "Nurse" ||
          inviteData.role === "Doctor"
        ) {
          navigate(`/${clinicId}/dashboard`);
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to accept invite";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Toast Component
  const Toast = ({ show, message, type }) => {
    if (!show) return null;

    const getToastIcon = () => {
      switch (type) {
        case "success":
          return "✅";
        case "error":
          return "❌";
        case "warning":
          return "⚠️";
        default:
          return "ℹ️";
      }
    };

    return (
      <div className={`toast toast-${type} ${show ? "toast-show" : ""}`}>
        <div className="toast-content">
          <span className="toast-icon">{getToastIcon()}</span>
          <span className="toast-message">{message}</span>
        </div>
        <button
          className="toast-close"
          onClick={() => setToast({ show: false, message: "", type: "" })}
        >
          ×
        </button>
      </div>
    );
  };

  // Enhanced Error Display Component
  const ErrorDisplay = ({ error }) => {
    if (!error) return null;

    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  };

  if (error && !inviteData) return <ErrorDisplay error={error} />;
  if (!inviteData) return <p>Validating invite...</p>;

  return (
    <>
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="invite-signup-container">
        <h2>You're invited to join a clinic!</h2>
        <p>Email: {inviteData.email}</p>
        <p>Role: {inviteData.role}</p>

        <form onSubmit={handleSubmit} className="invite-accept-form">
          <label>
            Full Name
            <input
              type="text"
              required
              value={fullName}
              placeholder="Enter your full name"
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Personal Phone No.
            <input
              type="text"
              required
              value={personalPhone}
              maxLength={10}
              placeholder="Enter your personal phone number"
              onChange={(e) => setPersonalPhone(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              placeholder="Enter a secure password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              required
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {error && (
            <div className="form-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Accepting Invite..." : "Accept Invite"}
          </button>
        </form>
      </div>
    </>
  );
};

export default InviteSignup;
