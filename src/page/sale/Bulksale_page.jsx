import React from "react";
import "./bulksale_page.css";
import { Button, Modal } from "antd";
import { useState, useEffect, useRef } from "react";
import Invoice from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import Save from "../../image/Save.png";
import { useReactToPrint } from "react-to-print";
import { PosInvoice } from "../../components/Pos.js";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import XltoJsonConvert from "../../components/XltoJsonConvert/XltoJsonConvert.jsx";

const BulksalePage = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });
  const storedData = localStorage.getItem("formattedStock");

  const formattedStock = JSON.parse(storedData);

  // Use the formattedStock array here

  const today = new Date();
  const formattedDate = today.toISOString();

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const Employee = localStorage.getItem("username");
  const [contributor_name, setContributorName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [shopNameData, setShopNAmeData] = useState([]);
  // const [Employee, setEmployee] = useState("");
  const [payment_id, setPaymentId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [paid, setPaid] = useState("");
  const [due, setDue] = useState("");
  const [discount, setDiscount] = useState(0);
  const [netTotal, setNetTotal] = useState([]);
  const [data, setData] = useState([]);
  const [saleTransactionData, setSaleTransactionData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [VAT, setVAT] = useState(0);
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [customerData, setCustomer] = useState([]);
  const [VatData, setVatData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [saveData, setSaveData] = useState([]);
  const [vatID, setVatID] = useState("");
  const [saleData, setsaleData] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [contributorNameError, setcontributorNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  //multi customer state:
  const [allCustomer, setAllCustomer] = useState([]);
  const [isRequireCustomer, setResquireCustomer] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [aviable, setAviable] = useState([]);
  // const [rowDeleteModal, setRowDeltemodal] = useState(false)
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  useEffect(() => {
    document.title = "Sale Page";
    if (paymentTypeData && paymentTypeData.length > 0) {
      const cashPayment = paymentTypeData.find(
        (data) => data.payment_type === "Cash"
      );
      if (cashPayment) {
        setPaymentId(cashPayment.payment_type_id);
      }
    }
  }, [paymentTypeData]);

  // handle data fatch
  const handleDataFetch = async () => {
    try {
      // Make an HTTP GET request using axiosInstance
      const response = await axiosInstance.get(
        "/transactionsRouter/getAllTransactions"
      );

      const filteredPurchaseTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Purchase"
      );
      const filteredSaleTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Sale"
      );

      setData(filteredPurchaseTransactions);
      setSaleTransactionData(filteredSaleTransactions);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/paymenttypes/getAll");
      setPaymentTypeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCustomerData = async () => {
    try {
      const response = await axiosInstance.get("/contributorname/getAll");

      const filteredData = response.data.filter(
        (item) => item.contributor_type_id === 1
      );

      setCustomer(filteredData);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchShop = async () => {
    try {
      const response = await axiosInstance.get("/shopname/getAll");

      setShopNAmeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchVatData = async () => {
    try {
      const response = await axiosInstance.get("/tax/getAll");

      setVatData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateInvoiceNumber = () => {
    const validInvoiceNumbers = saleTransactionData
      .map((item) => parseFloat(item.invoice_no))
      .filter((number) => !isNaN(number));
    console.log(validInvoiceNumbers);
    if (validInvoiceNumbers.length === 0) {
      setInvoice(1);
    } else {
      const maxInvoiceNumber = Math.max(...validInvoiceNumbers);
      console.log(maxInvoiceNumber);
      setInvoice(maxInvoiceNumber + 1);
    }
  };
  useEffect(() => {
    // Check if data has changed and generate invoice number accordingly
    if (data.length > 0) {
      generateInvoiceNumber();
    }
  }, [data.length, generateInvoiceNumber, saleTransactionData]);

  console.log("invoice", invoice);
  useEffect(() => {
    handleDataFetch();
    fetchData();
    fetchCustomerData();
    fetchShop();
    fetchVatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customerName) {
      const result = customerData.find(
        (item) => item.contributor_name === customerName
      );
      if (result) {
        setCustomerID(result.contributor_name_id);
        setCustomerAddress(result.address);
        setCustomerPhone(result.mobile);
      } else {
        setCustomerID("");
        setCustomerAddress("");
        setCustomerPhone("");
      }
    }
  }, [customerName, customerData]);

  // Pop Up Window
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const initialItems = Array.from({ length: 1 }, () => ({
    itemCode: "",
    product_name: "",
    product_type: "",
    sale_price: "",
    quantity: "",
    itemTotal: "",
    unit: "",
    product_trace_id: "",
    unit_id: "",
    purchase_price: "",
  }));

  const [items, setItems] = useState(initialItems);

  const inputRefs = useRef([]);

  // Function to add a new row with refs
  const addRowRefs = () => {
    inputRefs.current.push(
      Array.from({ length: items.length }, () => React.createRef())
    );
  };
  useEffect(() => {
    // Focus on the first input field of the first row when the component mounts
    if (inputRefs.current[0] && inputRefs.current[0][0]?.current) {
      inputRefs.current[0][0].current.focus();
    }
  }, []);
  // Call addRowRefs function whenever you need to add a new row
  addRowRefs();
  const handleKeyPress = (event, rowIndex, colIndex) => {
    if (event.key === "Enter") {
      // Handle Enter key press
      event.preventDefault();

      if (
        rowIndex === items.length - 1 &&
        items[rowIndex].itemTotal !== "" &&
        items[rowIndex].unit !== ""
      ) {
        // Add a new row
        setItems([
          ...items,
          {
            itemCode: "",
            product_name: "",
            product_type: "",
            sale_price: "",
            quantity: "",
            itemTotal: "",
            unit: "",
            product_trace_id: "",
            unit_id: "",
            purchase_price: "",
          },
        ]);

        // Focus on the first input field of the newly added row
        setTimeout(() => {
          const nextRowIndex = rowIndex + 1;
          const nextRowInputField = inputRefs.current[nextRowIndex][0].current;
          if (nextRowInputField) {
            nextRowInputField.focus(); // Focus on the input field of the next row
          }
        });
      } else if (colIndex < 6) {
        // Move focus to the next input field in the same row
        setTimeout(() => {
          if (
            inputRefs.current[rowIndex] &&
            inputRefs.current[rowIndex][colIndex + 1]?.current
          ) {
            inputRefs.current[rowIndex][colIndex + 1].current.focus();
          }
        });
      }
    } else if (event.key === "Delete") {
      // Handle Delete key press
      event.preventDefault();

      // Check if the current row index is greater than 0
      if (rowIndex > 0) {
        // Confirm deletion
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this row?"
        );
        if (confirmDelete) {
          // Delete the current row
          const updatedItems = items.filter(
            (item, index) => index !== rowIndex
          );
          setItems(updatedItems);
        }
      }
    }
  };

  const getFieldName = (index) => {
    switch (index) {
      case 0:
        return "itemCode";
      case 1:
        return "product_name";
      case 2:
        return "product_type";
      case 3:
        return "sale_price";
      case 4:
        return "quantity";
      case 5:
        return "itemTotal";
      case 6:
        return "unit";
      default:
        return "";
    }
  };

  const totalAmount =
    items && items.length > 0
      ? items.reduce((total, item) => {
          const salePrice = parseFloat(item.sale_price) || 0;
          const quantity = parseFloat(item.quantity) || 0;
          const itemTotal = salePrice * quantity;
          total += itemTotal;
          return total;
        }, 0)
      : 0;

  const discountAmount = totalAmount * (parseFloat(discount) / 100);
  const totalWithDiscount =
    Math.round(totalAmount - discountAmount) || totalAmount;

  useEffect(() => {
    if (VAT && totalWithDiscount) {
      const vatAmount = totalWithDiscount * (VAT / 100);
      const totalWithVAT = Math.round(totalWithDiscount + vatAmount);
      setNetTotal(totalWithVAT);
    } else {
      setNetTotal(totalWithDiscount);
    }
  }, [VAT, totalWithDiscount]);

  const handlePaidChange = (e) => {
    const newPaid = parseFloat(e.target.value);

    // Return early if netTotal is empty or not defined
    if (netTotal === 0) {
      toast.dismiss();
      // Show a new toast
      toast.warning("Due amount cannot exceed Net Total", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });

      return;
    }

    if (newPaid < 0) {
      toast.dismiss();
      // Show a new toast
      toast.warning("Due amount cannot be negative.", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });
    } else if (newPaid > netTotal) {
      toast.dismiss();
      // Show a new toast
      toast.warning("Due amount cannot exceed Net Total.", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });
    } else {
      setPaid(newPaid);
    }
  };

  useEffect(() => {
    if (paid) {
      const dueAmount = parseFloat(netTotal) - parseFloat(paid);
      setDue(dueAmount);
    } else {
      setDue(netTotal);
    }
  }, [due, netTotal, paid]);

  const handleReset = () => {
    setItems([
      {
        itemCode: "",
        product_name: "",
        product_type: "",
        sale_price: "",
        quantity: "",
        itemTotal: "",
        unit: "",
        product_trace_id: "",
        unit_id: "",
        purchase_price: "",
      },
    ]);

    setCustomerName("");
    setDiscount("");
    setVAT(0);
    setPaid("");
    setPaymentId("");
    setsaleData([]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // ===============================================handleSave================================================
  const handleSave = async (event) => {
    if (event.detail > 1) {
      return;
    }
    const bulkTransaction = [];
    if (allCustomer.length > 0) {
      allCustomer.forEach((c, index) => {
        const newTransactions = items
          .filter((item) =>
            Object.values(item).some((val) => val !== "" && val !== null)
          )
          .map((item) => ({
            invoice_no: invoice + index,
            contributor_name: c.contributor_name,
            address: c.address,
            mobile: c.mobile,
            contributor_type_id: 1,

            product_trace_id: item.product_trace_id,
            quantity_no: item.quantity,
            unit_id: item.unit_id || null,
            warranty: "None",
            tax_id: vatID || null,
            amount: netTotal,
            authorized_by_id: 1,
            contributor_name_id: customerID || null,
            operation_type_id: 1,
            date: formattedDate,
            payment_type_id: payment_id || null,
            shop_name_id:
              shopNameData.map((data) => data?.shop_name_id) || null,
            paid: paid || 0,
            employee_id: Employee || "none",
            sale_price: item.sale_price,
            discount: "0",
            purchase_price: item.purchase_price,
          }));
        bulkTransaction.push(...newTransactions);
      });
      console.log("bulkTransaction", bulkTransaction);
    }

    setFixData(items);
    if (netTotal === 0) {
      toast.dismiss();

      // Show a new toast
      toast.warning("Please fill all required fields before Save the item.", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });

      return;
    }
    if (allCustomer.length === 0) {
      toast.dismiss();

      // Show a new toast
      toast.warning("Customer is empty!.", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });
      setResquireCustomer(true);
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/transactionsRouter/postTransactionFromAnyPageBulk",
        bulkTransaction,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        handleDataFetch();
        generateInvoiceNumber();
        handlePrint();
        handleReset();
        toast.dismiss();
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data. Please try again later.");
      handleReset();
    }
  };

  const handleCustomerSave = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (contributor_name === "" && (address === "") & (mobile === "")) {
      setcontributorNameError("Can't leave empty field");
      setAddressError("Can't leave empty field");
      setMobileError("Can't leave empty field");
      return;
    }
    if (contributor_name === "") {
      setcontributorNameError("Can't leave empty field");

      return;
    }
    if (address === "") {
      setAddressError("Can't leave empty field");
      return;
    }
    if (mobile === "") {
      setMobileError("Can't leave empty field");
      return;
    }
    const contributor_type_id = 1;

    try {
      const response = await axiosInstance.post(
        "/contributorname/postContributorNameFromAnyPage",
        { contributor_name, address, mobile, contributor_type_id }
      );
      if (response.status === 200) {
        setContributorName("");
        setAddress("");
        setMobile("");
        fetchCustomerData();
        toast.success("Customer Add successfully!");
      } else {
        toast.error("Failed to save Supplier");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };

  useEffect(() => {
    const filteredData = VatData.find((item) => item.rate === VAT);
    setVatID(filteredData?.tax_id);
  }, [VatData, VAT]);

  // const due = parseFloat(netTotal) - parseFloat(paid) || 0;

  const getCustomerInfo = (value) => {
    setAllCustomer(value);
  };
  console.log("allCustomer", allCustomer);
  return (
    <div className="full_div_super_shop_sale">
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="frist_row_div_supershop_sale"></div>
      <div className="second_row_div_supershop_sale">
        <div className="container_table_supershop_sale">
          <table border={1} cellSpacing={2} cellPadding={10}>
            <thead>
              <tr>
                <th>BarCode*</th>
                <th>Product Name*</th>
                <th>Product Type</th>
                <th>Sale Price*</th>
                <th>Quantity*</th>
                <th>Item Total*</th>
                <th>Unit*</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(item)
                    .slice(0, 7)
                    .map((fieldName, colIndex) => (
                      <td key={colIndex}>
                        <input
                          type="text"
                          className="table_input_field"
                          ref={inputRefs.current[rowIndex][colIndex]}
                          list={
                            getFieldName(colIndex) === "sale_price"
                              ? `sale_prices_${rowIndex}`
                              : ""
                          }
                          value={item[fieldName]}
                          readOnly={
                            ![0, 3, 4].includes(colIndex) // Make fields read-only if not Barcode, Sale Price, or quantity
                          }
                          style={{
                            backgroundColor: ![0, 4, 3].includes(colIndex)
                              ? "white"
                              : "", // Set background color to white for read-only fields
                          }}
                          onChange={(e) => {
                            const { value } = e.target;
                            const updatedItems = [...items];
                            updatedItems[rowIndex][fieldName] = value;

                            if (fieldName === "itemCode") {
                              const matchedProduct = [...data]
                                .reverse()
                                .find(
                                  (product) =>
                                    product.ProductTrace &&
                                    product.ProductTrace.product_code === value
                                );

                              if (matchedProduct) {
                                const saleData = data.filter(
                                  (product) =>
                                    product.ProductTrace &&
                                    product.ProductTrace.product_code === value
                                );
                                setsaleData(saleData);
                                const Aviablequantity = formattedStock.find(
                                  (data) =>
                                    data.ProductCode ===
                                    updatedItems[rowIndex]["itemCode"]
                                );

                                setAviable(Aviablequantity);

                                console.log("j", Aviablequantity);
                                updatedItems[rowIndex]["product_name"] =
                                  matchedProduct.ProductTrace?.name;
                                updatedItems[rowIndex]["product_type"] =
                                  matchedProduct.ProductTrace?.type;
                                updatedItems[rowIndex]["sale_price"] =
                                  matchedProduct.sale_price;
                                updatedItems[rowIndex]["purchase_price"] =
                                  matchedProduct.purchase_price;
                                updatedItems[rowIndex]["unit"] =
                                  matchedProduct.Unit?.unit;
                                updatedItems[rowIndex]["unit_id"] =
                                  matchedProduct.Unit?.unit_id;
                                updatedItems[rowIndex]["product_trace_id"] =
                                  matchedProduct.ProductTrace?.product_trace_id;
                              } else {
                                updatedItems[rowIndex]["product_name"] = "";
                                updatedItems[rowIndex]["product_type"] = "";
                                updatedItems[rowIndex]["sale_price"] = "";
                                updatedItems[rowIndex]["unit"] = "";
                                updatedItems[rowIndex]["quantity"] = "";
                                updatedItems[rowIndex]["purchase_price"] = "";
                                setPaid("");
                                setsaleData([]);
                              }
                            }

                            const salePrice = parseFloat(
                              updatedItems[rowIndex]["sale_price"]
                            ).toFixed(2);
                            const quantity = parseFloat(
                              updatedItems[rowIndex]["quantity"]
                            ).toFixed(2);

                            updatedItems[rowIndex]["itemTotal"] =
                              isNaN(salePrice) || isNaN(quantity)
                                ? ""
                                : salePrice * quantity;
                            setItems(updatedItems);
                          }}
                          onKeyDown={(e) =>
                            handleKeyPress(e, rowIndex, colIndex)
                          }
                        />
                        {fieldName === "sale_price" && (
                          <datalist id={`sale_prices_${rowIndex}`}>
                            {/* Populate options with sale prices for the scanned product */}
                            {saleData.map((product) => (
                              <option
                                key={product.product_trace_id}
                                value={product.sale_price}
                              />
                            ))}
                          </datalist>
                        )}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="third_row_div_supershop_sale">
        <div className="container_buttom_full_div">
          {/* /================/my work start here============================= */}
          <div className="container_div_view_customer_supershop_sale">
            <div className="customer_setup_supershop_sale">
              <div className="customer_setup_supershop_sale_box">
                <div className="container_excel_div">
                  <XltoJsonConvert getCustomerInfo={getCustomerInfo} />
                </div>

                {/* <div className="membership_customer">
                  Permament Customer
                  <input
                    type="checkbox"
                    onChange={(e) => setCheckBox(e.target.checked)}
                  />
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    list="list_customer"
                    disabled={checkbox ? false : true}
                  />
                  <datalist id="list_customer">
                    {checkbox &&
                      customerData.length > 0 &&
                      customerData.map((customer, index) => {
                        return (
                          <option key={index} value={customer.contributor_name}>
                            {customer.contributor_name}
                          </option>
                        );
                      })}
                  </datalist>
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    style={{ width: "8vw" }}
                    value={customerID}
                    disabled={checkbox ? false : true}
                  />
                  <Button style={{ width: "3.5vw" }} onClick={showModal}>
                    +
                  </Button>
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    disabled={checkbox ? false : true}
                  />
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Address</label>
                  <input
                    type="text"
                    value={customerAddress}
                    disabled={checkbox ? false : true}
                  />
                </div> */}
              </div>
            </div>
          </div>

          <div className="container_shadow_extra">
            <div className="container_input_field_box_supershop_sale">
              <div className="">
                <div className="input_field_bottom_supershop_sale">
                  <label>Payment Type*</label>

                  <select
                    value={payment_id}
                    onChange={(e) => setPaymentId(e.target.value)}
                  >
                    {paymentTypeData &&
                      paymentTypeData.map((data) => (
                        <option
                          key={data.payment_type_id}
                          value={data.payment_type_id}
                        >
                          {data.payment_type}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Current Date*</label>
                  <input
                    value={currentDate}
                    className="date_input_sale_page"
                    type="date"
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Shop Name</label>

                  <input
                    type="text"
                    value={shopNameData.map((data) => data.shop_name)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Employee </label>
                  <input type="text" value={Employee} />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Total</label>
                  <input type="number" value={totalAmount} />
                </div>
              </div>
              <div className="container_div_saparator_supershop_sale_column2">
                <div className="input_field_bottom_supershop_sale">
                  <label>Discount</label>
                  <input
                    type="number"
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Vat</label>
                  <select
                    value={VAT}
                    type="number"
                    onChange={(e) => setVAT(e.target.value)}
                  >
                    {VatData.length > 0 &&
                      VatData.map((vat) => {
                        return (
                          <option key={vat.tax_id} value={vat.rate}>
                            {vat.rate}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Net Total</label>
                  <input type="number" value={netTotal} name="" id="" />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Paid</label>
                  <input
                    type="number"
                    value={paid}
                    onChange={handlePaidChange}
                    required
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Due</label>
                  <input
                    type="number"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                  />
                </div>
              </div>
              <div className="container_billing_supershop_sale">
                <div className="button-shadow-supershop-sale">
                  <div style={{ display: "none" }}>
                    <PosInvoice
                      ref={componentRef}
                      discount={discount}
                      VAT={VAT}
                      fixData={fixData}
                      netTotal={netTotal}
                      paid={paid}
                    />
                  </div>
                  <button
                    className="billing_button_supershop_sale"
                    onClick={handleSave}
                  >
                    <img src={Invoice} alt="billing" />
                  </button>
                </div>
                <span>Invoice</span>
              </div>
              <div className="container_billing_supershop_sale">
                <div className="button-shadow-supershop-sale">
                  <button
                    className="billing_button_supershop_sale"
                    style={{ cursor: "pointer" }}
                    onClick={handleReset}
                  >
                    <img src={reset} alt="billing" />
                  </button>
                </div>
                <span>Reset</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="popup-window_supershop">
        <Modal
          title="Add MemberShip Customer"
          open={isModalOpen}
          onCancel={handleCancel}
          width={500}
          height={800}
          footer={null}
          style={{
            top: 46,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="container_permanent_supplier_supershop">
            <div className="first_row_div_permanent_supplier_supershop">
              <div className="container_search_permanent_supplier_supershop">
                <div className="container_separate_permanent_supplier_supershop">
                  <div>
                    <div className="search_permanent_supplier_supershop">
                      <div className="search_permanent_supplier_supershop_column1">
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Customer Name</label>
                          <input
                            type="text"
                            value={contributor_name}
                            onChange={(e) => setContributorName(e.target.value)}
                            style={{
                              borderColor:
                                contributorNameError && contributor_name === ""
                                  ? "red"
                                  : "",
                            }}
                          />
                          <div className="error_message_customer">
                            {contributorNameError && contributor_name === ""
                              ? contributorNameError
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="search_permanent_supplier_supershop_column2">
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Mobile</label>
                          <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            style={{
                              borderColor:
                                mobileError && mobile === "" ? "red" : "",
                            }}
                          />
                          <div className="error_message_customer">
                            {mobileError && mobile === "" ? mobileError : ""}
                          </div>
                        </div>
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                              borderColor:
                                addressError && address === "" ? "red" : "",
                            }}
                          />
                          <div className="error_message_customer">
                            {addressError && address === "" ? addressError : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handleCustomerSave}
                      >
                        <img src={Save} alt="" />
                      </button>
                      Save
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="second_row_modal">
              <div className="table_div_modal">
                <table border={1} cellSpacing={1} cellPadding={2}>
                  <tr>
                    <th style={Color}>Customer Id</th>
                    <th style={Color}>Name</th>
                    <th style={Color}>Mobile</th>
                    <th style={Color}>Address</th>
                  </tr>
                  {customerData &&
                    customerData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.contributor_name}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                      </tr>
                    ))}
                </table>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {/* <div className="deleteModal_container">
          <Modal
            title={null}
            open={rowDeleteModal}
            onCancel={() => setRowDeltemodal(false)}
            footer={null}
            closable={false}
            styles={{ padding: 0, margin: 0 }}
            style={{
              top: 150,
              bottom: 0,
              left: 120,
              right: 0,
              maxWidth:  "24%" ,
              minWidth: "16%" ,
              height: "2vh",
            }}
          >
           
              <div className="rackDeleteModal">
                <div className="delete_modal">
                  <div className="delete_modal_box">
                    <p className="delete_popup_text">
                      Are you sure to delete this rack?
                    </p>
                    <p className="delete_popup_revert_text">
                      You won't be able to revert this!
                    </p>

                    <div className="delete_modal_btn_div">
                      <button
                        className="delete_modal_buttonCancel"
                        onClick={() => {
                          setRowDeltemodal(false);
                          
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRowDelete}
                        className="delete_modal_buttoDelete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            
            
          </Modal>
        </div> */}
    </div>
  );
};

export default BulksalePage;
