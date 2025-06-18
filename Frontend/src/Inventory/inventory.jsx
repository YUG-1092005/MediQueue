import React, { useState, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  XCircle,
  X,
  TrendingUp,
  Plus,
  FileText,
  Bell,
  BarChart3,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import "./inventory.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopConfirmBanner from "./confirm";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clinicInventory, setClinicInventory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    expiryDate: "",
    batchNumber: "",
    supplier: "",
  });

  // Fetch clinic ID from URL parameters
  const [searchParams] = useSearchParams();
  const clinicId = searchParams.get("clinic");
  console.log("Clinic ID from URL:", clinicId);

  // Statistics for inventory
  const stats = {
    total: items.length,
    expiringSoon: items.filter((item) => {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);
      const daysDiff = (expiryDate - today) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30 && daysDiff > 0;
    }).length,
    expired: items.filter((item) => new Date(item.expiryDate) < new Date())
      .length,
    outOfStock: items.filter((item) => item.quantity === 0).length,
    goodStock: items.filter((item) => {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);
      const daysDiff = (expiryDate - today) / (1000 * 60 * 60 * 24);
      return item.quantity > 0 && daysDiff > 30;
    }).length,
  };

  // Handle form input changes
  useEffect(() => {
    if (clinicId) {
      axios
        .get(`${import.meta.env.VITE_INVENTORY_SERVER_URL}/api/inventory/clinic/${clinicId}`)
        .then((res) => {
          setClinicInventory(res.data);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [clinicId]);

  // Handle form data changes
  useEffect(() => {
    if (clinicId) {
      fetchItems();
    }
  }, [clinicId]);

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_INVENTORY_SERVER_URL}/api/inventory/${clinicId}`
      );
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  // Handle form input submit
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.expiryDate ||
      !formData.batchNumber ||
      !formData.supplier
    ) {
      toast.error(`Please fill in all fields`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_INVENTORY_SERVER_URL}/api/inventory/update/${editId}`,
          {
            ...formData,
            quantity: parseInt(formData.quantity),
            clinicId,
          }
        );
        toast.success(`Item updated successfully!`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_INVENTORY_SERVER_URL}/api/inventory/add`, {
          ...formData,
          quantity: parseInt(formData.quantity),
          clinicId,
        });
        toast.success(`Item added to inventory!`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      fetchItems();
      setFormData({
        name: "",
        category: "",
        quantity: "",
        expiryDate: "",
        batchNumber: "",
        supplier: "",
      });
      setEditId(null);
      setIsEditing(false);
      setShowModal(false);
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Something went wrong!", {
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

  // Handle inventory editing
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      expiryDate: item.expiryDate.slice(0, 10),
      batchNumber: item.batchNumber,
      supplier: item.supplier,
    });
    setEditId(item._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle deleting items
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // When user cancels
  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Perform deletion after confirmation
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_INVENTORY_SERVER_URL}/api/inventory/delete/${deleteId}`
      );
      setItems((prev) => prev.filter((item) => item._id !== deleteId));
      toast.success("Item deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "light",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error("Failed to delete item!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "light",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // Some quick actions for the inventory
  const quickActions = [
    { icon: FileText, text: "Generate PDF Report" },
    { icon: Bell, text: "Check Expiry Alerts" },
    { icon: BarChart3, text: "View Analytics" },
    { icon: Download, text: "Export Inventory" },
  ];

  // Generate PDF report
  const generatePDF = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });

      if (typeof doc.autoTable !== "function") {
        console.error("autoTable plugin not loaded");
        toast.error("PDF generation failed - plugin not loaded", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
        });
        return;
      }

      const brandPrimary = [41, 128, 185];
      const brandSecondary = [46, 204, 113];
      const brandAccent = [231, 76, 60];
      const brandLight = [236, 240, 241];
      const brandDark = [44, 62, 80];

      const truncate = (str, n) =>
        str?.length > n ? str.slice(0, n) + "…" : str;

      // Header
      doc.setFillColor(...brandPrimary);
      doc.rect(0, 0, 297, 45, "F");

      doc.setFillColor(255, 255, 255);
      doc.circle(25, 22, 12, "F");
      doc.setTextColor(...brandPrimary);
      doc.setFontSize(16).setFont("helvetica", "bold").text("MQ", 20, 26);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24).text("MediQueue", 45, 20);
      doc
        .setFontSize(10)
        .setFont("helvetica", "normal")
        .text("Smart Healthcare  Management", 45, 28);

      doc
        .setFontSize(18)
        .setFont("helvetica", "bold")
        .text("INVENTORY ANALYTICS REPORT", 45, 38);

      const now = new Date();
      doc.setFontSize(9).setTextColor(220, 220, 220);
      doc.text(
        `Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
        210,
        15
      );
      doc.text(`Report ID: INV-${now.getTime().toString().slice(-6)}`, 210, 25);

      // KPI cards
      doc.setTextColor(...brandDark);
      doc
        .setFontSize(16)
        .setFont("helvetica", "bold")
        .text("KEY PERFORMANCE INDICATORS", 14, 60);

      const kpiData = [
        {
          label: "Total Items",
          value: stats.total,
          color: brandPrimary,
          symbol: "T",
        },
        {
          label: "In Stock",
          value: stats.goodStock,
          color: brandSecondary,
          symbol: "G",
        },
        {
          label: "Low Stock",
          value: stats.expiringSoon,
          color: [243, 156, 18],
          symbol: "L",
        },
        {
          label: "Expired",
          value: stats.expired,
          color: brandAccent,
          symbol: "E",
        },
        {
          label: "Out of Stock",
          value: stats.outOfStock,
          color: [155, 89, 182],
          symbol: "O",
        },
      ];

      let cardX = 14;
      kpiData.forEach((kpi) => {
        doc.setFillColor(...kpi.color);
        doc.roundedRect(cardX, 68, 40, 28, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc
          .setFontSize(12)
          .setFont("helvetica", "bold")
          .text(kpi.symbol, cardX + 3, 78);
        doc.setFontSize(8).text(kpi.label.toUpperCase(), cardX + 3, 86);
        doc.setFontSize(18).text(kpi.value.toString(), cardX + 3, 93);

        cardX += 42;
      });

      // Inventory table
      doc.setTextColor(...brandDark);
      doc.setFontSize(16).text("DETAILED INVENTORY BREAKDOWN", 14, 115);

      const columns = [
        "Item Name",
        "Category",
        "Qty",
        "Expiry Date",
        "Batch Number",
        "Supplier",
        "Status",
      ];

      const rows = items.map((item) => {
        const today = new Date();
        const expiryDate = new Date(item.expiryDate);
        const daysDiff = (expiryDate - today) / (1000 * 60 * 60 * 24);

        let status = "GOOD";
        if (item.quantity === 0) status = "OUT";
        else if (daysDiff < 0) status = "EXPIRED";
        else if (daysDiff <= 30) status = "EXPIRING";

        return [
          truncate(item.name || "", 30),
          truncate(item.category || "", 20),
          item.quantity?.toString() || "0",
          item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "",
          item.batchNumber || "",
          truncate(item.supplier || "", 20),
          status,
        ];
      });

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 123,
        margin: { bottom: 50 },
        pageBreak: "auto",
          rowPageBreak: "avoid",
        styles: {
          fontSize: 8,
          cellPadding: 5,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: brandPrimary,
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
          cellPadding: 6,
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        columnStyles: {
          0: { cellWidth: 40, overflow: "linebreak" },
          1: { cellWidth: 30 },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30, halign: "center" },
        },
        didParseCell: function (data) {
          if (data.column.index === 6) {
            const status = data.cell.text[0];
            if (status.includes("EXPIRED")) {
              data.cell.styles.textColor = brandAccent;
            } else if (status.includes("EXPIRING")) {
              data.cell.styles.textColor = [243, 156, 18];
            } else if (status.includes("OUT")) {
              data.cell.styles.textColor = [155, 89, 182];
            } else {
              data.cell.styles.textColor = brandSecondary;
            }
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      // Insights
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFillColor(...brandLight);
      doc.roundedRect(14, finalY - 5, 270, 35, 3, 3, "F");
      doc.setTextColor(...brandDark);
      doc
        .setFontSize(14)
        .text("SMART INSIGHTS & RECOMMENDATIONS", 20, finalY + 5);
      doc.setFontSize(9).setFont("helvetica", "normal");

      const insights = [];
      const totalItems = stats.total;
      const stockHealth = Math.round((stats.goodStock / totalItems) * 100);
      const expiringPercentage = Math.round(
        (stats.expiringSoon / totalItems) * 100
      );

      if (stockHealth > 80)
        insights.push(`EXCELLENT: Inventory health at ${stockHealth}%`);
      else if (stockHealth > 60)
        insights.push(`GOOD: Inventory health at ${stockHealth}%`);
      else insights.push(`ATTENTION: Low health (${stockHealth}%)`);

      if (stats.expired > 0)
        insights.push(`${stats.expired} items are expired`);
      if (expiringPercentage > 15)
        insights.push(`${expiringPercentage}% inventory expires in 30 days`);
      if (stats.outOfStock > 0)
        insights.push(`${stats.outOfStock} items are out of stock`);

      insights.forEach((insight, index) => {
        doc.text(`• ${insight}`, 20, finalY + 15 + index * 6);
      });

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(...brandDark);
      doc.rect(0, pageHeight - 20, 297, 20, "F");
      doc.setTextColor(255, 255, 255).setFontSize(8);
      doc.text(
        "MediQueue - Revolutionizing Healthcare Management",
        14,
        pageHeight - 12
      );
      doc.text("Email: mediqueue24@gmail.com", 14, pageHeight - 6);
      doc.text(
        `Page 1 | Generated by MediQueue Analytics Engine`,
        210,
        pageHeight - 6
      );

      // Save
      const filename = `MediQueue-Inventory-Report-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      doc.save(filename);

      toast.success("Inventory report generated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "dark",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate inventory report", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1 className="inventory-title">
          Inventory of
          {clinicInventory?.clinicName
            ? ` ${clinicInventory.clinicName}`
            : "Inventory Management"}
        </h1>
        <p className="inventory-subtitle">
          Complete inventory control with dynamic expiry tracking
        </p>
      </div>

      <div className="inventory-stats">
        {[
          {
            icon: Package,
            count: stats.total,
            label: "Total Items",
            colorClass: "inventory-stat-icon-box",
          },
          {
            icon: AlertTriangle,
            count: stats.expiringSoon,
            label: "Expiring Soon",
            colorClass: "inventory-stat-icon-warning",
          },
          {
            icon: XCircle,
            count: stats.expired,
            label: "Expired Items",
            colorClass: "inventory-stat-icon-danger",
          },
          {
            icon: X,
            count: stats.outOfStock,
            label: "Out of Stock",
            colorClass: "inventory-stat-icon-stock",
          },
          {
            icon: TrendingUp,
            count: stats.goodStock,
            label: "Good Stock",
            colorClass: "inventory-stat-icon-good",
          },
        ].map((stat, index) => (
          <div key={index} className="inventory-stat-card">
            <div className={`inventory-stat-icon ${stat.colorClass}`}>
              <stat.icon />
            </div>
            <div className="inventory-stat-info">
              <div className="inventory-stat-number">{stat.count}</div>
              <div className="inventory-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="inventory-main-content">
        <div className="inventory-current-section">
          <div className="inventory-section-title">
            Current Inventory
            <button
              className="inventory-add-button"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="inventory-empty-state">
              <Package className="inventory-empty-icon" size={64} />
              <h3 className="inventory-empty-title">No Inventory Items</h3>
              <p className="inventory-empty-text">
                Your inventory is currently empty. Start by adding your first
                medical item to begin tracking your healthcare supplies with
                dynamic expiry monitoring.
              </p>
              <button
                className="inventory-add-button"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} /> Add Your First Item
              </button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div key={item.id} className="inventory-item-card">
                  <div className="inventory-item-header">
                    <div>
                      <div className="inventory-item-name">{item.name}</div>
                      <span className="inventory-item-category">
                        {item.category}
                      </span>
                    </div>
                    <div className="inventory-item-actions">
                      <button
                        className="inventory-item-action-button"
                        style={{ color: "#667eea" }}
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        className="inventory-item-action-button"
                        style={{ color: "#e53e3e" }}
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                      {deleteId === item._id && (
                        <TopConfirmBanner
                          open={true}
                          onConfirm={handleConfirmDelete}
                          onCancel={handleCancel}
                          message="Are you sure you want to delete this item? This action cannot be undone."
                        />
                      )}
                    </div>
                  </div>
                  <div className="inventory-item-details">
                    <div className="inventory-item-detail">
                      <span className="inventory-item-detail-label">
                        Quantity
                      </span>
                      <span className="inventory-item-detail-value">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="inventory-item-detail">
                      <span className="inventory-item-detail-label">
                        Expiry Date
                      </span>
                      <span className="inventory-item-detail-value">
                        {item.expiryDate.slice(0, 10)}
                      </span>
                    </div>
                    <div className="inventory-item-detail">
                      <span className="inventory-item-detail-label">Batch</span>
                      <span className="inventory-item-detail-value">
                        {item.batchNumber}
                      </span>
                    </div>
                    <div className="inventory-item-detail">
                      <span className="inventory-item-detail-label">
                        Supplier
                      </span>
                      <span className="inventory-item-detail-value">
                        {item.supplier}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="inventory-actions-list">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="inventory-action-item"
              onClick={
                action.text === "Generate PDF Report" ? generatePDF : undefined
              }
              style={{
                cursor:
                  action.text === "Generate PDF Report" ? "pointer" : "default",
              }}
            >
              <action.icon className="inventory-action-icon" size={20} />
              <span className="inventory-action-text">{action.text}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="inventory-modal" onClick={() => setShowModal(false)}>
          <div
            className="inventory-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inventory-modal-header">
              <h2 className="inventory-modal-title">Add New Item</h2>
              <button
                className="inventory-close-button"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="inventory-form">
              <div className="inventory-form-group">
                <label className="inventory-label">Item Name</label>
                <input
                  type="text"
                  className="inventory-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>

              <div className="inventory-form-group">
                <label className="inventory-label">Category</label>
                <select
                  className="inventory-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Medications">Medications</option>
                  <option value="Medical Devices">Medical Devices</option>
                  <option value="Surgical Supplies">Surgical Supplies</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="First Aid">First Aid</option>
                  <option value="Personal Protective Equipment">
                    Personal Protective Equipment
                  </option>
                  <option value="Diagnostic Equipment">
                    Diagnostic Equipment
                  </option>
                </select>
              </div>

              <div className="inventory-form-group">
                <label className="inventory-label">Quantity</label>
                <input
                  type="number"
                  className="inventory-input"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder="Enter quantity"
                  min="0"
                />
              </div>

              <div className="inventory-form-group">
                <label className="inventory-label">Expiry Date</label>
                <input
                  type="date"
                  className="inventory-input"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>

              <div className="inventory-form-group">
                <label className="inventory-label">Batch Number</label>
                <input
                  type="text"
                  className="inventory-input"
                  value={formData.batchNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, batchNumber: e.target.value })
                  }
                  placeholder="Enter batch number"
                />
              </div>

              <div className="inventory-form-group">
                <label className="inventory-label">Supplier</label>
                <input
                  type="text"
                  className="inventory-input"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  placeholder="Enter supplier name"
                />
              </div>

              <button
                type="button"
                className="inventory-submit-button"
                onClick={handleSubmit}
              >
                Add Item to Inventory
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Inventory;
