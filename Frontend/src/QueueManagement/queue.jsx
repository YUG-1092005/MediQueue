import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaClock, FaExclamationTriangle } from "react-icons/fa";
import "./queue.css";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Queue = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    type: "",
    reason: "",
    emergency: false,
    sms: true,
  });

  const [lang, setLang] = useState("en");
  const [clinicInventory, setClinicInventory] = useState([]);
  const [now, setNow] = useState(new Date());
  const [searchParams] = useSearchParams();
  const clinicId = searchParams.get("clinic");
  const [isOpen, setIsOpen] = useState(true);
  const [queue, setQueue] = useState([]);
  const [statistics, setStatistics] = useState({
    averageWaitTime: 0,
    averageServiceTime: 0,
    totalWaiting: 0,
    totalCompleted: 0,
    currentlyServing: 0,
  });

  // Use useRef to store socket instance
  const socketRef = useRef(null);

  // Fetch clinic inventory on component mount
  useEffect(() => {
    if (clinicId) {
      axios
        .get(
          `${
            import.meta.env.VITE_QUEUE_SERVER_URL
          }/api/queue/clinic/${clinicId}`
        )
        .then((res) => {
          setClinicInventory(res.data);
          console.log("Clinic inventory fetched:", res.data.clinicName);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [clinicId]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Socket connection and event handling
  useEffect(() => {
    if (!clinicId) return;

    socketRef.current = io(`${import.meta.env.VITE_QUEUE_SERVER_URL}`);
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to server, socket ID:", socket.id);
      socket.emit("join-clinic", clinicId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Queue update handler
    const handleQueueUpdate = ({ queue, statistics }) => {
      console.log("Queue updated via socket:", queue?.length || 0, "items");
      console.log("Statistics received:", statistics);

      if (queue) setQueue(queue);
      if (statistics) setStatistics(statistics);
    };

    socket.on("queue-updated", handleQueueUpdate);

    // Initial fetch from backend REST API
    const fetchQueue = async () => {
      try {
        console.log("Fetching initial queue data for clinic:", clinicId);
        const res = await axios.get(
          `${import.meta.env.VITE_QUEUE_SERVER_URL}/api/queue/today/${clinicId}`
        );
        if (res.data.success) {
          console.log("Initial fetch successful:", res.data);
          setQueue(res.data.queue);
          setStatistics(res.data.statistics);
        }
      } catch (err) {
        console.error("Failed to fetch queue:", err);
      }
    };

    fetchQueue();

    // Cleanup function
    return () => {
      console.log("Cleaning up socket connection for clinic:", clinicId);
      if (socket) {
        socket.off("queue-updated", handleQueueUpdate);
        socket.emit("leave-clinic", clinicId);
        socket.disconnect();
      }
    };
  }, [clinicId]);

  // Check if clinic is open based on time
  useEffect(() => {
    const now = new Date();
    const openTime = new Date();
    openTime.setHours(8, 30, 0);

    const closeTime = new Date();
    closeTime.setHours(17, 0, 0);

    setIsOpen(now >= openTime && now <= closeTime);
  }, []);

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        clinicId: clinicId,
        patient: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          age: form.age,
          gender: form.gender,
        },
        visitType: form.type,
        reason: form.reason,
        isEmergency: form.emergency,
        notifyBySMS: form.sms,
      };

      console.log("Submitting queue join request:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_QUEUE_SERVER_URL}/api/queue/join`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success(
          `Successfully joined queue! Your queue number: ${response.data.queueNumber}`,
          {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        setQueue(response.data.queue);
        setStatistics(response.data.statistics);

        setForm({
          name: "",
          phone: "",
          email: "",
          age: "",
          gender: "",
          type: "",
          reason: "",
          emergency: false,
          sms: true,
        });
      } else {
        toast.error(
          `Error: ${response.data.message || "Failed to join queue"}`,
          {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (err) {
      toast.error("Network error. Please try again later.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Submit error:", err);
    }
  };

  const servingPatient = queue.find((entry) => entry.status === "serving");

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  const handleInputChange = (text) => {
    setForm({ ...form, reason: text });
  };

  return (
    <div className="component-name-container">
      <div className="component-name-main-div">
        <div className="component-name-join-box">
          <h2>Join Queue</h2>
          <form className="component-name-form" onSubmit={handleSubmit}>
            <label>Patient Name</label>
            <input
              name="name"
              placeholder="Enter patient name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Mobile Number</label>
            <input
              name="phone"
              placeholder="Enter mobile number"
              type="tel"
              value={form.phone}
              maxLength={10}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              name="email"
              placeholder="Enter email address"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Age</label>
            <input
              name="age"
              type="number"
              placeholder="Age"
              min={0}
              max={120}
              value={form.age}
              onChange={handleChange}
              required
            />

            <label>Gender</label>
            <div className="component-name-radio-group">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                    required
                  />
                  {g}
                </label>
              ))}
            </div>
            <div className="component-name-select-group">
              <label>Visit Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Select visit type</option>
                <option value="Walk In">Walk In</option>
                <option value="Online">Online</option>
              </select>

              <label htmlFor="language">Choose Language</label>
              <select id="language" value={lang} onChange={handleLangChange}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>
            <label>Reason for Visit</label>
            <textarea
              name="reason"
              placeholder="Describe the reason for your visit"
              value={form.reason}
              onChange={handleChange}
              required
              lang={lang} // Sets the language context
              style={{
                fontFamily: "inherit",
                fontSize: "1rem",
                direction: "ltr",
              }}
            />
            <label className="component-name-checkbox">
              <input
                type="checkbox"
                name="emergency"
                checked={form.emergency}
                onChange={handleChange}
              />
              Is this an emergency?
            </label>

            <label className="component-name-checkbox">
              <input
                type="checkbox"
                name="sms"
                checked={form.sms}
                onChange={handleChange}
              />
              I consent to receive EMAIL notifications about my queue status
            </label>

            <button type="submit" disabled={!isOpen}>
              {isOpen ? "Join Queue" : "Queue Closed"}
            </button>
          </form>
        </div>

        {/* Queue Status */}
        <div className="component-name-status-box">
          <h2>Your Queue Status</h2>
          <div
            className="component-name-status-card"
            style={{ marginTop: "30px" }}
          >
            <FaUser />
            <p>Join the queue to see your status</p>
          </div>

          <div className="component-name-serving-card animated-border">
            <div className="blinking-dot"></div>
            {servingPatient ? (
              <p>
                Now Being Served: <strong>{servingPatient.patient.name}</strong>{" "}
                (Turn #{servingPatient.tokenNumber})
              </p>
            ) : (
              <p>No patient is currently being served.</p>
            )}
          </div>
          <div className="component-name-datetime">
            <span role="img" aria-label="clock">
              🕒
            </span>{" "}
            {now.toLocaleDateString()}{" "}
            {now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Live Queue */}
      <div className="component-name-live-queue">
        <h2>
          Live Queue -{" "}
          {clinicInventory?.clinicName
            ? ` ${clinicInventory.clinicName}`
            : "ILive Queue"}
        </h2>
        <div className="component-name-note">
          {statistics && Object.keys(statistics).length > 0 ? (
            <>
              <p>
                <FaClock /> Average wait time: {statistics.averageWaitTime} min
              </p>
              <p>
                <FaClock /> Average service time by doctor:{" "}
                {statistics.averageServiceTime} min
              </p>
              <p>
                Waiting: {statistics.totalWaiting} | Completed:{" "}
                {statistics.totalCompleted} | Serving:{" "}
                {statistics.currentlyServing}
              </p>
            </>
          ) : (
            <p>Loading statistics...</p>
          )}

          <div
            className="blinking-dot"
            style={{ backgroundColor: "blue" }}
          ></div>
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        {queue.map((item, i) => {
          const activeQueue = queue.filter(
            (entry) => entry.status === "waiting" || entry.status === "serving"
          );
          const positionInActiveQueue = activeQueue.findIndex(
            (entry) => entry._id === item._id
          );
          const peopleAhead =
            positionInActiveQueue > 0 ? positionInActiveQueue : 0;

          return (
            <div
              key={item._id}
              className={`component-name-queue-card ${
                item.status === "serving"
                  ? "serving"
                  : item.status === "done"
                  ? "done"
                  : item.status === "cancelled"
                  ? "cancelled"
                  : item.isEmergency
                  ? "emergency"
                  : ""
              }`}
            >
              <div className="component-name-queue-left">
                <div className="component-name-number">#{item.tokenNumber}</div>
                <div>
                  <strong>{item.patient.name}</strong>
                  <div>
                    {item.status === "serving"
                      ? "Being served now"
                      : item.status === "done"
                      ? "Completed"
                      : item.status === "cancelled"
                      ? "Cancelled"
                      : `${peopleAhead} people ahead`}
                  </div>
                </div>
              </div>

              <div className="component-name-queue-right">
                {item.isEmergency && (
                  <span style={{ color: "red" }}>
                    <FaExclamationTriangle /> Emergency
                  </span>
                )}
                <span>
                  <FaClock />
                  {console.log("Item ", item)}
                  {item.status === "waiting"
                    ? typeof item.estimatedWaitTime == "number"
                      ? `${item.estimatedWaitTime} min Est.`
                      : "Est. N/A"
                    : item.status === "serving"
                    ? "In progress"
                    : item.status === "done"
                    ? "Completed"
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Queue;
