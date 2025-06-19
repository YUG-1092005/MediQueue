import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaUsers,
  FaBoxOpen,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import "./clinics.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState(null);

  const loggedInUserId = currentUser ? currentUser._id : null;

  const confirmDeleteClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    setShowConfirmModal(true);
  };

  const handleConfirmedDelete = () => {
    if (selectedClinicId) {
      handleDeleteClinic(selectedClinicId);
      setShowConfirmModal(false);
      setSelectedClinicId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedClinicId(null);
  };

  const navigate = useNavigate();

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_MAIN_SERVER_URL}/user/verify`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          console.log(response.data);
          setCurrentUser(response.data.user);
          console.log("curr user", response.data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch clinics data
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_MAIN_SERVER_URL}/api/clinic/list`
        );
        if (res.data.success) {
          setClinics(res.data.clinics);
        }
      } catch (err) {
        console.error("Error fetching clinics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.shortId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="clinics-loading">Loading clinics...</p>;
  }

  const handleDeleteClinic = async (clinicId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_MAIN_SERVER_URL}/api/clinic/${clinicId}/remove`
      );
      console.log("clinic data:", response.data);
      if (response.data) {
        navigate("/api/list/clinic");
        toast.success("clinic deleted successfully!", {
          autoClose: 2000,
        });
        console.log("clinic id", clinicId);
      }
    } catch (error) {
      console.log("Error deleting clinic:", error);
    }
  };

  return (
    <section className="clinics-section">
      <div className="clinics-container">
        <div className="clinics-header">
          <h2>Our Partner Clinics</h2>
          <p>
            Discover our network of healthcare facilities, each equipped with
            modern queue management and inventory systems.
          </p>
          <div className="clinics-search-bar">
            <FaSearch className="clinics-search-icon" />
            <input
              type="text"
              placeholder="Search by name or Clinic ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clinics-search-input"
            />
          </div>
        </div>

        <div className="clinics-grid">
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => {
              const clinicId = clinic._id || clinic.shortId;
              const isCreator = clinic.userId === loggedInUserId;
              console.log(
                "Clinic ID:",
                clinic.userId,
                "Creator ID:",
                loggedInUserId
              );

              return (
                <div className="clinics-card" key={clinicId}>
                  <div className="clinics-image-wrapper">
                    {clinic.clinicImage && (
                      <img
                        src={clinic.clinicImage}
                        alt={clinic.clinicName}
                        className="clinics-image"
                      />
                    )}
                  </div>
                  <div className="clinics-card-body">
                    <h3 className="clinics-title">{clinic.clinicName}</h3>
                    <p className="clinics-id">
                      Clinic ID: MediQueue-{clinic.shortId}
                    </p>

                    {/* Always show details */}
                    <div className="clinics-details">
                      <div className="clinics-detail">
                        <FaMapMarkerAlt className="clinics-icon" />
                        <span>{clinic.clinicAddress}</span>
                      </div>
                      <div className="clinics-detail">
                        <FaPhone className="clinics-icon" />
                        <span>{clinic.clinicPhone}</span>
                      </div>
                      <p className="clinics-description">
                        {clinic.clinicDescription}
                      </p>
                      <div className="clinics-actions">
                        <Link
                          to={`/queue-management?clinic=${clinicId}`}
                          className={`clinics-button${
                            !currentUser ? " disabled" : ""
                          }`}
                          onClick={(e) => {
                            if (!currentUser) {
                              e.preventDefault();
                              toast.error("Please log in to join queues.", {
                                position: "bottom-right",
                                autoClose: 2000,
                                hideProgressBar: true,
                                theme: "dark",
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                              });
                            }
                          }}
                        >
                          <FaUsers className="clinics-button-icon" /> Queue
                          Management
                        </Link>

                        {isCreator && (
                          <>
                            <Link
                              to={`/inventory-management?clinic=${clinicId}`}
                              className="clinics-button outline"
                            >
                              <FaBoxOpen className="clinics-button-icon" />{" "}
                              Inventory
                            </Link>
                            <Link
                              to={`/${clinicId}/manage/members`}
                              className="clinics-button outline"
                              style={{
                                borderColor: "#4CAF50",
                                color: "#4CAF50",
                              }}
                            >
                              <FiSettings className="manage-members-icon" />
                              Manage Members
                            </Link>
                          </>
                        )}

                        {/* Dashboard: only for doctors in this clinic */}
                        {currentUser &&
                          currentUser.clinicMemberships &&
                          currentUser.clinicMemberships.some(
                            (membership) =>
                              (membership.clinicId === clinic._id ||
                                membership.clinicId === clinic.shortId ||
                                (membership.clinicId &&
                                  membership.clinicId.toString() ===
                                    clinic._id?.toString())) &&
                              (membership.role === "Doctor" ||
                                membership.role === "Nurse")
                          ) && (
                            <Link
                              to={`/${clinicId}/dashboard`}
                              className="clinics-button outline"
                            >
                              Dashboard
                            </Link>
                          )}

                        {currentUser &&
                          currentUser.clinicMemberships &&
                          currentUser.clinicMemberships.some(
                            (membership) =>
                              (membership.clinicId === clinic._id ||
                                membership.clinicId === clinic.shortId ||
                                (membership.clinicId &&
                                  membership.clinicId.toString() ===
                                    clinic._id?.toString())) &&
                              membership.role === "Receptionist"
                          ) && (
                            <a
                              href={`${
                                import.meta.env.VITE_FRONTEND_URL
                              }/inventory-management?clinic=${clinicId}`}
                              className="clinics-button outline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Inventory
                            </a>
                          )}
                      </div>
                    </div>
                    {isCreator && (
                      <div className="clinics-admin-actions">
                        <Link
                          to={`/clinics/${clinicId}/edit`}
                          className="clinics-icon-button"
                          title="Edit Clinic"
                        >
                          <FaEdit style={{ color: "#1976d2" }} />
                        </Link>
                        <button
                          className="clinics-icon-button"
                          title="Delete Clinic"
                          onClick={() => confirmDeleteClinic(clinicId)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <FaTrash style={{ color: "#d32f2f" }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <p> No clinics found/added matching your search.</p>
              <p>Try adjusting your keywords or check spelling.</p>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>This will permanently delete the clinic.</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn delete" onClick={handleConfirmedDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Clinics;
