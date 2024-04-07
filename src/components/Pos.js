import React, { useState } from "react";
// import Barcode from "react-barcode";
import "./pos.css";
export const PosInvoice = React.forwardRef((props, ref) => {
  const { fixData, netTotal, discount, VAT, paid } = props;
  // eslint-disable-next-line no-unused-vars
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });
  // eslint-disable-next-line no-unused-vars
  const [currentTime, setCurrentTime] = useState(new Date());
  // Update current time every second

  // setCurrentTime(new Date());

  // Cleanup the interval on component unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <>
      console.log(items);
      <div ref={ref} className="pos-pinter">
        <div className="container">
          <div className="receipt_header">
            <h1>
              <span>IRANI MINI BAZAR</span>
            </h1>
            <h2>
              Address: Khilpara Bazar, Chatkhil, Noakhali{" "}
              <span>Phone: +8801830112972</span>
            </h2>
          </div>

          <div className="receipt_body">
            <div
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Invoice/Bill
            </div>
            <div className="date_time_con">
              <div className="date">
                <span>Date : </span>
                {currentDate}
              </div>
              <div className="time">
                <span>Time : </span>
                {currentTime.toLocaleTimeString("en-US", {
                  timeZone: "Asia/Dhaka",
                })}
              </div>
            </div>

            <div className="items">
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                Description
              </span>
              <div className="hrline"></div>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>QTY</th>
                    <th>Item Total</th>
                  </tr>
                </thead>

                <tbody>
                  {fixData &&
                    fixData.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>
                            {item.quantity} {item.unit}
                          </td>
                          <td>{item.itemTotal}</td>
                        </tr>
                      );
                    })}
                </tbody>

                <tfoot>
                  <tr>
                    <td>Vat</td>
                    <td></td>
                    <td>{VAT}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td></td>
                    <td>{discount}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td></td>
                    <td>{netTotal}</td>
                  </tr>

                  <tr>
                    <td>Payment</td>
                    <td></td>
                    <td>{paid}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <h3 className="thank">Thank You, Come Again</h3>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px" }}>Powered By</div>
            <span style={{ fontSize: "12px" }}>
              &copy; MerinaSoft, 173 Arambag, Motijheel
            </span>
          </div>
        </div>
      </div>
    </>
  );
});
