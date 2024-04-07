import React, { useState, useEffect } from "react";
import "./datebaseincome.css";
import { MdPreview } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const DateBaseIncume = () => {
  const [rows, setRows] = useState([]);
  const [expanceData, setExpanceData] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [fixDataExpence, setFixDataExpence] = useState([]);
  const [date, setDate] = useState([]);
  const [formDate, setFormDate] = useState([]);
  const [toDate, setToDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const toastId = React.useRef(null);

  useEffect(() => {
    document.title = "Pofit/Loss";
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filterProductData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id === 1
        );
        // const filteredRows = datas_getAllTranscatioData.filter(
        //   (item) => item.OperationType?.operation_name === "Sale"
        // );
        setTimeout(() => {
          setRows(filterProductData);
          setFixData([...new Set(filterProductData)]);
          console.log("Filter Data: ", filterProductData);
          console.log(filterProductData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = "Pofit/Loss";
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id && item.operation_type_id === 3
        );
        setTimeout(() => {
          setExpanceData(filteredData);
          setFixDataExpence([...new Set(filteredData)]);
          console.log("Filter Data: ", filteredData);
          console.log(datas_getAllTranscatioData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
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
        const filterProductData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id === 1
        );
        setTimeout(() => {
          setRows(filterProductData);
          setFixData([...new Set(filterProductData)]);
          console.log(datas_getAllTranscatioData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setSelectedID(null);
  };

  const handleClickShowAllExpence = () => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        const filteredData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id && item.operation_type_id === 3
        );
        setTimeout(() => {
          setExpanceData(filteredData);
          console.log(filteredData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setToDate("");
    setFormDate("");
    setDate("");
  };

  const handleShowAllData = () => {
    handleClickShowAll();
    handleClickShowAllExpence();
  };

  const totalSaleAmount =
    rows && rows.length > 0
      ? rows
          .reduce((total, item) => {
            const saledata = parseFloat(item.sale_price) || 0;
            const quantity = parseFloat(item.quantity_no) || 0;
            const itemTotal = saledata * quantity;
            total += itemTotal;
            return total;
          }, 0)
          .toFixed(2)
      : 0;

  const totalAmountPurchase =
    rows && rows.length > 0
      ? rows
          .reduce((total, item) => {
            const purchaseprice = parseFloat(item.purchase_price) || 0;
            const quantity = parseFloat(item.quantity_no) || 0;
            const itemTotal = purchaseprice * quantity;
            total += itemTotal;
            return total;
          }, 0)
          .toFixed(2)
      : 0;

  const totalProfit = (totalSaleAmount - totalAmountPurchase).toFixed(2);

  const totalDiscount =
    rows && rows.length > 0
      ? rows
          .reduce((productamount, item) => {
            if (
              item.discount !== undefined &&
              item.discount !== null &&
              item.discount !== ""
            ) {
              productamount += Number(item.discount);
            }
            return productamount;
          }, 0)
          .toFixed(2)
      : 0;

  //   const totalVat =
  // rows && rows.length > 0
  //   ? rows
  //       .reduce((productamount, item) => {
  //         if (
  //           item.discount !== undefined &&
  //           item.discount !== null &&
  //           item.discount !== ""
  //         ) {
  //           productamount += Number(item.discount);
  //         }
  //         return productamount;
  //       }, 0)
  //       .toFixed(2)
  //   : 0;

  const Profit = (totalProfit - totalDiscount).toFixed(2);

  const totalExpance =
    expanceData && expanceData.length > 0
      ? expanceData
          .reduce((productamount, item) => {
            if (
              item.amount !== undefined &&
              item.amount !== null &&
              item.amount !== ""
            ) {
              productamount += Number(item.amount);
            }
            return productamount;
          }, 0)
          .toFixed(2)
      : 0;

  const totalProfitInDate = (Profit - totalExpance).toFixed(2);

  // Date Search

  const handleFilterOnlyProductDate = () => {
    if (!date || typeof date !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Date Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(date.toLowerCase());
      }
      return false;
    });

    setRows(filterData);
  };

  const handleFilterOnlyExpenceDate = () => {
    if (!date || typeof date !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Date Is Required");
      }
      return;
    }
    const filterData = fixDataExpence.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(date.toLowerCase());
      }
      return false;
    });

    setExpanceData(filterData);
  };

  const handleDateSearch = () => {
    handleFilterOnlyProductDate();
    handleFilterOnlyExpenceDate();
  };

  // Search To Date And Form Date

  const handleFilterProductFromDateToDate = () => {
    if (
      !formDate ||
      !toDate ||
      typeof formDate !== "string" ||
      typeof toDate !== "string"
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
          itemDate >= formDate.split("T")[0] && itemDate <= toDate.split("T")[0]
        );
      }
      return false;
    });

    setRows(filterData);
  };

  const handleFilterExpanceFromDateToDate = () => {
    if (
      !formDate ||
      !toDate ||
      typeof formDate !== "string" ||
      typeof toDate !== "string"
    ) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Both Date Fields Are Required");
      }

      return;
    }
    const filterData = fixDataExpence.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0];
        return (
          itemDate >= formDate.split("T")[0] && itemDate <= toDate.split("T")[0]
        );
      }
      return false;
    });

    setExpanceData(filterData);
  };

  const handleFormDateToDate = () => {
    handleFilterProductFromDateToDate();
    handleFilterExpanceFromDateToDate();
  };
  const [selectedID, setSelectedID] = useState(null);
  const handleDataForColor = (item) => {
    setSelectedID(item.transaction_id);
  };

  return (
    <div className="full_div_date_base_income">
      <ToastContainer stacked autoClose={1000} />
      <div className="container_div_date_base_income">
        <div className="container_first_div_date_base_income">
          <div className="container_serach_date_base_income">
            <div className="input_field_date_base_income">
              <label>Date</label>
              <input
                type="date"
                onChange={(event) => setDate(event.target.value)}
                value={date}
              />
              <button onClick={handleDateSearch}>Search</button>
            </div>
            <div className="container_todate_formdate_base_incume">
              <div className="input_field_date_base_income">
                <label>From Date</label>
                <input
                  type="date"
                  onChange={(event) => setFormDate(event.target.value)}
                  value={formDate}
                />
              </div>
              <div className="input_field_date_base_income">
                <label>To Date</label>
                <input
                  type="date"
                  onChange={(event) => setToDate(event.target.value)}
                  value={toDate}
                />
              </div>
              <div className="input_field_date_base_income">
                <button onClick={handleFormDateToDate}>Search</button>
              </div>
            </div>
            <div className="container_button_date_base_income">
              <button onClick={handleShowAllData}>
                <MdPreview />
              </button>
              <span>Show All</span>
            </div>
          </div>
        </div>
        <div className="container_second_div_date_base_income">
          <span>Product Base Report</span>
          <div className="flex-center">
            {isLoading ? (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="64"
                visible={true}
              />
            ) : (
              <div className="table_div_date_base_income">
                <table>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Type</th>
                    <th>Purchase Price</th>
                    <th>Sale Price</th>
                    <th>Quantity</th>
                    <th>Total Purchase</th>
                    <th>Total Sale</th>
                    <th>Unit</th>
                    <th>Sale Date</th>
                  </tr>
                  <tbody>
                    {rows.length > 0 &&
                      rows.map((item) => (
                        <tr
                          key={item.transaction_id}
                          onClick={() => handleDataForColor(item)}
                          className={
                            selectedID === item.transaction_id
                              ? "rows selected"
                              : "rows"
                          }
                          tabindex="0"
                        >
                          <td className="hover-effect">
                            {item.ProductTrace ? item.ProductTrace.name : ""}
                          </td>
                          <td className="hover-effect">
                            {item.ProductTrace ? item.ProductTrace.type : ""}
                          </td>
                          <td className="hover-effect">
                            {item.purchase_price}
                          </td>
                          <td className="hover-effect">{item.sale_price}</td>
                          <td className="hover-effect">{item.quantity_no}</td>
                          <td className="hover-effect">
                            {(
                              parseFloat(item.purchase_price) *
                              parseFloat(item.quantity_no)
                            ).toFixed(2)}
                          </td>
                          <td className="hover-effect">
                            {(
                              parseFloat(item.sale_price) *
                              parseFloat(item.quantity_no)
                            ).toFixed(2)}
                          </td>
                          <td className="hover-effect">
                            {item.Unit ? item.Unit.unit : ""}
                          </td>
                          <td className="hover-effect">
                            {item.date ? item.date.split("T")[0] : ""}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="container_third_div_date_base_income">
          <span>Expense Report</span>
          <div className="flex-center">
            {isLoading ? (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="64"
                visible={true}
              />
            ) : (
              <div className="table_div_date_base_income_expance">
                <table>
                  <tr>
                    <th>Serial</th>
                    <th>Expense Name</th>
                    <th>Cost</th>
                    <th>Date</th>
                  </tr>
                  <tbody>
                    {expanceData.length > 0 &&
                      expanceData.map((item, index) => (
                        <tr
                          key={index.transaction_id}
                          onClick={() => handleDataForColor(item)}
                          className={
                            selectedID === item.transaction_id
                              ? "rows selected"
                              : "rows"
                          }
                          tabindex="0"
                        >
                          <td className="hover-effect">{index + 1}</td>
                          <td className="hover-effect">{item.comment}</td>
                          <td className="hover-effect">{item.amount}</td>
                          <td className="hover-effect">
                            {item.date ? item.date.split("T")[0] : ""}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="container_forth_div_date_base_income">
          <div className="container_div_product_date_base_income">
            <div className="container_view_date_base_income">
              <span className="profit">Product Profit/Loss</span>
              <div className="sub_div_date_base_income">
                <div className="input_field_date_base_income_product">
                  <label>Total Sale Price</label>
                  <div className="input-field">
                    <input value={totalSaleAmount} disabled />
                    <span>TK</span>
                  </div>
                </div>
                <span>-</span>
                <div className="input_field_date_base_income_product">
                  <label>Toatal Purchase Price</label>
                  <div className="input-field">
                    <input value={totalAmountPurchase} disabled />
                    <span>TK</span>
                  </div>
                </div>
                <span>=</span>
                <div className="input_field_date_base_income_product">
                  <label>Product Profit/Loss</label>
                  <div className="input-field">
                    <input value={totalProfit} disabled />
                    <span>TK</span>
                  </div>
                </div>
                <span>-</span>
                <div className="input_field_date_base_income_product">
                  <label>Total Discount</label>
                  <div className="input-field">
                    <input value={totalDiscount} disabled />
                    <span>TK</span>
                  </div>
                </div>
                <span>=</span>
                <div className="input_field_date_base_income_product">
                  <label>Total Product Income</label>
                  <div className="input-field">
                    <input value={Profit} disabled />
                    <span>TK</span>
                  </div>
                </div>
              </div>
              {/* <div className="container_button_date_base_income_product">
              <button>Excel</button>
            </div> */}
            </div>
            <div className="container_expence_date_base_income">
              <span>Expense Total</span>
              <div className="input_field_date_base_income_product">
                <label>Total Expense</label>
                <div className="input-field">
                  <input value={totalExpance} disabled />
                  <span>TK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container_fifth_div_date_base_income">
          <div className="conatiner_div_last_profit">
            <span>Total Profit/Loss</span>
            <div className="container_div_date_base_income_view">
              <div className="container_pofitloss_date_base_income">
                <div className="input_field_date_base_income">
                  <label style={{ width: "10vw" }}>Total Product Income</label>
                  <input
                    value={Profit}
                    disabled
                    style={{
                      fontWeight: "bold",
                      fontSize: "1vw",
                      textAlign: "center",
                    }}
                  />
                  <span>TK</span>
                </div>
                <span>-</span>
                <div className="input_field_date_base_income">
                  <label>Total Expense</label>
                  <input
                    value={totalExpance}
                    disabled
                    style={{
                      fontWeight: "bold",
                      fontSize: "1vw",
                      textAlign: "center",
                    }}
                  />
                  <span>TK</span>
                </div>
              </div>
              <span>=</span>
              <div>
                <div className="input_field_date_base_income">
                  <label>Total Profit</label>
                  <input
                    value={totalProfitInDate}
                    disabled
                    style={{
                      fontWeight: "bold",
                      fontSize: "1vw",
                      textAlign: "center",
                    }}
                  />
                  <span>TK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateBaseIncume;
