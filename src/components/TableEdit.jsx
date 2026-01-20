// import "./TableInput.css"; // optional (only if you have styling)

function TableInput({ type, handleChange, varient, formData}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>{type}</th>
            <th>Sph</th>
            <th>Cyl</th>
            <th>Axis</th>
            <th>Add</th>
          </tr>
        </thead>

        <tbody>
          {/* Right Eye */}
          <tr>
            <td>Right</td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.right.sph`}
                name={`prescriptions.${varient}.right.sph`}
                value={formData.prescriptions[varient].right.sph || ""}
                onChange={handleChange}
              />
            </td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.right.cyl`}
                name={`prescriptions.${varient}.right.cyl`}
                value={formData.prescriptions[varient].right.cyl || ""}
                onChange={handleChange}
              />
            </td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.right.axis`}
                name={`prescriptions.${varient}.right.axis`}
                value={formData.prescriptions[varient].right.axis || ""}
                onChange={handleChange}
              />
            </td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.right.add`}
                name={`prescriptions.${varient}.right.add`}
                value={formData.prescriptions[varient].right.add || ""}
                onChange={handleChange}
              />
            </td>
          </tr>

          {/* Left Eye */}
          <tr>
            <td>Left</td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.left.sph`}
                name={`prescriptions.${varient}.left.sph`}
                value={formData.prescriptions[varient].left.sph || ""}
                onChange={handleChange}
              />
            </td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.left.cyl`}
                name={`prescriptions.${varient}.left.cyl`}
                value={formData.prescriptions[varient].left.cyl || ""}
                onChange={handleChange}
              />
            </td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.left.axis`}
                name={`prescriptions.${varient}.left.axis`}
                value={formData.prescriptions[varient].left.axis || ""}
                onChange={handleChange}
              />
            </td>

            <td>
              <input
                type="text"
                id={`prescriptions.${varient}.left.add`}
                name={`prescriptions.${varient}.left.add`}
                value={formData.prescriptions[varient].left.add || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableInput;
