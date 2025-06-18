import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaUsers,
  FaBoxOpen,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ngo.css";

const Ngo = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
const [currentUser, setCurrentUser] = useState(null);
  const loggedInUserId = currentUser ? currentUser._id : null;

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


  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/ngo/listings");
        if (res.data.success) {
          setNgos(res.data.ngos);
        }
      } catch (err) {
        console.error("Error fetching NGOs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  const filteredNgos = ngos.filter(
    (ngo) =>
      ngo.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.shortId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="ngos-loading">Loading NGOs...</p>;
  }

  return (
    <section className="ngos-section">
      <div className="ngos-container">
        <div className="ngos-header">
          <h2>Our Partner NGOs</h2>
          <p>
            Discover NGOs contributing to healthcare access and supply chain
            efficiency.
          </p>
          <div className="ngos-search-bar">
            <FaSearch className="ngos-search-icon" />
            <input
              type="text"
              placeholder="Search by name or NGOID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ngos-search-input"
            />
          </div>
        </div>

        <div className="ngos-grid">
          {filteredNgos.length > 0 ? (
            filteredNgos.map((ngo) => {
              const isCreator = ngo.userId === loggedInUserId;
              const ngoId = ngo._id || ngo.shortId;

              return (
                <div className="ngos-card" key={ngoId}>
                  <div className="ngos-image-wrapper">
                    <img
                      src={ngo.ngoImage}
                      alt={ngo.ngoName}
                      className="ngos-image"
                    />
                  </div>
                  <div className="ngos-card-body">
                    <h3 className="ngos-title">{ngo.ngoName}</h3>
                    <p className="ngos-id">NGO ID: Mediqueue-{ngo.shortId}</p>

                    <div className="ngos-details">
                      <div className="ngos-detail">
                        <FaMapMarkerAlt className="ngos-icon" />
                        <span>{ngo.ngoAddress}</span>
                      </div>
                      <div className="ngos-detail">
                        <FaPhone className="ngos-icon" />
                        <span>{ngo.ngoPhone}</span>
                      </div>
                      <p className="ngos-description">{ngo.ngoDescription}</p>

                      <div className="ngos-actions">
                        {/* Queue available to all logged-in users
                        <Link
                          to={`/queue-management?ngo=${ngoId}`}
                          className="ngos-button"
                        >
                          <FaUsers className="ngos-button-icon" /> Queue
                          Management
                        </Link> */}

                        {/* Inventory only for the creator */}
                        {/* {isCreator && (
                          <Link
                            to={`/inventory-management?ngo=${ngoId}`}
                            className="ngos-button outline"
                          >
                            <FaBoxOpen className="ngos-button-icon" /> Inventory
                          </Link>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <p>No NGOs found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Ngo;
