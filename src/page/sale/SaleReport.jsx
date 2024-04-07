/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./salereport.css";
import ExcelExport from "../../components/ExportExcel";
import { MdPreview } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { RxUpdate } from "react-icons/rx";
import { BiReset } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { SaleReportPos } from "../../components/SaleReportPos";

const SaleReport = () => {
  const [filteredRows, setFilteredRows] = useState([]);
  const [productName, setProductName] = useState([]);
  const [DateFrom, setDateFrom] = useState([]);
  const [DateTo, setDateTo] = useState([]);
  const [type, setType] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [warranty, setWarranty] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [total, setTotal] = useState("");
  const [product, setProduct] = useState("");
  const [ptype, setPtype] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [onlyDate, setOnlyDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [code, setCode] = useState("");
  const [shopName, setShopName] = useState("");
  const [distinctProductCode, setDistinctProductCode] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const [Amount, setAmount] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const toastId = React.useRef(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    document.title = "Product Sale Report";
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredRows = datas_getAllTranscatioData.filter(
          (item) => item.OperationType?.operation_name === "Sale"
        );
        setTimeout(() => {
          setRows(filteredRows);
          setFixData([...new Set(filteredRows)]);
          console.log("Filter Data: ", filteredRows);
          console.log(datas_getAllTranscatioData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setButtonVisible(false);
    setSelectedInvoice("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickShowAll = () => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredRows = datas_getAllTranscatioData.filter(
          (item) => item.OperationType?.operation_name === "Sale"
        );
        setTimeout(() => {
          setRows(filteredRows);
          setFixData([...new Set(filteredRows)]);
          console.log(datas_getAllTranscatioData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setSelectedID(null);
    setButtonVisible(false);
    setSelectedInvoice("");
  };

  // Filter Product
  // http://194.233.87.22:5003/api/producttraces/getAll

  const ProductCode = () => {
    const fetchData = async () => {
      try {
        const response_getAllPrductCode = await axiosInstance.get(
          "/producttraces/getAll"
        );

        const datas_getAllPrductCode = response_getAllPrductCode.data;

        setDistinctProductCode([...new Set(datas_getAllPrductCode)]);
        console.log(datas_getAllPrductCode);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
  };

  const FetchAllInvoice = () => {
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const allInvoices = datas_getAllTranscatioData.map((item) => {
          return item.invoice_no;
        });

        setInvoice([...new Set(allInvoices)]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  };

  useEffect(() => {
    ProductCode();
    FetchAllInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //code search
  const handleFilterDataCode = () => {
    if (!filteredRows || typeof filteredRows !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("BarCode Is Required");
      }
      return;
    }

    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.product_code
            .toLowerCase()
            .includes(filteredRows.toLowerCase())
        : ""
    );

    if (filterData.length === 0) {
      toast.error("Input data not valid");
      // handleClickShowAll();
    }

    setRows(filterData);
  };

  // type search
  const handleFilterType = () => {
    if (!type || typeof type !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Type Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.type.toLowerCase().includes(type.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // product search
  const handleFilterProduct = () => {
    if (!productName || typeof productName !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Product Name Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) =>
      item.ProductTrace
        ? item.ProductTrace.name
            .toLowerCase()
            .includes(productName.toLowerCase())
        : ""
    );
    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
  };

  // invoice search
  const handleFilterInvoice = () => {
    if (!selectedInvoice || typeof selectedInvoice !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Invoice Serial Is Required");
      }
      return;
    }

    const filterData = fixData
      .filter(
        (row) =>
          row.invoice_no
            .toLowerCase()
            .includes(selectedInvoice.toLowerCase()) &&
          row.OperationType.operation_name.includes("Sale")
      )
      .map((filteredRow) => {
        return filteredRow;
      });

    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(filterData);
    setButtonVisible(true);
  };

  // data search

  const handelShowSaleData = () => {
    handleClickShowAll();
    setProductName("");
    setDateFrom("");
    setDateTo("");
    setType("");
    setFilteredRows("");
  };

  const handleFilterDate = () => {
    if (
      !DateFrom ||
      !DateTo ||
      typeof DateFrom !== "string" ||
      typeof DateTo !== "string"
    ) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Both Date Fields Are Required");
      }
      return;
    }
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0];
        return (
          itemDate >= DateFrom.split("T")[0] && itemDate <= DateTo.split("T")[0]
        );
      }
      return false;
    });

    setRows(filterData);
  };

  const handleFilterOnlyDate = () => {
    if (!onlyDate) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Date Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(onlyDate.toLowerCase());
      }
      return false;
    });

    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Data not Found");
    }

    setRows(filterData);
    setOnlyDate("");
  };

  // Updated Product Sale
  // http://194.233.87.22:5004/api/transactionsRouter/updateTransactionFromAnyPageByID?quantity_no=&sale_price=&transaction_id=&amount=
  const updateSaleReport = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (!salePrice && !quantity && !selectedID) {
      toast.warning("Please Selected A Row.");
      return;
    }

    const amount = parseFloat(salePrice) * parseFloat(quantity);
    try {
      const response = await axiosInstance.put(
        `/transactionsRouter/updateTransactionFromAnyPageByID?quantity_no=${quantity}&sale_price=${salePrice}&transaction_id=${selectedID}&amount=${amount}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Successfully Product Sale Updateded.");
        selectedID("");
        handleClickShowAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setSelectedID(null);
    setCode("");
    setProduct("");
    setPtype("");
    setUnit("");
    setQuantity("");
    // setTotal(parseFloat(item.sale_price) * parseFloat(item.quantity_no));
    setTotal("");
    setWarranty("");
    setDate("");
    setSalePrice("");
    setShopName("");
    setProductName("");
    setDateFrom("");
    setDateTo("");
    setType("");
    setFilteredRows("");
  };

  const hendleDataInputField = (item) => {
    setSelectedID(item.transaction_id);
    setCode(item.ProductTrace ? item.ProductTrace.product_code : "");
    setProduct(item.ProductTrace ? item.ProductTrace.name : "");
    setPtype(item.ProductTrace ? item.ProductTrace.type : "");
    setUnit(item.Unit ? item.Unit.unit : "");
    setQuantity(item.quantity_no);
    // setTotal(parseFloat(item.sale_price) * parseFloat(item.quantity_no));
    setTotal(
      (
        (parseFloat(
          item.sale_price !== undefined &&
            item.sale_price !== null &&
            item.sale_price !== ""
        )
          ? 1
          : item.sale_price) *
        (parseFloat(
          item.quantity_no !== undefined &&
            item.quantity_no !== null &&
            item.quantity_no !== ""
        )
          ? 1
          : item.quantity_no)
      ).toFixed(2)
    );
    setAmount(item.amount);
    setWarranty(item.warranty);
    setDate(item.date ? item.date.split("T")[0] : "");
    setSalePrice(item.sale_price);
    setShopName(item.ShopName ? item.ShopName.shop_name : "");
  };

  console.log("transcation id", selectedID);

  const totalAmount =
    rows && rows.length > 0
      ? rows
          .reduce((total, item) => {
            const amount = parseFloat(item.sale_price) || 0;
            const qunatity = parseFloat(item.quantity_no) || 0;
            const itemTotal = amount * qunatity;
            total += itemTotal;
            return total;
          }, 0)
          .toFixed(2)
      : 0;

  // const dateAquire = rows && rows.length > 0;
  const dateAquire =
    rows && rows.length > 0 ? rows[0].date.split("T")[0] : null;

  const VAT =
    rows && rows.length > 0 ? (rows[0].vat !== undefined ? rows[0].vat : 0) : 0;
  const discount =
    rows && rows.length > 0
      ? rows[0].vat !== undefined
        ? rows[0].discount
        : 0
      : 0;
  //========= deleteTransection================
  const deleteTransection = async () => {
    try {
      if (!selectedID) {
        //toast message:
        toast.error("Please Selected A Row !");
      } else {
        const response = await axiosInstance.delete(
          `/transactionsRouter/deleteTransactionByID?transaction_id=${selectedID}`
        );

        if (response.status === 200) {
          handleClickShowAll();
          handleReset();
          toast.success("Successfully deleted transection.");
        } else {
          console.log(`Error while deleting transection`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="full_div_supershop_sale_report">
      <ToastContainer stacked autoClose={500} />
      <div className="first_row_div_supershop_sale_report">
        <div className="container_supershop_sale_report">
          <div className="container_supershop_sale_report_column1">
            <div>
              <div className="input_field_supershop_sale_report">
                <label>From Date</label>
                <input
                  type="date"
                  onChange={(e) => setDateFrom(e.target.value)}
                  value={DateFrom}
                />
              </div>

              <div className="input_field_supershop_sale_report">
                <label>To Date</label>
                <input
                  type="date"
                  onChange={(e) => setDateTo(e.target.value)}
                  value={DateTo}
                />
              </div>
            </div>
            <div className="input_field_supershop_sale_report">
              <button onClick={handleFilterDate}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column2">
            <div className="input_field_supershop_sale_report">
              <label>Porduct</label>
              <input
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                list="product"
              />
              <datalist id="product">
                {distinctProductCode.length > 0 &&
                  distinctProductCode.map((items, index) => {
                    return <option key={index}>{items.name}</option>;
                  })}
              </datalist>
              <button onClick={handleFilterProduct}>Search</button>
            </div>
            <div className="input_field_supershop_sale_report">
              <label>Type</label>
              <input
                onChange={(e) => setType(e.target.value)}
                value={type}
                list="type"
              />
              <datalist id="type">
                {distinctProductCode.length > 0 &&
                  distinctProductCode.map((items, index) => {
                    return <option key={index}>{items.type}</option>;
                  })}
              </datalist>
              <button onClick={handleFilterType}>Search</button>
            </div>
            <div className="input_field_supershop_sale_report">
              <label>Invoice</label>
              <input
                onChange={(e) => setSelectedInvoice(e.target.value)}
                value={selectedInvoice}
                list="invoice"
              />
              <datalist id="invoice">
                {invoice.length > 0 &&
                  invoice.map((items, index) => {
                    return <option key={index}>{items}</option>;
                  })}
              </datalist>
              <button onClick={handleFilterInvoice}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column3">
            <div className="input_field_supershop_sale_report">
              <label>Date</label>
              <input
                type="date"
                onChange={(e) => setOnlyDate(e.target.value)}
                value={onlyDate}
              />
              <button onClick={handleFilterOnlyDate}>Search</button>
            </div>
            <div className="input_field_supershop_sale_report">
              <label>BarCode</label>
              <input
                value={filteredRows}
                onChange={(event) => setFilteredRows(event.target.value)}
                list="barcode"
              />
              <datalist id="barcode">
                {distinctProductCode.length > 0 &&
                  distinctProductCode.map((items, index) => {
                    return <option key={index}>{items.product_code}</option>;
                  })}
              </datalist>

              <button onClick={handleFilterDataCode}>Search</button>
            </div>
          </div>
          <div className="container_supershop_sale_report_column4">
            <div className="container_sheet_button_sale_report">
              <button onClick={handelShowSaleData}>
                <MdPreview />
              </button>
              <span>Show All</span>
            </div>
            <div>
              <ExcelExport />
            </div>
          </div>
        </div>
      </div>
      <div className="second_row_div_supershop_sale_report">
        {isLoading ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        ) : (
          <div className="container_table_supershop_sale_report">
            <table>
              <tr>
                <th>BarCode</th>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Warranty</th>
                <th>Sale Price</th>
                <th>Quantity</th>
                <th>Item Total</th>
                <th>Sale Date</th>
                <th>Unit</th>
                <th>Shop Name</th>
              </tr>
              <tbody>
                {rows.length > 0 &&
                  rows.map((item) => (
                    <tr
                      key={item.transaction_id}
                      onClick={() => hendleDataInputField(item)}
                      className={
                        selectedID === item.transaction_id
                          ? "rows selected"
                          : "rows"
                      }
                      tabindex="0"
                    >
                      <td>
                        {item.ProductTrace
                          ? item.ProductTrace.product_code
                          : ""}
                      </td>
                      <td>{item.ProductTrace ? item.ProductTrace.name : ""}</td>
                      <td>{item.ProductTrace ? item.ProductTrace.type : ""}</td>
                      <td>{item.warranty}</td>
                      <td>{item.sale_price}</td>
                      <td>{item.quantity_no}</td>
                      <td>
                        {(
                          (parseFloat(
                            item.sale_price !== undefined &&
                              item.sale_price !== null &&
                              item.sale_price !== ""
                          )
                            ? 1
                            : item.sale_price) *
                          (parseFloat(
                            item.quantity_no !== undefined &&
                              item.quantity_no !== null &&
                              item.quantity_no !== ""
                          )
                            ? 1
                            : item.quantity_no)
                        ).toFixed(1)}
                      </td>
                      <td className="hover-effect">
                        {item.date ? item.date.split("T")[0] : ""}
                      </td>
                      <td className="hover-effect">
                        {item.Unit ? item.Unit.unit : ""}
                      </td>
                      <td className="hover-effect">
                        {item.ShopName ? item.ShopName.shop_name : ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="third_row_div_supershop_sale_report">
        <div className="conatiner_update_supershop_sale_report_column1">
          <div className="input_field_supershop_sale_report">
            <label>BarCode</label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Product Name</label>
            <input
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Product Type</label>
            <input
              value={ptype}
              onChange={(event) => setPtype(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Sale Price</label>
            <input
              type="number"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column2">
          <div className="input_field_supershop_sale_report">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Item Total</label>
            <input
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Unit</label>
            <input
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column3">
          <div className="input_field_supershop_sale_report">
            <label>Sale Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Warranty</label>
            <input
              value={warranty}
              onChange={(event) => setWarranty(event.target.value)}
            />
          </div>
          <div className="input_field_supershop_sale_report">
            <label>Shop Name</label>
            <input
              value={shopName}
              onChange={(event) => setShopName(event.target.value)}
            />
          </div>
        </div>
        <div className="conatiner_update_supershop_sale_report_column4">
          <div className="container_sheet_button_sale_report">
            <button onClick={handleReset}>
              <BiReset />
            </button>
            <span>Reset</span>
          </div>
          {buttonVisible && (
            <div>
              <div style={{ display: "none" }}>
                <SaleReportPos
                  ref={componentRef}
                  discount={discount}
                  VAT={VAT}
                  dateAquire={dateAquire}
                  rows={rows}
                  totalAmount={totalAmount}
                  // paid={paid}
                />
              </div>
              <div className="container_sheet_button_sale_report">
                <button onClick={handlePrint}>
                  <MdLocalPrintshop />
                </button>
                <span>Invoice</span>
              </div>
            </div>
          )}
          {/* <div className="container_sheet_button_sale_report">
            <button onClick={deleteTransection}>
              <MdDelete className="red" />
            </button>
            <span>Delete</span>
          </div> */}
        </div>

        <div className="conatiner_update_supershop_sale_report_column5">
          <div className="input_field_supershop_sale_report">
            <label style={{ justifyContent: "center" }}>Total Sale</label>
            <input
              style={{
                width: "11vw",
                marginRight: "1vw",
                fontSize: "1vw",
                textAlign: "center",
                fontWeight: "bold",
              }}
              value={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReport;
