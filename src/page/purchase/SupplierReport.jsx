import React, { useEffect, useState } from "react";
import "./supplier_report.css";
import update from "../../image/Update.png";
import save from "../../image/Save.png";
import reset from "../../image/reset.png";
import Excel from "../../image/excel.webp";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlinePreview } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
// eslint-disable-next-line no-unused-vars
import { MdDelete } from "react-icons/md";
import axios from "axios";

const PurchasesReport = () => {
  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };

  const employee = localStorage.getItem("username");

  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState("");
  const [duePaid, setDuePaid] = useState("");
  // const [totalAmount, setTotalAmount] = useState(0);
  // const [totalPaid, setTotalPaid] = useState(0);
  // const [totalDue, setTotalDue] = useState(0);
  const [PaymentTypeData, setPaymentTypeData] = useState([]);

  const [searcSupplierName, setSearcSupplierName] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoice, setInvoice] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [entry_by, setEntryBy] = useState("");
  const [shop_name, setShopName] = useState("");
  const [purchase_date, setPurchasedate] = useState("");
  const [total, setTotal] = useState([]);
  const [paid, setPaid] = useState("");
  const [due, setDue] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [FiltersupplierData, setFiltersupplierData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

      setRows(filteredTransactions);
      setData([...new Set(filteredTransactions)]);
      setActiveRowIndex(false);
      handleReset();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataPaymentType = async () => {
    try {
      const response = await axiosInstance.get("/paymenttypes/getAll");
      setPaymentTypeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSupplierData = async () => {
    try {
      const response = await axiosInstance.get("/contributorname/getAll");
      setSupplierData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // fetch data
  useEffect(() => {
    document.title = "Supplier Transactions Report";
    fetchData();
    fetchDataPaymentType();
    fetchSupplierData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filter supplier
  useEffect(() => {
    const filteredContributor = supplierData.filter(
      (contributor) =>
        contributor.ContributorType.contributor_type &&
        contributor.ContributorType.contributor_type === "Supplier"
    );

    setFiltersupplierData(filteredContributor);
  }, [data, supplierData]);

  // reset
  const handleReset = () => {
    setActiveRowIndex(null);
    setInvoice("");
    setSupplierName("");
    setAddress("");
    setPurchasedate("");
    setMobile("");
    setEntryBy("");
    setShopName("");
    setTotal("");
    setPaid("");
    setDue("");
    setStartDate("");
    setEndDate("");
    setSearcSupplierName("");
  };

  // supplier search
  const handleSearchSupplier = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (searcSupplierName === "") {
      toast.dismiss();
      toast.warning("Plaese filup serach Input");
      return;
    }

    const results = data.filter((item) =>
      item.ContributorName
        ? item.ContributorName.contributor_name
            .toLowerCase()
            .includes(searcSupplierName.toLowerCase())
        : ""
    );

    if (results.length === 0) {
      setRows([]);
      toast.dismiss();
      // toast.warning("Not Matching any data");
    } else {
      setRows(results);
    }
  };

  //only date search
  const handledateSearch = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (date === "") {
      toast.dismiss();
      toast.warning("Plaese filup Date serach Input");
      return;
    }
    const filterData = data.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0].toLowerCase();
        return itemDate.includes(date.toLowerCase());
      }
      return false;
    });

    setRows(filterData);
  };
  /// start date and end date search
  const handleSearchDateStartend = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (startDate === "" && endDate === "") {
      toast.dismiss();
      toast.warning("Plaese filup Date serach Input");
      return;
    }
    if (startDate === "") {
      toast.dismiss();
      toast.warning("Plaese Fillup From Date Input");
      return;
    }
    if (endDate === "") {
      toast.dismiss();
      toast.warning("Plaese Fillup To Date Input");
      return;
    }
    const filterData = data.filter((item) => {
      if (item.date) {
        const itemDate = item.date.split("T")[0];
        return (
          itemDate >= startDate.split("T")[0] &&
          itemDate <= endDate.split("T")[0]
        );
      }
      return false;
    });

    setRows(filterData);
  };
  /// filter invoice
  const formattedTransactions = [
    ...new Set(rows && rows.map((item) => item.invoice_no)),
  ].map((invoiceNo) => {
    // Find the transactions with the current invoice number
    const transactions =
      rows && rows.filter((item) => item.invoice_no === invoiceNo);

    // Calculate total amount for this invoice
    const amount = transactions.reduce((total, transaction) => {
      // Multiply quantity and purchase price for each product and sum them up
      return (
        total +
        parseInt(transaction.quantity_no) * parseInt(transaction.purchase_price)
      );
    }, 0);
    console.log(transactions);
    return {
      invoice_no: invoiceNo,
      contributor_name: transactions[0]?.ContributorName?.contributor_name,
      mobile: transactions[0]?.ContributorName?.mobile,
      address: transactions[0]?.ContributorName?.address,
      amount: amount,
      vat: transactions[0].Tax?.rate,
      paid: transactions[0]?.paid,
      due: parseInt(amount) - parseInt(transactions[0]?.paid || 0),
      date: transactions[0]?.date?.split("T")[0],
      employee_name: transactions[0]?.Employee?.name,
      shop_name: transactions[0]?.ShopName?.shop_name,
    };
  });
  console.log("formattedTransactions", formattedTransactions);
  /// selected row
  const handlerow = (item, index) => {
    setSelected(item.transaction_id);

    setActiveRowIndex(index);
    setInvoice(item.invoice_no);
    setSupplierName(item.ContributorName?.contributor_name);
    setAddress(item.ContributorName?.address);
    setPurchasedate(item.date.split("T")[0]);
    setMobile(item.ContributorName?.mobile);
    setEntryBy(employee);
    setShopName(item.ShopName?.shop_name);
    setTotal(item.amount);
    setPaid(item.paid);
    setDue(
      (parseInt(
        item.amount !== undefined && item.amount !== null && item.amount !== ""
      )
        ? 0
        : item.amount) -
        (parseInt(
          item.paid !== undefined && item.paid !== null && item.paid !== ""
        )
          ? 0
          : item.paid)
    );
    setDuePaid(
      (parseInt(
        item.amount !== undefined && item.amount !== null && item.amount !== ""
      )
        ? 0
        : item.amount) -
        (parseInt(
          item.paid !== undefined && item.paid !== null && item.paid !== ""
        )
          ? 0
          : item.paid)
    );
  };
  //Excell
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

  //update

  const handelUpdate = async (event) => {
    if (event.detail > 1) {
      return;
    }

    if (!selected) {
      toast.warning("Please Selected a Row");
      return;
    }

    if (due < parseInt(paid)) {
      toast.error("Due payment cannot exceed the due amount");
      return;
    }

    if (duePaid === 0) {
      toast.error("Already paid");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=${selected}&paid=${paid}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Successfully Paid.");
        setSelected("");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(paid, duePaid);
  // http://194.233.87.22:5004/api/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=&paid=
  const handelDueUpdate = async (event) => {
    if (event.detail > 1) {
      return;
    }

    if (!selected) {
      toast.warning("Please Selected a Row");
      return;
    }

    const duePayment = parseInt(paid) + parseInt(duePaid);

    if (paid > parseInt(duePaid)) {
      toast.error("Due payment cannot exceed the due amount");
      return;
    }
    if (duePaid === 0) {
      toast.warning("Already paid");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=${selected}&paid=${duePayment}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Successfully Paid.");
        setSelected("");
        fetchData();
        setDuePaid("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /// get total amount
  const totalAmount =
    formattedTransactions && formattedTransactions.length > 0
      ? formattedTransactions
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

  // get total paid
  const totalPaid =
    formattedTransactions && formattedTransactions.length > 0
      ? formattedTransactions
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
  // get total due
  const totalDue = totalAmount - totalPaid;

  return (
    <>
      <div className="full_div">
        <ToastContainer position="top-center" autoClose={1000} />
        <div className="first_row_div_supplier_report">
          <div className="invisible_div_supplier_report">
            <div className="input_field_supplier_report">
              <div className="suppllier_report_input">
                <div className="date_input_field_short_long_purchase_supplier_report">
                  <label className="label_field_supershop_purchase">
                    Date*
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                  <button onClick={handledateSearch}>Search</button>
                </div>

                <div className="suppllier_report_input ">
                  <div className="input_field_short_long_purchase_supplier_report">
                    <label className="label_field_supershop_purchase">
                      Supplier*
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setSearcSupplierName(e.target.value)}
                      list="list_supplier"
                      value={searcSupplierName}
                    />

                    <datalist id="list_supplier">
                      {FiltersupplierData.length > 0 &&
                        FiltersupplierData.map((supplier, index) => {
                          return (
                            <option key={index}>
                              {supplier.contributor_name}
                            </option>
                          );
                        })}
                    </datalist>
                    <button onClick={handleSearchSupplier}>Search</button>
                  </div>
                </div>
              </div>
              <div className="suppllier_report_input_date">
                <div>
                  <div className="date_input_field_short_long_purchase_supplier_report">
                    <label className="label_field_supershop_purchase">
                      From Date*
                    </label>
                    <input
                      type="date"
                      onChange={(e) => setStartDate(e.target.value)}
                      value={startDate}
                    />
                  </div>
                  <div className="suppllier_report_input">
                    <div className="date_input_field_short_long_purchase_supplier_report">
                      <label className="label_field_supershop_purchase">
                        To Date*
                      </label>
                      <input
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="Supplier_date_search_button">
                  {" "}
                  <button onClick={handleSearchDateStartend}>Search</button>
                </div>
              </div>

              <div className="show_all_suppiler_button">
                <div className="show_all_button">
                  <button onClick={fetchData}>
                    <MdOutlinePreview style={{ fontSize: "2vw" }} />
                  </button>
                  <span>Show All</span>
                </div>
                <div className="excel_button">
                  <button
                    onClick={() =>
                      exportToExcel(formattedTransactions, "Supplier Report")
                    }
                  >
                    <img src={Excel} alt="" />
                  </button>
                  Excel
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="second_row_div_supplier_report">
          <div className="table_supershop_supplier_report">
            <div
              className={`${
                isLoading ? "loader_spriner" : ""
              } table_div_supershop_supplier_report`}
            >
              {isLoading ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="64"
                  visible={true}
                />
              ) : (
                <table border={3} cellSpacing={2} cellPadding={10}>
                  <thead>
                    <tr>
                      <th style={Color}>Invoice</th>
                      <th style={Color}>Supplier Name</th>
                      <th style={Color}>Mobile</th>
                      <th style={Color}>Address</th>
                      <th style={Color}>Total</th>
                      <th style={Color}>Paid</th>
                      <th style={Color}>Due</th>
                      <th style={Color}>Purchase Date</th>
                      <th style={Color}>Entry by</th>
                      <th style={Color}>Shop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows &&
                      [...new Set(rows.map((item) => item.invoice_no))].map(
                        (invoiceNo, index) => {
                          // Find the first transaction with the current invoice number
                          const transaction = rows.find(
                            (item) => item.invoice_no === invoiceNo
                          );
                          return (
                            <tr
                              key={index}
                              className={
                                activeRowIndex === index ? "active-row" : ""
                              }
                              onClick={() => handlerow(transaction, index)}
                            >
                              <td>{transaction.invoice_no}</td>
                              <td>
                                {transaction.ContributorName?.contributor_name}
                              </td>
                              <td>{transaction.ContributorName?.mobile}</td>
                              <td>{transaction.ContributorName?.address}</td>
                              <td>{transaction.amount}</td>
                              <td>{transaction.paid}</td>
                              <td>
                                {(parseInt(
                                  transaction.amount !== undefined &&
                                    transaction.amount !== null &&
                                    transaction.amount !== ""
                                )
                                  ? 0
                                  : transaction.amount) -
                                  (parseInt(
                                    transaction.paid !== undefined &&
                                      transaction.paid !== null &&
                                      transaction.paid !== ""
                                  )
                                    ? 0
                                    : transaction.paid)}
                              </td>
                              <td>{transaction.date.split("T")[0]}</td>
                              <td>{employee}</td>
                              <td>{transaction.ShopName?.shop_name}</td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="total_supplier_report">
              <div className="input_field_short_long_purchase_supplier_report_total">
                <label>Total</label>
                <input
                  type="text"
                  className="input_field_supershop_supplier_long"
                  value={totalAmount}
                  disabled
                />
              </div>
              <div className="input_field_short_long_purchase_supplier_report_total">
                <label>Paid</label>
                <input
                  type="text"
                  className="input_field_supershop_supplier_long"
                  value={totalPaid}
                  disabled
                />
              </div>
              <div className="input_field_short_long_purchase_supplier_report_total">
                <label>Due </label>
                <input
                  type="text"
                  className="input_field_supershop_supplier_long"
                  value={totalDue}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div className="third_row_div_purchase">
          <div className="first_column_second_row_purchase_report">
            <div className="first_column_second_row_input_field_purchase_report">
              <div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Invoice</label>
                  <input
                    type="text"
                    value={invoice}
                    disabled
                    onChange={(event) => setInvoice(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    disabled
                    onChange={(event) => setSupplierName(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Address</label>
                  <input
                    type="text"
                    value={address}
                    disabled
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Mobile</label>
                  <input
                    type="number"
                    value={mobile}
                    disabled
                    onChange={(event) => setMobile(event.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Entry by</label>
                  <input
                    type="text"
                    value={entry_by}
                    disabled
                    onChange={(event) => setEntryBy(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Shop</label>
                  <input
                    type="text"
                    className=" "
                    value={shop_name}
                    disabled
                    onChange={(event) => setShopName(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Purchase Date</label>
                  <input
                    type="text"
                    value={purchase_date}
                    disabled
                    onChange={(event) => setPurchasedate(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Total</label>
                  <input
                    type="text"
                    value={total}
                    disabled
                    onChange={(event) => setTotal(event.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Paid</label>
                  <input
                    type="text"
                    value={paid}
                    onChange={(event) => setPaid(event.target.value)}
                  />
                </div>
                <div className="input_field_short_long_purchase_supplier_report">
                  <label>Due</label>
                  <input
                    type="number"
                    value={due}
                    onChange={(event) => setDue(event.target.value)}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="all_update_button_supplier_report ">
              <div className="update_button_purchses_report">
                <button onClick={handelUpdate}>
                  <img src={update} alt="" />
                </button>
                Update
              </div>

              <div className="reset_button_purchses_report">
                <button onClick={handleReset}>
                  <img src={reset} alt="" />
                </button>
                Reset
              </div>
            </div>
          </div>

          <div className="second_column_second_row_supplier_report">
            <div className="due_payment">Due Payment</div>

            <div className="input_field_short_long_purchase_supplier_report">
              <label>Payment</label>
              <select name="" id="">
                {PaymentTypeData.map((data) => (
                  <option value="">{data.payment_type}</option>
                ))}
              </select>
            </div>
            <div className="input_field_short_long_purchase_supplier_report">
              <label>TK.</label>
              <input
                style={{ width: "12.5vw" }}
                type="text"
                value={duePaid}
                onChange={(event) => setDuePaid(event.target.value)}
              />
            </div>
            <div className="container_div_delete">
              <div className="input_field_short_long_supplier_report">
                <button onClick={handelDueUpdate}>
                  <img src={save} alt="" />
                </button>
                <span>Save</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasesReport;
