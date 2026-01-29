import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/CustomerData.css';
import { formatedDate } from '../utils/FormateDate.js';
import BillTemplate from './BillTemplate.jsx';
import html2canvas from "html2canvas";


import { API_URL } from "../config";


function CustomerData() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchPhone, setSearchPhone] = useState("");
    const navigate = useNavigate();

    const[selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            // Production API call
            // const res = await fetch(`${API_URL}/jain_opticals/customers`);

            const res = await fetch("http://localhost:8080/jain_opticals/customers");
            if (!res.ok) throw new Error("Failed to fetch customers");
            const data = await res.json();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setLoading(false);
        }
    }

    function handleBack() {
        navigate("/");
    }

    function handleChange(id) {
        console.log("Navigating to individual customer page");
        navigate(`/customer/${id}`);
    }

    // handle search functionality
    async function handleSearch(){
        if (!searchPhone.trim()) return;

        try {
            // Production API call
            // const res = await fetch(`${API_URL}/jain_opticals/search_customer`, {
            // method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ phone_no: searchPhone }),
            // });

            const res = await fetch("http://localhost:8080/jain_opticals/search_customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_no: searchPhone }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Customer not found");
                return;
            }

            // backend returns customers array
            console.log(data.customers);
            setCustomers(data.customers);
        } catch (err) {
            console.log(err);
            alert("Error searching customer");
        }
    }

    if (loading) {
        return (
            <div className="customer-data-container">
                <div className="loading">Loading customer data...</div>
            </div>
        );
    }
const generateAndSaveBill = async (phone_no) => {

  const billElement = document.getElementById("bill-area");

  if (!billElement) {
    alert("Bill template not found");
    return;
  }

  const canvas = await html2canvas(billElement, {
    scale: 3,
    backgroundColor: "#ffffff"
  });

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "jain-opticals-bill.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    /* Open WhatsApp after save */
    const message = "Your Billing Information";
    window.open(
        `https://wa.me/91${phone_no}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

  }, "image/png");
};



    return (
        <>
            <div className="customer-data-container">
                <button className="back-button" onClick={handleBack}>← Back to Home</button>
                <h1 className="page-title">All Customers</h1>

                {/* Search Box */}
                <div className="search-bar">
                    <input
                        type="tel"
                        className="search-input"
                        placeholder="Search by phone number..."
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                    <button className="search-btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>


                {customers.length === 0 ? (
                    <div className="no-customers">
                        <p>No customer data available</p>
                    </div>
                ) : (

                    <>
                    <div className="customers-grid">
                        {customers.map((customer) => (
                            <div key={customer._id} className="customer-card" onClick={()=> handleChange(customer._id)}>

                                {/* Date + Customer ID (Left) + Service Status (Right) */}
                                <div className="customer-header">
                                    <div className="date-id-section">
                                        <div className="date-label">
                                            Date: <span className="date-value">{formatedDate(customer.date) || 'N/A'}</span>
                                        </div>
                                        {/* <div className="customer-id-label">
                                            Customer ID: <span className="customer-id-value">{customer.customerId || customer._id}</span>
                                        </div> */}
                                    </div>

                                    {/* Service Feature Top Right */}
                                    <div className="service-top-right">
                                        <span className={`service-badge ${customer.customerService?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                                            {customer.customerService || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="customer-section">
                                    {/* <h2 className="section-title">Customer Information</h2> */}
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Name:</span>
                                            <span className="info-value">{customer.name || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Age:</span>
                                            <span className="info-value">{customer.age || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Phone:</span>

                                            {customer.phone_no ? (
                                                <a
                                                className="info-value info-phone-link"
                                                href={`tel:${String(customer.phone_no).replace(/\s|-/g, "")}`}
                                                >
                                                {customer.phone_no}
                                                </a>
                                            ) : (
                                                <span className="info-value">N/A</span>
                                            )}
                                        </div>

                                        <div>
                                            <span className="info-label">Amount: </span>
                                            <br />
                                            <span className="info-value">{customer.totalAmount || 'N/A'}</span>
                                        </div>

                                    </div>
                                </div>

                                <button className="share-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(customer);
                                    setTimeout(() => {
                                        generateAndSaveBill(customer.phone_no);
                                    }, 100);
                                    }}
                                >
                                    <i class="fa-solid fa-share"></i>
                                </button>
                                


                                {/* Eye Test Results
                                <div className="customer-section">
                                    <h2 className="section-title">Eye Test Results</h2>
                                    <div className="eye-test-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Eye</th>
                                                    <th>Sph</th>
                                                    <th>Cyl</th>
                                                    <th>Axis</th>
                                                    <th>Add</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Right</td>
                                                    <td>{customer.rSph || 'N/A'}</td>
                                                    <td>{customer.rCyl || 'N/A'}</td>
                                                    <td>{customer.rAxis || 'N/A'}</td>
                                                    <td>{customer.rVis || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Left</td>
                                                    <td>{customer.lSph || 'N/A'}</td>
                                                    <td>{customer.lCyl || 'N/A'}</td>
                                                    <td>{customer.lAxis || 'N/A'}</td>
                                                    <td>{customer.lVis || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div> */}

                                {/* Purchase Information
                                <div className="customer-section">
                                    <h2 className="section-title">Purchase Information</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Item Bought:</span>
                                            <span className="info-value">{customer.itemBought || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Lens Price:</span>
                                            <span className="info-value">₹{customer.lensPrice || '0'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Frame Price:</span>
                                            <span className="info-value">₹{customer.framePrice || '0'}</span>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Payment Information
                                <div className="customer-section">
                                    <h2 className="section-title">Payment Information</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Total Amount:</span>
                                            <span className="info-value amount">₹{customer.totalAmount || '0'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Paid Amount:</span>
                                            <span className="info-value amount-paid">₹{customer.paidAmount || '0'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Due Amount:</span>
                                            <span className="info-value amount-due">₹{customer.dueAmount || '0'}</span>
                                        </div>
                                    </div>
                                </div> */}

                            </div>
                        ))}
                    </div>

                    {/* Hidden bill template for image generation */}
                    {selectedCustomer && (
                        <div style={{
                            position: "absolute",
                            left: "-9999px",
                            top: "0"
                        }}>
                            <BillTemplate customer={selectedCustomer} />
                        </div>
                    )}

                    </>
                )}
            </div>
        </>
    );
}

export default CustomerData;
