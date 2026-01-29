import { useNavigate, useParams } from "react-router-dom";
import "../static/AddCustomer.css";
import { useEffect, useState } from "react";
import TableEdit from "./TableEdit.jsx";
import { API_URL } from "../config";

//  MUI DATE PICKER
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

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

  //  existing image url from DB
  const [existingImageUrl, setExistingImageUrl] = useState("");

  //  new uploaded image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line
  }, []);

  async function fetchCustomer() {
    try {
      // Production: use API_URL
      // const res = await fetch(
      //   `${API_URL}/jain_opticals/customer/${id}`
      // );

      const res = await fetch(
        `http://localhost:8080/jain_opticals/customer/${id}`
      );

      if (!res.ok) throw new Error("Failed to fetch customer data");

      const data = await res.json();
      const customer = data.data;

      setFormData({
        name: customer.name || "",
        age: customer.age || "",
        phone_no: customer.phone_no || "",
        address: customer.address || "",
        itemBought: customer.itemBought || "",
        lensPrice: customer.lensPrice || "",
        framePrice: customer.framePrice || "",
        totalAmount: customer.totalAmount || "",
        paidAmount: customer.paidAmount || "",
        dueAmount: customer.dueAmount || "",
        customerService: customer.customerService || "In-Progress",
        customerId: customer.customerId || "",

        //  LOAD DATE
        date: customer?.date
          ? dayjs(customer.date).format("YYYY-MM-DD")
          : "",

        prescriptions: {
          old: {
            right: {
              sph: customer?.prescriptions?.old?.right?.sph || "",
              cyl: customer?.prescriptions?.old?.right?.cyl || "",
              axis: customer?.prescriptions?.old?.right?.axis || "",
              add: customer?.prescriptions?.old?.right?.add || "",
            },
            left: {
              sph: customer?.prescriptions?.old?.left?.sph || "",
              cyl: customer?.prescriptions?.old?.left?.cyl || "",
              axis: customer?.prescriptions?.old?.left?.axis || "",
              add: customer?.prescriptions?.old?.left?.add || "",
            },
          },

          ar: {
            right: {
              sph: customer?.prescriptions?.ar?.right?.sph || "",
              cyl: customer?.prescriptions?.ar?.right?.cyl || "",
              axis: customer?.prescriptions?.ar?.right?.axis || "",
              add: customer?.prescriptions?.ar?.right?.add || "",
            },
            left: {
              sph: customer?.prescriptions?.ar?.left?.sph || "",
              cyl: customer?.prescriptions?.ar?.left?.cyl || "",
              axis: customer?.prescriptions?.ar?.left?.axis || "",
              add: customer?.prescriptions?.ar?.left?.add || "",
            },
          },

          new: {
            right: {
              sph: customer?.prescriptions?.new?.right?.sph || "",
              cyl: customer?.prescriptions?.new?.right?.cyl || "",
              axis: customer?.prescriptions?.new?.right?.axis || "",
              add: customer?.prescriptions?.new?.right?.add || "",
            },
            left: {
              sph: customer?.prescriptions?.new?.left?.sph || "",
              cyl: customer?.prescriptions?.new?.left?.cyl || "",
              axis: customer?.prescriptions?.new?.left?.axis || "",
              add: customer?.prescriptions?.new?.left?.add || "",
            },
          },
        },
      });

      //  existing image
      setExistingImageUrl(customer?.image?.url || "");

      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("Error fetching customer data");
      setLoading(false);
    }
  }

  //  CALENDAR CHANGE HANDLER
  function handleDateChange(newValue) {
    setFormData((prev) => ({
      ...prev,
      date: dayjs(newValue).format("YYYY-MM-DD"),
    }));
  }

  //  handle image selection
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

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

      // Auto-calc due
      if (name === "totalAmount" || name === "paidAmount") {
        const total = Number(updated.totalAmount) || 0;
        const paid = Number(updated.paidAmount) || 0;
        let due = total - paid;
        if (due < 0) due = 0;
        updated.dueAmount = due;
      }

      // if completed
      if (name === "customerService" && value === "Completed") {
        updated.paidAmount = updated.totalAmount;
        updated.dueAmount = 0;
      }

      return updated;
    });
  }

  //  submit with FormData (image + fields)
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const fd = new FormData();

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

      fd.append("prescriptions", JSON.stringify(formData.prescriptions));

      //  new image if selected
      if (imageFile) {
        fd.append("image", imageFile);
      }

      // Production: use API_URL
      // const res = await fetch(
      //   `${API_URL}/jain_opticals/customer/${id}`,
      //   {
      //     method: "PUT",
      //     body: fd, //  no headers
      //   }
      // );

      const res = await fetch(
        `http://localhost:8080/jain_opticals/customer/${id}`,
        {
          method: "PUT",
          body: fd, //  no headers
        }
      );

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        console.log("RAW RESPONSE:", raw);
        throw new Error("Backend did not return JSON");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update customer");
      }

      alert("Customer updated successfully!");
      navigate(`/customer/${id}`);
    } catch (err) {
      console.log(err);
      alert(`Error while updating customer: ${err.message}`);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  if (loading) {
    return (
      <div className="add-customer">
        <h1>Loading customer data...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="add-customer">
        <button className="ic-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button className="ic-back-btn" onClick={() => navigate("/")}>
          ← Home
        </button>

        <h1>Edit Customer Details</h1>

        <form onSubmit={handleSubmit}>
          {/* Name and Age */}
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

          {/* Phone + Address */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="phone_no">Phone Number</label>
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

          {/* Tables */}
          <TableEdit
            type="OLD"
            handleChange={handleChange}
            varient="old"
            formData={formData}
          />
          <TableEdit
            type="AR"
            handleChange={handleChange}
            varient="ar"
            formData={formData}
          />
          <TableEdit
            type="NEW"
            handleChange={handleChange}
            varient="new"
            formData={formData}
          />

          {/* Item Bought & Prices */}
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
                onChange={handleChange}
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

          {/*  IMAGE SHOW + UPLOAD */}
          {/* <div className="form-field">
            <label>
              Order Image{" "}
              <span style={{ fontWeight: "500", color: "#6b7280" }}>
                (Upload to replace)
              </span>
            </label> */}

            {/* Existing Image */}
            {/* {existingImageUrl && !imagePreview && (
              <div className="image-preview">
                <img src={existingImageUrl} alt="customer" />
              </div>
            )} */}

            {/* New preview */}
            {/* {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="new preview" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />
          </div> */}

          <button type="submit">Update Customer</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

export default EditCustomer;
