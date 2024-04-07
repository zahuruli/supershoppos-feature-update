import React from "react";
import Barcode from "react-barcode";
import "./barcode.css";

const ComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <>
      <div ref={ref} className="barcode">
        <Barcode value={props.code} width={1.3} fontSize={10} />
      </div>
    </>
  );
});
export default ComponentToPrint;
