import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  IoArrowBack,
  IoPersonAdd,
  IoCopy,
  IoBusinessSharp,
} from "react-icons/io5";
import axios from "axios";
import { IoChevronDown } from "react-icons/io5";
import "./manage.css";

const roles = ["Doctor", "Nurse", "Receptionist"];

const ToastContext = React.createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = uuidv4();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Component
const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <IoCheckmark className="managemembers-icon-sm" />;
      case "error":
        return <IoAlert className="managemembers-icon-sm" />;
      case "info":
        return <IoInformation className="managemembers-icon-sm" />;
      default:
        return <IoInformation className="managemembers-icon-sm" />;
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      {getIcon()}
      <span>{toast.message}</span>
      <button className="toast-close" onClick={() => onClose(toast.id)}>
        <IoClose className="managemembers-icon-sm" />
      </button>
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

const Manage = () => {
  const { clinicId } = useParams();

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [generatedInvites, setGeneratedInvites] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Doctor",
    department: "",
    numberOfInvites: 1,
    note: "",
  });

  const [errors, setErrors] = useState({});

  // handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfInvites" ? parseInt(value) || 1 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setShowRoleDropdown(false);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (formData.numberOfInvites < 1 || formData.numberOfInvites > 10) {
      newErrors.numberOfInvites = "Number of invites must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newInvites = [];

    for (let i = 0; i < formData.numberOfInvites; i++) {
      const inviteId = uuidv4();
      const invite = {
        id: inviteId,
        role: formData.role,
        email: formData.email,
        department: formData.department,
        link: `${window.location.origin}/invite/${clinicId}/${inviteId}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        used: false,
        name: formData.name,
      };
      newInvites.push(invite);
      try {
        await axios.post(`${import.meta.env.VITE_INVITE_SERVER_URL}/send-invite-email`, {
          email: invite.email,
          name: invite.name,
          link: invite.link,
          role: invite.role,
          clinicId: clinicId,
          inviteId: invite.id,
        });
      } catch (error) {
        console.error("Email sending failed:", error);
      }
    }

    setGeneratedInvites(newInvites);
    setPendingInvites((prev) => [...prev, ...newInvites]);
    setShowInviteForm(false);
    setFormData({
      name: "",
      role: "Doctor",
      department: "",
      numberOfInvites: 1,
      note: "",
    });
    setErrors({});
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="managemembers-container">
      <div className="managemembers-content">
        <div className="managemembers-wrapper">
          <div className="managemembers-header">
            <div className="managemembers-back-button">
              <Link to="/api/list/clinic">
                <button className="managemembers-btn managemembers-btn-outline managemembers-btn-sm">
                  <IoArrowBack className="managemembers-icon-sm" />
                  Back to Clinics
                </button>
              </Link>
            </div>

            <div className="managemembers-header-content">
              <div className="managemembers-title-section">
                <div className="managemembers-title-wrapper">
                  <IoBusinessSharp className="managemembers-icon-lg managemembers-text-blue" />
                  <h1 className="managemembers-title">Manage Members</h1>
                </div>
                <p className="managemembers-org-id">
                  Manage Members easily with MediQueue
                </p>
              </div>

              <button
                onClick={() => setShowInviteForm(true)}
                className="managemembers-btn managemembers-btn-primary"
              >
                <IoPersonAdd className="managemembers-icon-sm" />
                Invite Member
              </button>
            </div>
          </div>

          {showInviteForm && (
            <div className="managemembers-card managemembers-invite-form">
              <div className="managemembers-card-header">
                <h3 className="managemembers-card-title">
                  <IoPersonAdd className="managemembers-icon-lg" />
                  Invite New Member
                </h3>
              </div>
              <div className="managemembers-card-content">
                <form onSubmit={onSubmit} className="managemembers-form">
                  <div className="managemembers-form-grid">
                    <div className="managemembers-form-field">
                      <label className="managemembers-form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter member's name"
                        className="managemembers-form-input"
                      />
                      {errors.name && (
                        <span className="managemembers-form-error">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="managemembers-form-field">
                      <label className="managemembers-form-label">Role *</label>
                      <div className="managemembers-dropdown">
                        <button
                          type="button"
                          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                          className="managemembers-dropdown-trigger"
                        >
                          {formData.role}
                          <IoChevronDown className="managemembers-dropdown-icon" />
                        </button>
                        {showRoleDropdown && (
                          <div className="managemembers-dropdown-content">
                            {roles.map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => handleRoleSelect(role)}
                                className="managemembers-dropdown-item"
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.role && (
                        <span className="managemembers-form-error">
                          {errors.role}
                        </span>
                      )}
                    </div>
                    <div className="managemembers-form-field-three">
                      <div className="managemembers-form-field">
                        <label className="managemembers-form-label">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. raj123@gmail.com"
                          className="managemembers-form-input"
                        />
                        {errors.email && (
                          <span className="managemembers-form-error">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="managemembers-form-actions">
                    <button type="submit" className="managemembers-submit-btn">
                      Generate Invite Link(s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInviteForm(false)}
                      className="managemembers-btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {generatedInvites.length > 0 && (
            <div className="managemembers-card managemembers-generated-invites">
              <div className="managemembers-card-header">
                <h3 className="managemembers-card-title">Generated Links</h3>
              </div>
              <div className="managemembers-card-content">
                <div className="managemembers-generated-list">
                  {generatedInvites.map((invite, index) => (
                    <div
                      key={invite.id}
                      className="managemembers-generated-item"
                    >
                      <div className="managemembers-generated-info">
                        <p className="managemembers-generated-title">
                          {invite.role}{" "}
                          {invite.department && `(${invite.department})`} —
                          Invite {index + 1}
                        </p>
                        <p className="managemembers-generated-expires">
                          Expires in 24h
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(invite.link)}
                        className="managemembers-btn managemembers-btn-primary managemembers-btn-sm"
                      >
                        <IoCopy className="managemembers-icon-sm" />
                        Copy Link
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
