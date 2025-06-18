import React from "react";
import "./confirm.css";

const TopConfirmBanner = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;
  return (
    <div className="top-confirm-banner">
      <span>{message || "Are you sure you want to delete?"}</span>
      <button className="yes-btn" onClick={onConfirm}>Yes</button>
      <button className="cancel-btn" onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default TopConfirmBanner;
