import React from "react";
import "./pdf.css";
import merinasoft from "../image/MIniBazar.jpg";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const {
    stockId,
    productCode,
    productName,
    quantity,
    availableQuantity,
    unit,
  } = props;
 

  return (
    <div ref={ref}>
      <div className="invoice">
        {/* Header Section */}
        <div className="headers">
          <img src={merinasoft} alt="Company Logo" className="logo" />
          <div className="company-info">
            <div className="company-name">Irani New Bazar</div>
            <div className="company-address">
            Khilpara Bazar, Chatkhil, Noakhali
            </div>
            <div className="company-address">
              Email: info@merinasoft.com 
            </div>
            <div className="company-address">
            Phone: 01830112972
            </div>
            <div className="company-address">Web: www.merinasoft.com</div>
          </div>
        </div>
        <div className="horizontal-line1" />

        {/* Billing Information Section */}
        <div className="billing-info">
          <div className="invoice-bill">Stock Invoice</div>
          
        </div>

        {/* Body Section - Product Details */}
        <div className="body">
          <div className="table">
            <div className="product-table">
            <div className="div">Stcok Id</div>
              <div className="div">Product Code</div>
              <div className="div">Product Name</div>
              <div className="div">Quantity</div>
              <div className="div">Avilable Quantity</div>
              <div className="div">Unit</div>
           
                  <>
                   <div className="div">{stockId}</div>
                    <div className="div">{productCode}</div>
                    <div className="div">{productName}</div>
                    <div className="div">{quantity}</div>
                    <div className="div">{availableQuantity}</div>
                    <div className="div">{unit}</div>
                   
                  </>
                
            </div>
           
          </div>

          {/* Total */}
         
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

         
        </div>
      </div>
    </div>
  );
});
