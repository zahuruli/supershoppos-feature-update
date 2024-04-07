import React from "react";
import "./stock-operation.css";
import { useState, useEffect, useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import Excel from "../../image/excel.webp";
import invoiceimg from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/GenaratePdf";

const StockOperation = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [allProduct, setAllProduct] = useState([]);
  const [prodcutType, setProductType] = useState([]);
  const [rows, setRows] = useState([]);
  const [stockId, setStockId] = useState([]);
  const [productIdCode, setProductIdCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState([]);
  const [SaleQuantity, setSaleQuantity] = useState([]);
  const [TotalQuantity, setTotalQuanityt] = useState([]);
  const [minQuantity, setMinQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [FilteredData, setFilteredData] = useState([]);
  const [unit, setUnit] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/transactionsRouter/getAllTransactions"
      );

      const filteredTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Purchase"
      );

      const filterSaleTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Sale"
      );

      // Set the updated rows with available quantity
      setRows(filteredTransactions);
      setSaleQuantity(filterSaleTransactions);
      handleReset();
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setFilteredData([]);
  };

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/producttraces/getAll");

      if (response.data) {
        setAllProduct(response.data);

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = "Stoc Report";
    fetchData();
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /// sale qunatity
  const aggregatedSaleQuantity = Array.from(
    SaleQuantity.reduce((map, item) => {
      const productCode = item.ProductTrace?.product_code;
      const quantity = parseInt(item.quantity_no, 10); // Convert quantity to number
      if (!isNaN(quantity)) {
        // Check if quantity is a valid number
        if (map.has(productCode)) {
          map.set(productCode, map.get(productCode) + quantity); // Add quantity to existing total
        } else {
          map.set(productCode, quantity); // Set initial quantity for product code
        }
      }
      return map;
    }, new Map()).entries()
  ).map(([productCode, quantity]) => ({ productCode, quantity }));

  //// pucrhase quantity
  const aggregatedRows = rows.reduce((result, item) => {
    const existingItemIndex = result.findIndex(
      (r) => r.ProductTrace?.product_code === item.ProductTrace?.product_code
    );

    if (existingItemIndex !== -1) {
      const existingItem = result[existingItemIndex];
      existingItem.quantity_no =
        parseInt(existingItem.quantity_no, 10) + parseInt(item.quantity_no, 10);
    } else {
      result.push({ ...item });
    }

    return result;
  }, []);

  const FilteredaggregatedRows = FilteredData.reduce((result, item) => {
    const existingItemIndex = result.findIndex(
      (r) => r.ProductTrace?.product_code === item.ProductTrace?.product_code
    );

    if (existingItemIndex !== -1) {
      const existingItem = result[existingItemIndex];
      existingItem.quantity_no =
        parseInt(existingItem.quantity_no, 10) + parseInt(item.quantity_no, 10);
    } else {
      result.push({ ...item });
    }

    return result;
  }, []);
  // serach
  const handleSearchProductName = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (selectedProduct === "") {
      toast.dismiss();
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = aggregatedRows.filter((item) =>
      item.ProductTrace?.name
        .toLowerCase()
        .includes(selectedProduct.toLowerCase())
    );

    if (results.length === 0) {
      setFilteredData([]);
      toast.dismiss();
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
      console.log(results);
    }
  };

  const handleSearchproductcode = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (selectedProductCode === "") {
      toast.dismiss();
      toast.warning("Plaese filup serach Input");
      return;
    }
    const results = aggregatedRows.filter((item) =>
      item.ProductTrace?.product_code.includes(selectedProductCode)
    );
    if (results.length === 0) {
      setFilteredData([]);
      toast.dismiss();
      toast.warning("Not Matching any data");
    } else {
      setFilteredData(results);
    }
  };
  // select row
  const handlerow = (item, index, availableQuantity) => {
    setActiveRowIndex(index);
    setStockId(index + 1);
    setQuantity(item.quantity_no);
    setProductIdCode(item.ProductTrace?.product_code);
    setProductName(item.ProductTrace?.name);
    setProductType(item.ProductTrace?.type);
    setMinQuantity(
      availableQuantity
        ? item.quantity_no - availableQuantity.quantity
        : item.quantity_no
    );
    setUnit(item.Unit?.unit);
    setWarranty(item.warranty);
  };
  //reset all field
  const handleReset = () => {
    setSelectedProduct("");
    setSelectedProductCode("");
    setStockId("");
    setQuantity("");
    setProductIdCode("");
    setProductName("");
    setProductType("");
    setMinQuantity("");
    setUnit("");
    setWarranty("");
    setActiveRowIndex(null);
  };

  useEffect(() => {
    if (rows.length > 0) {
      const total = rows.reduce(
        (accumulator, item) => accumulator + parseInt(item.quantity_no),
        0
      );
      setTotalQuanityt(parseInt(total, 10));
    } else {
      setTotalQuanityt(0);
    }
  }, [rows]);

  // get total avilablequantity
  const totalAvailableQuantity = aggregatedRows.reduce((sum, item) => {
    // Find the corresponding sale quantity in the aggregatedSaleQuantity array
    const saleQuantity = aggregatedSaleQuantity.find(
      (qty) => qty.productCode === item.ProductTrace?.product_code
    );

    // Calculate the available quantity if a matching sale quantity is found
    const availableQuantity = saleQuantity
      ? item.quantity_no - saleQuantity.quantity
      : item.quantity_no;

    // Parse available quantity as a number to ensure proper addition
    const validQuantity = parseInt(availableQuantity, 10);

    // Add the available quantity to the sum if it's positive
    return sum + (validQuantity > 0 ? validQuantity : 0);
  }, 0);

  //format data for excell
  const formattedStock = aggregatedRows.map((item, index) => {
    const availableQuantity = aggregatedSaleQuantity.find(
      (qty) => qty.productCode === item.ProductTrace?.product_code
    );
    return {
      StockId: index + 1,
      ProductCode: item.ProductTrace?.product_code,
      ProductName: item.ProductTrace?.name,
      ProductType: item.ProductTrace?.type,
      warranty: item.warranty,
      quantity: item.quantity,
      availableQuantity: availableQuantity
        ? item.quantity_no - availableQuantity.quantity
        : item.quantity_no,
      unit: item.Unit?.unit,
    };
  });
  //excell
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = async (excelData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  ///invoice
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleClikPrint = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (productName === "" && productIdCode === "" && minQuantity === "") {
      toast.dismiss();
      toast.warning("Please Select A row ");
      return;
    } else {
      handlePrint();
    }
  };

  const handleViewImage = (e) => {
    if (e.detail > 1) {
      return;
    }
    toast.dismiss();
    // Show a new toast
    toast("This feature will be added in next update!", {
      autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
    });
  };
  localStorage.setItem("formattedStock", JSON.stringify(formattedStock));

  return (
    <>
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="full_div_stock_operation">
        <div className="first_row_div_stock_operation">
          <div className="search_div_stock_operation">
            <div className="input_field_stock_operation">
              <label>Product Name</label>
              <input
                value={selectedProduct}
                onChange={(event) => {
                  setSelectedProduct(event.target.value);
                }}
                list="stockproductname"
              />
              <datalist id="stockproductname">
                {allProduct.length > 0 &&
                  allProduct.map((product, index) => {
                    return <option key={index}>{product.name}</option>;
                  })}
              </datalist>
              <button onClick={handleSearchProductName}>Search</button>
            </div>
            <div className="input_field_stock_operation">
              <label>Product Code</label>
              <input
                value={selectedProductCode}
                onChange={(event) => {
                  setSelectedProductCode(event.target.value);
                }}
                list="product_code_list"
              />
              <datalist id="product_code_list">
                {allProduct.length > 0 &&
                  allProduct.map((product, index) => {
                    return <option key={index}>{product.product_code}</option>;
                  })}
              </datalist>
              <button onClick={handleSearchproductcode}>Search</button>
            </div>
          </div>
          <div className="input_field_stock_operation">
            <button onClick={fetchData}> Show All</button>
          </div>
        </div>
        <div className="second_row_div_stock_operation loading_stock_operation">
          <div
            className={`${
              isLoading ? "loader_spriner" : ""
            } table_wrapper_stock_operation table_div_stock_operation`}
          >
            {isLoading ? (
              <div className="rotating_lines_stock_operation">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              </div>
            ) : (
              <table border={3} cellSpacing={2} cellPadding={10}>
                <tr>
                  <th>Stock Id</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Type/No.</th>
                  <th>Warranty</th>
                  <th>Quantity</th>
                  <th>Available Quantity</th>
                  <th>Unit</th>
                </tr>
                <tbody>
                  {FilteredaggregatedRows.length > 0
                    ? FilteredaggregatedRows.map((item, index) => {
                        const availableQuantity = aggregatedSaleQuantity.find(
                          (qty) =>
                            qty.productCode === item.ProductTrace?.product_code
                        );

                        return (
                          <tr
                            className={
                              activeRowIndex === index ? "active-row" : ""
                            }
                            tabIndex="0"
                            key={index}
                            onClick={() =>
                              handlerow(item, index, availableQuantity)
                            }
                          >
                            {/* Other columns */}
                            <td>{index + 1}</td>
                            <td>{item.ProductTrace?.product_code}</td>
                            <td>{item.ProductTrace?.name}</td>
                            <td>{item.ProductTrace?.type}</td>
                            <td>{item.warranty}</td>
                            <td>{item.quantity_no}</td>
                            <td>
                              {availableQuantity
                                ? item.quantity_no - availableQuantity.quantity
                                : item.quantity_no}
                            </td>
                            <td>{item.Unit?.unit}</td>
                            {/* Display the available quantity */}
                          </tr>
                        );
                      })
                    : aggregatedRows &&
                      aggregatedRows.map((item, index) => {
                        const availableQuantity = aggregatedSaleQuantity.find(
                          (qty) =>
                            qty.productCode === item.ProductTrace?.product_code
                        );

                        return (
                          <tr
                            className={
                              activeRowIndex === index ? "active-row" : ""
                            }
                            tabIndex="0"
                            key={index}
                            onClick={() =>
                              handlerow(item, index, availableQuantity)
                            }
                          >
                            {/* Other columns */}
                            <td>{index + 1}</td>
                            <td>{item.ProductTrace?.product_code}</td>
                            <td>{item.ProductTrace?.name}</td>
                            <td>{item.ProductTrace?.type}</td>
                            <td>{item.warranty}</td>
                            <td>{item.quantity_no}</td>
                            <td>
                              {availableQuantity
                                ? item.quantity_no - availableQuantity.quantity
                                : item.quantity_no}
                            </td>
                            <td>{item.Unit?.unit}</td>
                            {/* Display the available quantity */}
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="third_row_div_stock_operation">
          <div className="container_update_stock">
            <div className="container_update_stock_operation">
              <div className="container_update_column1_stock">
                <div style={{ fontSize: "1.2vw", fontWeight: "bold" }}>
                  View Product Invoice
                </div>
                <div className="upadted_input_field">
                  <div className="updated_input_field_first">
                    <div className="input_field_stock_operation">
                      <label>Stock Id</label>
                      <input
                        value={stockId}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product code</label>
                      <input
                        value={productIdCode}
                        onChange={(event) => {
                          setProductIdCode(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product Name</label>
                      <input
                        value={productName}
                        onChange={(event) => {
                          setProductName(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product Type</label>
                      <input
                        value={prodcutType}
                        onChange={(event) => {
                          setMinQuantity(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="updated_input_field_first">
                    <div className="input_field_stock_operation">
                      <label>Quantity</label>
                      <input
                        value={quantity}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Unit</label>
                      <input
                        value={unit}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Avilable Quantity</label>
                      <input
                        value={minQuantity}
                        onChange={(event) => {
                          setMinQuantity(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Warranty</label>
                      <input
                        value={warranty}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="custome_stock_operation">
                  <div className="reset_button_stock_operation">
                    <div style={{ display: "none" }}>
                      <ComponentToPrint
                        ref={componentRef}
                        stockId={stockId}
                        productCode={productIdCode}
                        productName={productName}
                        quantity={quantity}
                        availableQuantity={minQuantity}
                        unit={unit}
                      />
                    </div>
                    <button onClick={handleClikPrint}>
                      <img src={invoiceimg} alt="" />
                    </button>
                    <div>View Invoice</div>
                  </div>

                  <div className="reset_button_stock_operation">
                    <button onClick={handleReset}>
                      <img src={reset} alt="" />
                    </button>
                    <div>Reset</div>
                  </div>
                </div>
              </div>
              <div className="container_update_column2_stock_button">
                <button
                  className="container_update_column2_stock_button_view"
                  onClick={handleViewImage}
                >
                  View & add Image
                </button>
                <div className="container_update_column2_stock_button_excel">
                  <button
                    onClick={() =>
                      exportToExcel(formattedStock, "Stock Report")
                    }
                  >
                    <img src={Excel} alt="" />
                  </button>
                  Excel
                </div>
              </div>

              <div className="container_update_column2_stock">
                <div className="input_field_stock_operation_total">
                  <label>Total Quantity</label>
                  <input value={TotalQuantity} disabled />
                </div>

                <div className="input_field_stock_operation_total">
                  <label> Total Avilable Quantity</label>
                  <input disabled value={totalAvailableQuantity} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockOperation;
