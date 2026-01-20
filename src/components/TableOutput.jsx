function TableOutput({ type, customer, variant }) {
  // variant = "old" | "new" | "ar"
  const data = customer?.prescriptions?.[variant];

  return (
    <div className="ic-section">
      <div className="ic-table-wrapper">
        <table className="ic-table">
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
            <tr>
              <td>Right</td>
              <td>{data?.right?.sph || ""}</td>
              <td>{data?.right?.cyl || ""}</td>
              <td>{data?.right?.axis || ""}</td>
              <td>{data?.right?.add || ""}</td>
            </tr>

            <tr>
              <td>Left</td>
              <td>{data?.left?.sph || ""}</td>
              <td>{data?.left?.cyl || ""}</td>
              <td>{data?.left?.axis || ""}</td>
              <td>{data?.left?.add || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableOutput;
