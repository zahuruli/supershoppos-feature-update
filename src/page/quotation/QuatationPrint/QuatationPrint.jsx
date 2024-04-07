import React from "react";
import "./quatationPrint.css";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { cart, data } = props;
  const {
    
    employeeId,
    printByEmployeeName,
    CustomerName,
    customerId,
    customerAddress,
    customerMobile,
    totalAmount,
    quatationNumber,
    date,
    
  } = data;

  const dates = new Date();
  //date:
  let day = dates.getDate();
  let month = dates.getMonth() + 1;
  let year = dates.getFullYear();
  let currentDate = `${day}/${month}/${year}`;
  return (
    <div ref={ref} className="p-5">
      <div className="invoice">
        <div className="invoice_heading">
          <div className="heading_left">
            <h2>
              {" "}
              <span className="green">Irani Mini </span>{" "}
              <span className="blue">Bazar</span>
            </h2>
            <h5>Simply better shopping</h5>
          </div>
          <div className="heading_right">
            <div className="property">
              {/* <h1>{shopName}</h1> */}
              <h4>Noakhali Outlet</h4>
              <h5>Khilpara Bazar, Chatkhil, Noakhali </h5>
              <h5>01830112972</h5>
            </div>
          </div>
        </div>
        <hr className="heading_hr" />

        <div className="invoice_body">
          <h2 className="Quotation_text">Quotation</h2>
          <div className="customer">
            <div className="customer_left">
              <h4>To</h4>
              <h4>Name: {CustomerName}</h4>
              <h4>Customer ID: {customerId}</h4>
              <h4>Mobile No: {customerMobile}</h4>
              <h4>{customerAddress}</h4>
            </div>
            <div className="customer_right">
              <h4>Quotation No:{quatationNumber}</h4>
              <h4>Date: {date ? date : currentDate}</h4>
              <h4>Sale By: {printByEmployeeName}</h4>
              <h4>Employer Id: {employeeId}</h4>
            </div>
          </div>
          <div className="quatationTablediv">
            <table>
              <thead>
                <tr>
                  <th className="prheaderTh">SL</th>
                  <th className="prheaderTh">Product Name</th>
                  <th className="prheaderTh">Sale Price</th>
                  <th className="prheaderTh">Quantity</th>
                  <th className="prheaderTh">Item Total</th>
                </tr>
              </thead>
              <tbody className="cartContent">
                {cart &&
                  cart.length > 0 &&
                  cart.map((c, index) => {
                    return (
                      <tr key={cart.idCode}>
                        <td className="prtableTd">{index}</td>
                        <td className="prtableTd">{c.productName}</td>
                        <td className="prtableTd">{c.salePrice}</td>
                        <td className="prtableTd">{c.saleQuantity}</td>
                        <td className="prtableTd">{c.ItemTotalPrice} Taka</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="totalAmountDiv">
          {" "}
          <h4 className="tAmount bm-3">Total Amount : ${totalAmount}</h4>
        </div>
        <div className="invoice_footer">
          <div className="authorize">
            <div className="authorize_left">
              <hr className="authorize_hr" />
              <h5>Authorize Signature & Company Stamp</h5>
            </div>
            <div className="authorize_right">
              <hr className="authorize_hr" />
              <h5>Receive with good condition by</h5>
            </div>
          </div>
          <div className="condition">
            <h4>
              1.Warrenty will be void if Stricker removed, Physically Damage &
              Burn case
            </h4>
            <h4>2.Vat & Tax not Includede</h4>
            <p className="thank_text">Thank You</p>
          </div>
        </div>
      </div>
    </div>
  );
});
