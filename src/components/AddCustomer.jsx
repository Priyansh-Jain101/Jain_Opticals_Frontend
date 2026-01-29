import { useNavigate } from "react-router-dom";
import "../static/AddCustomer.css";
import { useState } from "react";
import TableInput from "./TableInput.jsx";
import { API_URL } from "../config";

//  MUI DATE PICKER
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";


function AddCustomer() {
  const navigate = useNavigate();

  const initialFormData = {
    name: "",
    age: "",
    phone_no: "",
    address: "",
    itemBought: "",
    lensPrice: "",
    framePrice: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    customerService: "In-Progress",
    customerId: "",
    date: "", //  NEW FIELD
    prescriptions: {
      old: {
        right: { sph: "", cyl: "", axis: "", vis: "" },
        left: { sph: "", cyl: "", axis: "", vis: "" },
      },
      ar: {
        right: { sph: "", cyl: "", axis: "", vis: "" },
        left: { sph: "", cyl: "", axis: "", vis: "" },
      },
      new: {
        right: { sph: "", cyl: "", axis: "", vis: "" },
        left: { sph: "", cyl: "", axis: "", vis: "" },
      },
    },
  };

  const [formData, setFormData] = useState(initialFormData);

  //  image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = structuredClone(prev);

      if (name.includes(".")) {
        const keys = name.split(".");
        let temp = updated;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!temp[key]) temp[key] = {};
          temp = temp[key];
        }

        temp[keys[keys.length - 1]] = value;
      } else {
        updated[name] = value;
      }

      if (name === "totalAmount" || name === "paidAmount") {
        const total = Number(updated.totalAmount) || 0;
        const paid = Number(updated.paidAmount) || 0;

        let due = total - paid;
        if (due < 0) due = 0;

        updated.dueAmount = due;
      }

      return updated;
    });
  }

  //  CALENDAR CHANGE HANDLER
  function handleDateChange(newValue) {
    setFormData((prev) => ({
      ...prev,
      date: dayjs(newValue).format("YYYY-MM-DD"),
    }));
  }

  //  MUST BE CONNECTED
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const fd = new FormData();

      //  append all fields
      fd.append("name", formData.name);
      fd.append("age", formData.age);
      fd.append("phone_no", formData.phone_no);
      fd.append("address", formData.address);

      fd.append("itemBought", formData.itemBought);
      fd.append("lensPrice", formData.lensPrice);
      fd.append("framePrice", formData.framePrice);

      fd.append("totalAmount", formData.totalAmount);
      fd.append("paidAmount", formData.paidAmount);
      fd.append("dueAmount", formData.dueAmount);

      fd.append("customerService", formData.customerService);
      fd.append("date", formData.date);   //  ADD THIS LINE

      //  send nested object as JSON string
      fd.append("prescriptions", JSON.stringify(formData.prescriptions));

      //  IMPORTANT: file must be appended with same name as multer key ("image")
      if (imageFile) {
        fd.append("image", imageFile);
      }

      //  VERY IMPORTANT: DO NOT SEND JSON HEADERS
      // const res = await fetch(`${API_URL}/jain_opticals/add_customer`, {
      //   method: "POST",
      //   body: fd,
      // });

      const res = await fetch("http://localhost:8080/jain_opticals/add_customer", {
        method: "POST",
        body: fd,
      });

      const raw = await res.text();
      console.log("RAW RESPONSE:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(raw || "Backend did not return JSON");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add customer");
      }

      alert("Customer added successfully!", data._id);

      const customerId = data.customerId || data.data?._id;
      setFormData(initialFormData);
      setImageFile(null);
      setImagePreview("");

      if (customerId) navigate(`/customer/${customerId}`);
      else navigate("/");
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="add-customer">
      <h1>Enter Customer Details</h1>

      <form onSubmit={handleSubmit}>
        {/* your existing inputs */}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="age">
              Age <span className="required">*</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="phone_no">Phone Number <span className="required">*</span></label>
            <input
              type="number"
              id="phone_no"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <TableInput type="OLD" handleChange={handleChange} varient="old" />
        <TableInput type="AR" handleChange={handleChange} varient="ar" />
        <TableInput type="NEW" handleChange={handleChange} varient="new" />

        {/* Item Bought and Prices */}
          <div className="item-row">
            <div className="form-field">
              <label htmlFor="itemBought">Item Bought</label>
              <select
                name="itemBought"
                id="itemBought"
                value={formData.itemBought}
                onChange={handleChange}
              >
                <option value="">Select Item</option>
                <option value="Lens only">Lens only</option>
                <option value="Frame only">Frame only</option>
                <option value="Lens + Frame">Lens + Frame</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="lensPrice">Lens Price</label>
              <input
                type="number"
                id="lensPrice"
                name="lensPrice"
                value={formData.lensPrice}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="framePrice">Frame Price</label>
              <input
                type="number"
                id="framePrice"
                name="framePrice"
                value={formData.framePrice}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Amount fields */}
          <div className="amount-row">
            <div className="form-field">
              <label htmlFor="totalAmount">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="paidAmount">Amount Paid</label>
              <input
                type="number"
                id="paidAmount"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="dueAmount">Amount Due</label>
              <input
                type="number"
                id="dueAmount"
                name="dueAmount"
                value={formData.dueAmount}
                readOnly
              />
            </div>
          </div>

          {/* Service dropdown */}
          <div className="form-field service-field">
            <label htmlFor="customerService">
              Service <span className="required">*</span>
            </label>
            <select
              name="customerService"
              id="customerService"
              value={formData.customerService}
              onChange={handleChange}
              required
            >
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/*  CALENDAR BELOW SERVICE (LEFT SIDE) */}
          <div className="form-field">
          <label>Order Date</label>
          
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                value={formData.date ? dayjs(formData.date) : null}
                onChange={handleDateChange}
                />
            </LocalizationProvider>
          </div>

        {/*  Upload Image */}
        {/* <div className="form-field">
          <label>Upload Order Image</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="preview" />
            </div>
          )}
        </div> */}

        <button type="submit">Add Customer</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddCustomer;

