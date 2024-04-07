import React from "react";
import "./pdf.css";
import merinasoft from "../image/MIniBazar.jpg";
import { convertNumberToWords } from "./ConvertNumberToWord";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const {
    supplier,
    address,
    mobile,
    employee_name,
    date,
    total,
    due,
    paid,
    invoice,
    rows,
    vat,
  } = props;
  const words = convertNumberToWords(total);

  return (
    <div ref={ref}>
      <div className="invoice">
        {/* Header Section */}
        <div className="headers">
          <img src={merinasoft} alt="Company Logo" className="logo" />
          <div className="company-info">
            <div className="company-name">Irani Mini Bazar</div>
            <div className="company-address">
              Khilpara Bazar, Chatkhil, Noakhali
            </div>
            <div className="company-address">
              Email:iraniminibazar584@gmail.com 
            </div>
            <div className="company-address">
              Phone : 018988748 
            </div>
            <div className="company-address">Web: www.iraninewbazar.com</div>
          </div>
        </div>
        <div className="horizontal-line1" />

        {/* Billing Information Section */}
        <div className="billing-info">
          <div className="invoice-bill">Invoice/Bill</div>
          <div className="Supplier-invoice">
            <div className="supplier-info">
              <h5>Supplier Name: <span>{supplier}</span></h5>
              <h5>Address: <span>{address}</span></h5>
              <h5>Mobile: <span>{mobile}</span></h5>
            </div>
            <div className="supplier-invoice-details">
              <h5>Invoice Number: {invoice}</h5>
              <h5>Date: {date}</h5>
              <h5>Purchase By: {employee_name}</h5>
            </div>
          </div>
        </div>

        {/* Body Section - Product Details */}
        <div className="body">
          <div className="table">
            <div className="Purchase-table">
              <div className="div">Description</div>
              <div className="div">Quantity</div>
              <div className="div">Purchase Price</div>
              <div className="div">Discount</div>
              <div className="div">Item Total</div>

              <>
                
                {rows &&
                  rows.map((data, index) => (
                    <>
                      <div className="div" key={index}>
                        {data.product_code}-{data.product_name}
                      </div>
                      <div className="div">{data.quantity} {data.unit}</div>
                      <div className="div">{data.purchase_price}</div>
                      <div className="div">{data.discount}</div>
                      <div className="div">{data.total}</div>
                    </>
                  ))}
              </>
            </div>
            <div className="table2">
              <div className="div">Vat</div>
              <div className="div1">{vat}</div>

              <div className="div">Net Total</div>
              <div className="div1">{total}</div>
            </div>
          </div>

          {/* Total */}
          <div className="total">
            <div>Comment/Service :</div>
            <div className="word">Net Total(In Words) : {words} Taka</div>

            <div className="total_row">
              <div className="div">Paid</div>
              <div className="div">{paid}</div>
              <div className="div">Due</div>
              <div className="div">{due}</div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="footer">
          <div className="ceo-signature">
            <div>
              <div className="horizontal-line" />
              Authorize Signature
            </div>

            <div>
              <div className="horizontal-line" />
              Received With Good Condition By
            </div>
          </div>

          <div className="last_part">
            <div>1. VAT & Tax included</div>
          </div>
        </div>
      </div>
    </div>
  );
});
