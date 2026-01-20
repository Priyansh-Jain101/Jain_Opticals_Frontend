import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/Home.css";
import logo from "../assets/Jain_Opticals_Logo.jpeg";
import PinModal from "./PinModal.jsx";

function Home() {
  const navigate = useNavigate();
  const pin = "2393";

  const [pinModal, setPinModal] = useState({ open: false, action: "" });

  function handleClickCustomerData() {
    navigate("/customers");
  }

  function handleClickAddCustomer() {
    setPinModal({ open: true, action: "add" });
  }

  return (
    <>
      <div className="home-container">
        <div className="home-hero">
          <img src={logo} alt="Jain Optical Logo" className="home-logo" />

          <h1 className="home-title">Jain Opticals</h1>
          <p className="home-subtitle">In your Service Since 1995</p>
        </div>

        <div className="home-actions">
          {/* Add Customer */}
          <div className="action-card" onClick={handleClickAddCustomer}>
            <div className="action-icon add-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <div className="action-image">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="6" cy="12" r="4" />
                <circle cx="18" cy="12" r="4" />
                <path d="M10 12h4" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="action-title">Add Customer</h2>
            <p className="action-description">
              Register a new customer and their optical test details
            </p>
          </div>

          {/* Customer Data */}
          <div className="action-card" onClick={handleClickCustomerData}>
            <div className="action-icon data-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <div className="action-image">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>

            <h2 className="action-title">Customer Data</h2>
            <p className="action-description">
              View and manage all customer records and test data
            </p>
          </div>
        </div>
      </div>

      {/*  Reusable PIN Modal */}
      <PinModal
        open={pinModal.open}
        correctPin={pin}
        title="Enter PIN"
        subtitle="Verify to add customer"
        onClose={() => setPinModal({ open: false, action: "" })}
        onSuccess={() => navigate("/add_customer")}
      />
    </>
  );
}

export default Home;
