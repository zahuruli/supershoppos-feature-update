/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { MdPreview } from "react-icons/md";
import "./customertranscationreport.css";
import { IoIosSave } from "react-icons/io";
import ExcelExport from "../../components/ExportExcel";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
// import { MdDelete } from "react-icons/md";

const CustomerTranscationReport = () => {
  const [customerName, setCustomerName] = useState("");
  const [fixData, setFixData] = useState([]);
  const [rows, setRows] = useState([]);
  const [allCustomer, setAllCustomer] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [contributor_name_id, setID] = useState([]);
  const [mobile, setMobile] = useState([]);
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState([]);
  const [employee_id, setCollection] = useState("");
  const [payment_type_id, setpayment_type_id] = useState([]);
  const [date, setDate] = useState("");
  const [transaction_id, setTranstion] = useState("");
  const [invoice_no, setInvoice] = useState("");
  const [product_trace_id, setProductTrance] = useState("");
  const [brand_id, setBardId] = useState("");
  const [quantity_no, setQuantity_no] = useState("");
  const [unit_id, setunit_id] = useState("");
  const [warranty, setwarranty] = useState("");
  const [tax_id, settax_id] = useState("");
  const [authorized_by_id, setauthorized_by_id] = useState("");
  const [operation_type_id, setoperation_type_id] = useState("");
  const [other_cost, setother_cost] = useState("");
  const [shop_name_id, setshop_name_id] = useState("");
  const [purchase_price, setpurchase_price] = useState("");
  const [sale_price, setsale_price] = useState("");
  const [discount, setdiscount] = useState("");
  const [comment, setcomment] = useState("");
  const [selected, setSelected] = useState(false);
  const toastId = React.useRef(null);
  const [due, setDue] = useState("");
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });
  const employee = localStorage.getItem("username");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  useEffect(() => {
    document.title = "Customer Transactions Report";

    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;

        // const filteredRows = datas_getAllTranscatioData.filter(
        //   (item) =>
        //     item.ContributorName?.ContributorType?.contributor_type ===
        //       "Customer" && item.OperationType?.operation_name === "Sale"
        // );
        const filteredRows = datas_getAllTranscatioData.filter(
          (item, index, self) =>
            item.ContributorName?.ContributorType?.contributor_type ===
              "Customer" &&
            item.OperationType?.operation_name === "Sale" &&
            self.findIndex((t) => t.invoice_no === item.invoice_no) === index
        );

        console.log("filter customer", filteredRows);

        setTimeout(() => {
          setRows(filteredRows);
          setAllCustomer(filteredRows);
          setFixData([...new Set(filteredRows)]);
          setIsLoading(false);
        }, 500);

        console.log(datas_getAllTranscatioData);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowAll = () => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response_getAllTranscatioData = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );

        const datas_getAllTranscatioData = response_getAllTranscatioData.data;
        // const filteredRows = datas_getAllTranscatioData.filter(
        //   (item) =>
        //     item.ContributorName?.ContributorType?.contributor_type ===
        //       "Customer" && item.OperationType?.operation_name === "Sale"
        // );

        const filteredRows = datas_getAllTranscatioData.filter(
          (item, index, self) =>
            item.ContributorName?.ContributorType?.contributor_type ===
              "Customer" &&
            item.OperationType?.operation_name === "Sale" &&
            self.findIndex((t) => t.invoice_no === item.invoice_no) === index
        );

        setTimeout(() => {
          setRows(filteredRows);
          setAllCustomer(filteredRows);
          setFixData([...new Set(filteredRows)]);
          setIsLoading(false);
        }, 500);

        console.log(datas_getAllTranscatioData);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
    setSelected(false);
    setDate("");
    setCustomerName("");
  };

  const handlePayment = () => {
    const fetchData = async () => {
      try {
        const response_getAllPamentType = await axiosInstance.get(
          "/paymenttypes/getAll"
        );

        const datas_getAllPamentType = response_getAllPamentType.data;
        const product_getdatas_getAllPamentType = datas_getAllPamentType.map(
          ({ payment_type: actualValue }) => actualValue
        );

        setPayment([...new Set(product_getdatas_getAllPamentType)]);
        console.log(datas_getAllPamentType);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the function
    fetchData();
  };

  useEffect(() => {
    handlePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handelUpdate = async (event) => {
  //   if (event.detail > 1) {
  //     return;
  //   }
  //   if (!selected) {
  //     toast.warning("Please Selected a Row");
  //     return;
  //   }

  //   const Paid = parseFloat(paid) + parseFloat(due);
  //   try {
  //     const response = await axiosInstance.put(
  //       `/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=${selected}&paid=${Paid}`
  //     );
  //     console.log(response);
  //     if (response.status === 200) {
  //       toast.success("Successfully Cutomer Info Updateded.");
  //       setSelected("");
  //       handleShowAll();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  console.log("paid", paid, "due", due);

  // http://194.233.87.22:5004/api/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=&paid=
  const handelDueUpdate = async (event) => {
    if (event.detail > 1) {
      return;
    }

    if (!selected) {
      toast.warning("Please Selected a Row");
      return;
    }

    if (due === 0) {
      toast.warning("Already Paid");
      return;
    }

    const duePaymnet = paid + due;

    try {
      const response = await axiosInstance.put(
        `/transactionsRouter/updateTransactionPaidFromAnyPageByID?transaction_id=${selected}&paid=${duePaymnet}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Successfully Due Paid.");
        setSelected(false);
        handleShowAll();
        handleReset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // All Permanent customer show in clai

  //Customer search

  const handleSearchCustomer = (e) => {
    if (!customerName) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.warning("Contributor Name Required");
      }
      return;
    }
    const results = fixData.filter((item) =>
      item.ContributorName
        ? item.ContributorName.contributor_name
            .toLowerCase()
            .includes(customerName.toLowerCase())
        : ""
    );
    if (results.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input data not valid");
    }
    setRows(results);
  };

  // Filter Date Search
  const handleFilterDate = () => {
    if (!date) {
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

    if (filterData.length === 0) {
      // Show a toast message indicating that the input data is not valid
      toast.error("Input date not valid");
    }

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
          .reduce((total, item) => {
            const amount = parseFloat(item.amount) || 0;
            const discount = parseFloat(item.discount) || 0;
            const itemTotal = amount + discount;
            total += itemTotal;
            return total;
          }, 0)
          .toFixed(2)
      : 0;

  const totalDue = totalAmount - totalPaid;

  const handleReset = () => {
    setSelected(false);
    setCustomer("");
    setID("");
    setMobile("");
    setAmount("");
    setPaid("");
    setCurrentDate("");
    setpayment_type_id("");
    setCollection("");
    setTranstion("");
    setInvoice("");
    setProductTrance("");
    setBardId("");
    setQuantity_no("");
    setunit_id("");
    setwarranty("");
    settax_id("");
    setauthorized_by_id("");
    setoperation_type_id("");
    setother_cost("");
    setshop_name_id("");
    setoperation_type_id("");
    setpurchase_price("");
    setsale_price("");
    setdiscount("");
    setcomment("");
    setDue("");
  };

  const handleInputInfield = (item) => {
    setSelected(item.transaction_id);
    setCustomer(
      item.ContributorName ? item.ContributorName.contributor_name : ""
    );
    setID(item.invoice_no);
    setMobile(item.ContributorName ? item.ContributorName.mobile : "");
    setAmount(item.amount);
    setPaid(item.paid);
    setCurrentDate(item.date ? item.date.split("T")[0] : "");
    setpayment_type_id(item.PaymentType ? item.PaymentType.payment_type : "");
    setCollection(employee);
    setTranstion(item.transaction_id);
    setInvoice(item.invoice_no);
    setProductTrance(item.product_trace_id);
    setBardId(item.brand_id);
    setQuantity_no(item.quantity_no);
    setunit_id(item.unit_id);
    setwarranty(item.warranty);
    settax_id(item.tax_id);
    setauthorized_by_id(item.authorized_by_id);
    setoperation_type_id(item.operation_type_id);
    setother_cost(item.other_cost);
    setshop_name_id(item.shop_name_id);
    setoperation_type_id(item.operation_type_id);
    setpurchase_price(item.purchase_price);
    setsale_price(item.sale_price);
    setdiscount(item.discount);
    setcomment(item.comment);
    setDue(parseFloat(item.amount) - parseFloat(item.paid));
  };

  console.log("tans", transaction_id);

  //========= deleteTransection================

  return (
    <div className="full_row_div_supershop_customer_report">
      <ToastContainer stacked autoClose={1000} />
      <div className="container_div_supershop_customer_report">
        <div className="container_serach_supershop_customer_report_column1">
          <span>This Feature Work Only for Permanent Customer</span>
          <div className="container_input_field_supershop_customer_report">
            <div className="input_field_supershop_customer_report">
              <label>Customer Name</label>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                list="customername"
              />
              <datalist id="customername">
                {allCustomer.length > 0 &&
                  allCustomer.map((items, index) => {
                    return (
                      <option key={index}>
                        {items.ContributorName.contributor_name}
                      </option>
                    );
                  })}
              </datalist>
              <button onClick={handleSearchCustomer}>Search</button>
            </div>
            <div className="input_field_supershop_customer_report">
              <label>Date</label>
              <input
                type="date"
                onChange={(event) => setDate(event.target.value)}
                value={date}
              />
              <button onClick={handleFilterDate}>Search</button>
            </div>
          </div>
        </div>
        <div className="container_serach_supershop_customer_report_column2">
          <div className="container_button_supershop_customer_report">
            <button onClick={handleShowAll}>
              <MdPreview />
            </button>
            <span>Show All</span>
          </div>
          <div className="container_button_supershop_customer_report">
            <ExcelExport
              excelData={rows}
              fileName={"CutomerTranscationReport"}
            />
          </div>
        </div>
      </div>
      <div className="second_div_supershop_customer_report">
        {isLoading ? (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        ) : (
          <div className="container_table_supershop_customer_report">
            <table>
              <tr>
                <th>Invoice</th>
                <th>Customer Name</th>
                <th>Mobile</th>
                <th>Address</th>

                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Sale Date</th>
                <th>Collection By</th>
                <th>Payment Type</th>
                <th>Shop Name</th>
              </tr>
              <tbody>
                {rows.length > 0 &&
                  rows.map((item) => (
                    <tr
                      key={item.transaction_id}
                      onClick={() => handleInputInfield(item)}
                      className={
                        selected === item.transaction_id
                          ? "rows selected"
                          : "rows"
                      }
                      tabindex="0"
                    >
                      <td className="cutomertr-selected">{item.invoice_no}</td>
                      <td className="cutomertr-selected">
                        {item.ContributorName
                          ? item.ContributorName.contributor_name
                          : ""}
                      </td>
                      <td className="cutomertr-selected">
                        {item.ContributorName
                          ? item.ContributorName.mobile
                          : ""}
                      </td>
                      <td className="cutomertr-selected">
                        {item.ContributorName
                          ? item.ContributorName.address
                          : ""}
                      </td>
                      <td className="cutomertr-selected">{item.amount}</td>
                      <td className="cutomertr-selected">{item.paid}</td>
                      <td className="cutomertr-selected">
                        {(parseInt(
                          item.amount !== undefined &&
                            item.amount !== null &&
                            item.amount !== ""
                        )
                          ? 0
                          : item.amount) -
                          (parseInt(
                            item.paid !== undefined &&
                              item.paid !== null &&
                              item.paid !== ""
                          )
                            ? 0
                            : item.paid)}
                      </td>
                      <td className="cutomertr-selected">
                        {item.date ? item.date.split("T")[0] : ""}
                      </td>
                      <td className="cutomertr-selected">{employee}</td>
                      <td className="cutomertr-selected">
                        {item.PaymentType ? item.PaymentType.payment_type : ""}
                      </td>
                      <td className="cutomertr-selected">
                        {item.ShopName ? item.ShopName.shop_name : ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="third_div_supershop_customer_report">
        <div className="container_div_view_update_supershop_customer_report">
          <div className="container_view_supershop_customer_report">
            <div className="input_field_supershop_customer_report">
              <label>Total</label>
              <input
                style={{
                  fontWeight: "bold",
                  fontSize: "1vw",
                  textAlign: "center",
                }}
                value={totalAmount}
                disabled
              />
            </div>
            <div className="input_field_supershop_customer_report">
              <label>Paid</label>
              <input
                style={{
                  fontWeight: "bold",
                  fontSize: "1vw",
                  textAlign: "center",
                }}
                value={totalPaid}
                disabled
              />
            </div>
            <div className="input_field_supershop_customer_report">
              <label>Total Due</label>
              <input
                style={{
                  fontWeight: "bold",
                  fontSize: "1vw",
                  textAlign: "center",
                }}
                value={totalDue}
                disabled
              />
            </div>
          </div>
          <div className="container_update_supershop_customer_report">
            <div className="container_update_supershop_customer_report_column1">
              <div className="input_field_supershop_customer_report">
                <label>Cutomer Name</label>
                <input
                  value={customer}
                  disabled
                  onChange={(event) => setCustomer(event.target.value)}
                />
              </div>
              <div className="input_field_supershop_customer_report">
                <label>Invoice No</label>
                <input
                  value={contributor_name_id}
                  disabled
                  onChange={(event) => setID(event.target.value)}
                />
              </div>
              <div className="input_field_supershop_customer_report">
                <label>Mobile</label>
                <input
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="container_update_supershop_customer_report_column2">
              <div className="input_field_supershop_customer_report">
                <label>Total</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled
                />
              </div>
              <div className="input_field_supershop_customer_report">
                <label>Paid</label>
                <input
                  type="number"
                  value={paid}
                  onChange={(event) => setPaid(event.target.value)}
                  disabled
                />
              </div>

              <div className="input_field_supershop_customer_report">
                <label>Date</label>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(event) => setCurrentDate(event.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="container_update_supershop_customer_report_column3">
              <div className="input_field_supershop_customer_report">
                <label>Payment Type</label>
                <input
                  value={payment_type_id}
                  onChange={(event) => setpayment_type_id(event.target.value)}
                  disabled
                  list="payment"
                />
                <datalist id="payment">
                  {payment &&
                    payment.map((items, index) => {
                      return <option key={index}>{items}</option>;
                    })}
                </datalist>
              </div>
              <div className="input_field_supershop_customer_report">
                <label>Collection By</label>
                <input
                  value={employee_id}
                  onChange={(event) => setCollection(event.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="container_update_supershop_customer_report_column4">
              <div className="container_button_supershop_customer_report">
                <button onClick={handleReset}>
                  <BiReset />
                </button>
                <span>Reset</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container_due_paid_supershop_customer_report">
          <span>Customer Due Payment</span>
          <div className="input_field_supershop_customer_report">
            <label>Due Payment</label>
            <input
              type="number"
              style={{ width: "8vw" }}
              value={due}
              onChange={(evet) => setDue(evet.target.value)}
            />
          </div>
          <div className="container_saparate_button_customer_report">
            <div className="container_button_supershop_customer_report extra-class-button">
              <button onClick={handelDueUpdate}>
                <IoIosSave />
              </button>
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTranscationReport;
