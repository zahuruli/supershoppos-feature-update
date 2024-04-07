import React from "react";
import "./expance-reoprt.css";
import { useState, useEffect } from "react";
import InvestorExportExcel from "../../components/ExportExcel";
import "react-toastify/dist/ReactToastify.css";
import { BiReset } from "react-icons/bi";
import { MdPreview } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ExpanceReport = () => {
  const [rows, setRows] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState([]);
  const [toDate, setToDate] = useState([]);
  // Update data state
  const [expanceName, setExpanceName] = useState([]);
  const [totalCost, setTotalCost] = useState([]);
  const [date, setDate] = useState("");
  const [paid, setPaid] = useState([]);
  const [due, setDue] = useState([]);
  const [duePaid, setDuePaid] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const toastId = React.useRef(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  useEffect(() => {
    document.title = "Expense Report";
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
          setRows(filteredData);
          setFixData([...new Set(filteredData)]);
          console.log(filteredData);
          setSelectedID(null);
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
        const filteredData = datas_getAllTranscatioData.filter(
          (item) => item.operation_type_id && item.operation_type_id === 3
        );
        setTimeout(() => {
          setRows(filteredData);
          setFixData([...new Set(filteredData)]);
          setSelectedID(null);
          console.log(filteredData);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setSelectedID(null);
    setDate("");
    setToDate("");
    setFromDate("");
  };

  // const handleFilterDate = () => {
  //   const filterData = fixData.filter((item) => {
  //     if (item.date) {
  //       const itemDate = item.date.split("T")[0].toLowerCase();
  //       return (
  //         itemDate.includes(fromDate.split("T")[0].toLowerCase()) &&
  //         itemDate.includes(toDate.split("T")[0].toLowerCase())
  //       );
  //     }
  //     return false;
  //   });

  //   setRows(filterData);
  // };

  const handleFilterDate = () => {
    if (
      !fromDate ||
      !toDate ||
      typeof fromDate !== "string" ||
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
          itemDate >= fromDate.split("T")[0] && itemDate <= toDate.split("T")[0]
        );
      }
      return false;
    });

    setRows(filterData);
  };

  const handleFilterOnlyDate = () => {
    if (!date || typeof date !== "string") {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Date Is Required");
      }
      return;
    }
    const filterData = fixData.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(date.split("T")[0].toLowerCase());
      }
      return false;
    });

    setRows(filterData);
  };

  const totalPaid =
    rows && rows.length > 0
      ? rows
          .reduce((productpaid, item) => {
            if (
              item.paid !== undefined &&
              item.paid !== null &&
              item.paid !== ""
            ) {
              productpaid += Number(item.paid);
            }
            return productpaid;
          }, 0)
          .toFixed(2)
      : 0;

  const totalAmount =
    rows && rows.length > 0
      ? rows
          .reduce((productpaid, item) => {
            if (
              item.amount !== undefined &&
              item.amount !== null &&
              item.amount !== ""
            ) {
              productpaid += Number(item.amount);
            }
            return productpaid;
          }, 0)
          .toFixed(2)
      : 0;

  const TotalDue = totalAmount - totalPaid;

  // Data in input field
  const hendleDataInputField = (item) => {
    setSelectedID(item.transaction_id);
    setExpanceName(item.comment);
    setTotalCost(item.amount);
    setPaid(item.paid);
    setDate(item.date ? item.date.split("T")[0] : "");
    setDue(parseFloat(item.amount) - parseFloat(item.paid));
    // setDuePaid(parseFloat(item.amount) - parseFloat(item.paid));
  };

  // Updated due payment
  console.log(due, parseInt(duePaid));
  // http://194.233.87.22:5004/api/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=&paid=
  const updatedDueExpanceData = async (event) => {
    if (event.detail > 1) {
      return;
    }

    if (!selectedID) {
      toast.warning("Please Selected a Row");
      return;
    }

    const duePayment = parseFloat(paid) + parseFloat(duePaid);

    if (due < parseInt(duePaid)) {
      toast.error("Due payment cannot exceed the due amount");
      return;
    }
    if (parseInt(duePaid) === 0) {
      toast.error("Due payment cannot exceed the due amount");
      return;
    }
    if (parseInt(duePaid) < 0) {
      toast.error("Due payment cannot exceed the due amount");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=${selectedID}&paid=${duePayment}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Successfully Due Paid.");
        setSelectedID(null);
        ResetData();
        handleClickShowAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ResetData = () => {
    setSelectedID(null);
    setExpanceName("");
    setTotalCost("");
    setPaid("");
    setDate("");
    setDue("");
    setDuePaid("");
  };

  const deleteTransection = async (event) => {
    if (event.detail > 1) {
      return;
    }
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
          ResetData();
          toast.success("Successfully deleted transection");
        } else {
          console.log(`Error while deleting transection`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="full_div_supershop_expense_report">
      <div className="first_row_div_supershop_expense_report">
        <div className="container_search_column1_supershop_expense_report">
          <div className="two_way_date_supershop_expense_report_search">
            <div className="two_date_search">
              <div className="input-field_supershop_expense_report">
                <label>Date</label>
                <input
                  type="date"
                  onChange={(event) => setDate(event.target.value)}
                  value={date}
                />

                <button type="submit" onClick={handleFilterOnlyDate}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container_search_column2_expense_report">
          <div className="two_date_search_supershop">
            <div className="input-field_supershop_expense_report">
              <label c>From Date</label>
              <input
                type="date"
                onChange={(event) => setFromDate(event.target.value)}
                value={fromDate}
              />
            </div>
          </div>
        </div>
        <div className="container_search_column3_supershop_expense_report">
          <div className="input-field_supershop_expense_report">
            <label>To</label>
            <input
              type="date"
              onChange={(event) => setToDate(event.target.value)}
              value={toDate}
            />
            <button type="submit" onClick={handleFilterDate}>
              Search
            </button>
          </div>
        </div>
        <div className="container_search_column4_supershop_expense_report">
          <div>
            <div>
              <InvestorExportExcel excelData={rows} fileName={"Excel Export"} />
            </div>
          </div>
          <div className="container_button_supershop_expense_report">
            <button onClick={handleClickShowAll}>
              <MdPreview />
            </button>
            <span>Show All</span>
          </div>
        </div>
      </div>
      <div className="second_row_div_supershop_expense_report">
        {isLoading ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        ) : (
          <div className="table_wrapper_supershop_expense_report">
            <table>
              <tr>
                <th>Serial</th>
                <th>Expense Name</th>
                <th>Cost</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Date</th>
              </tr>
              <tbody>
                {rows.length > 0 &&
                  rows.map((item, index) => (
                    <tr
                      key={index.transaction_id}
                      onClick={() => hendleDataInputField(item)}
                      className={
                        selectedID === item.transaction_id
                          ? "rows selected"
                          : "rows"
                      }
                      tabindex="0"
                    >
                      <td>{index + 1}</td>
                      <td>{item.comment}</td>
                      <td>{item.amount}</td>

                      <td>{item.paid}</td>
                      <td>{parseFloat(item.amount) - parseFloat(item.paid)}</td>
                      <td>{item.date ? item.date.split("T")[0] : ""}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="third_row_div_supershop_expense_report">
        <div className="container_view_update_supershop_expense_report">
          <div className="container_view_supershop_expense_report">
            <div className="input-field_supershop_expense_report">
              <label>Total Price</label>
              <input
                style={{
                  fontWeight: "bold",
                  fontSize: "1vw",
                  textAlign: "center",
                }}
                disabled
                value={totalAmount}
              />
            </div>
            <div className="input-field_supershop_expense_report">
              <label>Paid</label>
              <input
                style={{
                  fontWeight: "bold",
                  fontSize: "1vw",
                  textAlign: "center",
                }}
                disabled
                value={totalPaid}
              />
            </div>
            <div className="input-field_supershop_expense_report">
              <label>Due</label>
              <input
                style={{
                  fontWeight: "bold",
                  fontSize: "1vw",
                  textAlign: "center",
                }}
                disabled
                value={TotalDue}
              />
            </div>
          </div>
          <h4 style={{ fontSize: "1.2vw" }}>Update Opration</h4>
          <div className="container_update_supershop_expense_report">
            <div className="container-update-column1_supershop_expense_report">
              <div className="input-field_supershop_expense_report">
                <label>Expense Name</label>
                <input
                  value={expanceName}
                  onChange={(event) => setExpanceName(event.target.value)}
                  disabled
                />
              </div>
              <div className="input-field_supershop_expense_report">
                <label>*Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="container-update-column2_supershop_expense_report">
              <div className="input-field_supershop_expense_report">
                <label>Total Cost</label>
                <input
                  value={totalCost}
                  onChange={(event) => setTotalCost(event.target.value)}
                  disabled
                />
              </div>
              <div className="input-field_supershop_expense_report">
                <label>Paid</label>
                <input
                  value={paid}
                  onChange={(event) => setPaid(event.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="container-update-column3_supershop_expense_report">
              <div className="input-field_supershop_expense_report">
                <label>Due</label>
                <input
                  value={due}
                  onChange={(event) => setDue(event.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="container-update-column4_supershop_expense_report">
              <div className="container_button_supershop_expense_report">
                <button onClick={ResetData}>
                  <BiReset />
                </button>
                <span>Reset</span>
              </div>
              <div className="container_button_supershop_expense_report">
                <button onClick={deleteTransection}>
                  <MdDelete className="red"/>
                </button>
                <span>Delete</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container-update-column5_supershop_expense_report">
          <h4 style={{ fontSize: "1.2vw" }}>Due Payment</h4>
          <div>
            <div
              style={{ marginTop: "3vw" }}
              className="input-field_supershop_expense_report"
            >
              <label style={{ width: "4vw" }}>TK</label>
              <input
                style={{ width: "10vw" }}
                value={duePaid}
                onChange={(event) => setDuePaid(event.target.value)}
              />
            </div>
            <div className="container_button_supershop_expense_report">
              <button onClick={updatedDueExpanceData}>
                <IoIosSave />
              </button>
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer stacked autoClose={2000} position="top-right" />
    </div>
  );
};

export default ExpanceReport;
