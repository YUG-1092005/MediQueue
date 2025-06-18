import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./dashboard.css";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorDashboard = () => {
  const [queue, setQueue] = useState([]);
  const { clinicId } = useParams();
  const [clock, setClock] = useState(new Date());

  // Initialize clock state to current time
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to fetch the queue from the backend
  const fetchQueue = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_QUEUE_SERVER_URL}/api/queue/today/${clinicId}`
      );
      if (res.data.success) {
        console.log("Fetched queue:", res.data.queue.length, "entries");
        setQueue(res.data.queue);
      }
    } catch (err) {
      console.error("Failed to fetch queue", err);
    }
  }, [clinicId]);

  // Use useEffect to fetch queue and set up socket connection
  useEffect(() => {
    if (!clinicId) return;

    fetchQueue();

    const socket = io(`${import.meta.env.VITE_QUEUE_SERVER_URL}`);

    socket.emit("join-clinic", clinicId);

    const handleQueueUpdate = (data) => {
      console.log("Queue updated via socket:", data);
      if (data.queue) {
        setQueue(data.queue);
      } else {
        fetchQueue();
      }
    };

    socket.on("queue-updated", handleQueueUpdate);

    return () => {
      console.log("Cleaning up doctor dashboard socket for clinic:", clinicId);
      socket.off("queue-updated", handleQueueUpdate);
      socket.emit("leave-clinic", clinicId);
      socket.disconnect();
    };
  }, [clinicId]);

  // Function to update the status of a queue entry
  const updateStatus = async (entryId, status) => {
    try {
      console.log(`Updating entry ${entryId} to status: ${status}`);

      const response = await axios.patch(
        `${import.meta.env.VITE_QUEUE_SERVER_URL}/api/queue/${entryId}/status`,
        { status }
      );

      if (response.data.success) {
        console.log("Status updated successfully");
        setQueue((prev) =>
          prev.map((entry) =>
            entry._id === entryId ? { ...entry, status } : entry
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const statusCounts = queue.reduce((acc, entry) => {
    acc[entry.status] = (acc[entry.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard - Live Queue</h2>
      <div className="dashboard-header">
        <div className="queue-status-summary">
          <strong>Waiting:</strong> {statusCounts["waiting"] || 0}
          {" | "}
          <strong>Serving:</strong> {statusCounts["serving"] || 0}
          {" | "}
          <strong>Completed:</strong> {statusCounts["done"] || 0}
          {" | "}
          <strong>Cancelled:</strong> {statusCounts["cancelled"] || 0}
        </div>

        <div className="datetime-box">
          <div className="date">{new Date().toLocaleDateString()}</div>
          <div className="clock" id="live-clock">
            <div className="clock">{clock.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
      {queue.map((entry) => (
        <div
          key={entry._id}
          className={`queue-card ${entry.isEmergency ? "emergency" : ""}`}
        >
          <strong>{entry.patient.name}</strong> (Token #{entry.tokenNumber})
          <p>
            Age: {entry.patient.age} | Phone: {entry.patient.phone}
          </p>
          <p>Reason: {entry.reason || "N/A"}</p>
          <p>Status: {entry.status}</p>
          <button
            onClick={() => updateStatus(entry._id, "serving")}
            disabled={entry.status !== "waiting"}
          >
            Serve
          </button>
          <button
            onClick={() => updateStatus(entry._id, "done")}
            disabled={entry.status !== "serving"}
          >
            Done
          </button>
          <button
            onClick={() => updateStatus(entry._id, "cancelled")}
            disabled={entry.status === "done" || entry.status === "cancelled"}
          >
            Cancel
          </button>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default DoctorDashboard;
