import "../static/BillTemplate.css";
import logo from "../assets/Jain_Opticals_Logo.jpeg";
import TableOutput from "./TableOutput";

const BillTemplate = ({ customer }) => {
  return (
    <div id="bill-area">

      {/* ===== HEADER ===== */}
      <div className="bill-header">

        {/* Logo */}
        <img src={logo} alt="Jain Opticals Logo" className="bill-logo" />

        {/* Shop Info */}
        <div className="bill-company">

          <h1>Jain Opticals</h1>

          <div className="tagline">
            (In your service since 1990)
          </div>

          <div className="shop-address">
            Ujjain–Kota Road, New Bus Stand, Agar-Malwa (M.P.)
          </div>

          <div className="shop-phone">
            Contact: 7879742393, 9424827812
          </div>

        </div>

      </div>

      <div className="spacer-lg"></div>
      <hr />
      <div className="spacer-lg"></div>


      {/* ===== DATE ===== */}
      <div className="bill-date-row">
        <b>Date:</b> {new Date(customer.date).toLocaleDateString()}
      </div>
      

      {/* ===== CUSTOMER DETAILS ===== */}
      <div className="bill-details">
        <div><b>Name:</b> {customer.name}</div>
        <div><b>Age:</b> {customer.age}</div>
        <div><b>Address:</b> {customer.address || "Agar Malwa"}</div>
        <div><b>Phone:</b> {customer.phone_no}</div>
      </div>

      <div className="spacer-lg"></div>
      <h3>Prescription Results</h3>
      <TableOutput type="NEW" customer={customer} variant="new" />
    
        <div className="spacer-lg"></div>
      {/* ===== PAYMENT ===== */}
      <div className="bill-payment">
        Bill Amount: ₹ {customer.totalAmount}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="bill-footer">
        <div className="thanks">
         <b>Thank you for shopping with us 🙏</b>
        </div>

        <div className="visit-again">
          <b>Please visit again</b>
        </div>
      </div>

    </div>
  );
};

export default BillTemplate;
