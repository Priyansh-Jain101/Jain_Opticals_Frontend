import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../static/IndividualCustomer.css";
import TableOutput from "./TableOutput.jsx";
import PinModal from "./PinModal.jsx";
import { API_URL } from "../config";

function IndividualCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const pin = "2393";

  //  PIN modal only for delete
  const [pinModalOpen, setPinModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line
  }, []);

  async function fetchCustomer() {
    try {
      const res = await fetch(
        `${API_URL}/jain_opticals/customer/${id}`
      );

      if (!res.ok) throw new Error("Failed to fetch customer");

      const data = await res.json();
      console.log(data);

      setCustomer(data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  //  Open PIN modal only for delete
  function handleDeleteClick() {
    setPinModalOpen(true);
  }

  //  Actual delete function (runs after PIN verified)
  async function deleteCustomer() {
    try {
      const res = await fetch(
        `${API_URL}/jain_opticals/customer/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete customer");

      alert("Customer deleted successfully!");
      navigate("/customers");
    } catch (err) {
      console.log(err);
      alert("Error deleting customer!");
    }
  }

  //  Edit works directly (no PIN)
  function handleEditClick() {
    navigate(`/edit_customer/${id}`);
  }

  if (loading) {
    return (
      <div className="ic-container">
        <div className="ic-loading">Loading customer details...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="ic-container">
        <button className="ic-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="ic-no-data">
          <p>Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ic-container">
        <button className="ic-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="ic-title">Customer Test Data</h1>

        {/* Main Card */}
        <div className="ic-card">
          {/* Header */}
          <div className="ic-header">
            <div className="ic-date-id">
              <div className="ic-date-label">
                Date:{" "}
                <span className="ic-date-value">{customer.date || "N/A"}</span>
              </div>

              <div className="ic-id-label">
                Customer ID:{" "}
                <span className="ic-id-value">
                  {customer.customerId || customer._id}
                </span>
              </div>
            </div>

            <div className="ic-service">
              <span
                className={`ic-badge ${
                  customer.customerService
                    ?.toLowerCase()
                    .replace(/\s+/g, "-") || "pending"
                }`}
              >
                {customer.customerService || "Pending"}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="ic-section">
            <h2 className="ic-section-title">Customer Information</h2>

            <div className="ic-grid">
              <div className="ic-item">
                <span className="ic-label">Name:</span>
                <span className="ic-value">{customer.name || "N/A"}</span>
              </div>

              <div className="ic-item">
                <span className="ic-label">Age:</span>
                <span className="ic-value">{customer.age || "N/A"}</span>
              </div>

              <div className="ic-item">
                <span className="ic-label" style={{ marginBottom: "5px" }}>Phone:</span>
                
                {customer.phone_no ? (
                  <a
                    className="ic-phone-link"
                    href={`tel:${String(customer.phone_no).replace(/\s|-/g, "")}`}
                  >
                    +91-{customer.phone_no}
                  </a>
                ) : (
                  <span className="ic-value">N/A</span>
                )}
              </div>

            </div>
          </div>

          {/* Eye Test Tables */}
          <h2 className="ic-section-title">Eye Test Results</h2>
          <TableOutput type="OLD" customer={customer} variant="old" />
          <TableOutput type="AR" customer={customer} variant="ar" />
          <TableOutput type="NEW" customer={customer} variant="new" />

          {/* Item Bought & Prices */}
          <div className="ic-section">
            <h2 className="ic-section-title">Order Details</h2>

            <div className="item-row">
              <div className="ic-item">
                <span className="ic-label">Item Bought:</span>
                <span className="ic-value">{customer.itemBought || "N/A"}</span>
              </div>

              <div className="ic-item">
                <span className="ic-label">Lens Price:</span>
                <span className="ic-value">₹{customer.lensPrice || 0}</span>
              </div>

              <div className="ic-item">
                <span className="ic-label">Frame Price:</span>
                <span className="ic-value">₹{customer.framePrice || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="ic-section">
            <h2 className="ic-section-title">Payment Information</h2>

            <div className="ic-grid">
              <div className="ic-item">
                <span className="ic-label">Total Amount:</span>
                <span className="ic-value ic-amount">
                  ₹{customer.totalAmount || 0}
                </span>
              </div>

              <div className="ic-item">
                <span className="ic-label">Paid Amount:</span>
                <span className="ic-value ic-paid">
                  ₹{customer.paidAmount || 0}
                </span>
              </div>

              <div className="ic-item">
                <span className="ic-label">Due Amount:</span>
                <span className="ic-value ic-due">
                  ₹{customer.dueAmount || 0}
                </span>
              </div>
            </div>
          </div>

          {/*  Customer Image */}
          <div className="ic-section">
            <h2 className="ic-section-title">Customer Image</h2>

            {customer.image?.url ? (
              <div className="ic-image-wrap">
                <img
                  src={customer.image.url}
                  alt="Customer"
                  className="ic-image"
                />
              </div>
            ) : (
              <p className="ic-no-image">No image uploaded for this customer.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="ic-actions">
            {/*  Edit directly */}
            <button className="ic-edit-btn" onClick={handleEditClick}>
              ✏️ Edit
            </button>

            {/*  Delete with PIN */}
            <button className="ic-delete-btn" onClick={handleDeleteClick}>
              🗑 Delete
            </button>
          </div>
        </div>
      </div>

      {/*  PIN MODAL ONLY FOR DELETE */}
      <PinModal
        open={pinModalOpen}
        correctPin={pin}
        title="Enter PIN"
        subtitle="Verify to delete this customer"
        onClose={() => setPinModalOpen(false)}
        onSuccess={() => {
          setPinModalOpen(false);
          deleteCustomer();
        }}
      />
    </>
  );
}

export default IndividualCustomer;
