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
            (In your service since 1995)
          </div>

          <div className="shop-address">
            Ujjain–Kota Road, New Bus Stand, Agar-Malwa (M.P.)
          </div>

          <div className="shop-phone">
            Contact: 7879742393, 9424827812
          </div>

        </div>

      </div>

      {/* <div className="spacer-lg"></div> */}
      <hr />
      {/* <div className="spacer-lg"></div> */}

      <h3>CUSTOMER INFORMATION</h3>
      {/* ===== DATE ===== */}
      <div className="bill-date-row">
        <b>Date:</b> {new Date(customer.date).toLocaleDateString("en-US")}
      </div>
      

      {/* ===== CUSTOMER DETAILS ===== */}
      <div className="bill-details">
        <div><b>NAME:</b> {customer.name.toUpperCase()}</div>
        <div><b>AGE:</b> {customer.age}</div>
        <div><b>ADDRESS:</b> {customer.address.toUpperCase() || "Agar Malwa"}</div>
        <div><b>PHONE:</b> {customer.phone_no}</div>
      </div>

      {/* <div className="spacer-lg"></div> */}
      <hr />
      <h3>TEST RESULT</h3>
      <TableOutput type="NEW" customer={customer} variant="new" />
    
      <div className="spacer-lg"></div>
      <hr />
      {/* ===== PAYMENT ===== */}
      <h3>PAYMENT INFORMATION </h3>
      <div className="bill-payment">
        NET PAYABLE: ₹ {customer.totalAmount}
      </div>
      {/* <hr /> */}

      {/* ===== FOOTER ===== */}
      <div className="bill-footer">
        <div className="thanks">
         <b>Thank you for shopping with us!</b>
        </div>

        <div className="visit-again">
          <b>Please visit again!</b>
        </div>

        <br />
        <div style={{fontSize: "20px", textAlign: "center"}}>
          🙏
        </div>
      </div>

    </div>
  );
};

export default BillTemplate;
