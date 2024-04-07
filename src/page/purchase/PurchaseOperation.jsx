/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./purchases_operation.css";
import { FcPrint } from "react-icons/fc";
import { FaCartPlus } from "react-icons/fa";
import Save from "../../image/Save.png";
import { Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import reset from "../../image/reset.png";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/PurchaseInvoice";

const PurchaseOperation = () => {
  const [category, setcategory] = useState("");
  const [product_code, setProductCode] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_type, setProductType] = useState("");
  const [brand, setBrand] = useState("");
  const [brandID, setBrandID] = useState("");
  const [brand_name, setBrand_name] = useState("");
  const [purchase_price, setPurchasePrice] = useState("");
  const [sale_price, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitName, setUnitName] = useState("pcs");
  const [unitID, setUnitId] = useState("");
  const [unit, setUnit] = useState("");
  const [warranty, setWarranty] = useState("");
  const [discount, setDiscount] = useState("");
  const [todayDate, setTodayDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [saveData, setSaveData] = useState([]);
  const [shopNameData, setShopNAmeData] = useState([]);

  const [supplierName, setSupplierName] = useState("");
  const [supplierNameID, setSupplierNameID] = useState("");
  const [Supplieraddress, setSupplierAddress] = useState("");
  const [Suppliermobile, setSupplierMobile] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [contributor_name, setContributorName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [visible, setVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [unitvisible, setUnitVisible] = useState(false);
  const [vatVisible, setVatVisible] = useState(false);

  const [transactionData, setTransactionData] = useState([]);
  const [VatData, setVatData] = useState([]);
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [data, setData] = useState([]);
  const [produtData, setProductData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [tableData, setTabledata] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [NettotalAmount, setNetTotalAmount] = useState("");

  const [vat, setVat] = useState(0);
  const [vatID, setVatID] = useState("");
  const [rate, setRate] = useState("");
  const [paid, setPaid] = useState("");
  const [ischecked, setIschecked] = useState(false);
  const [error, setError] = useState("");
  const [SupplierError, setSupplierError] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [brandError, setBrandError] = useState("");
  const [vatError, setVatError] = useState("");
  const [unitError, setunitError] = useState("");
  const [invoice, setInvoice] = useState("");
  const [product_trace_id, setProductTraceId] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [payment_id, setPaymentId] = useState("");
  const [productFetchData, setProductFetchData] = useState([]);
  const [duePaid, setDuePaid] = useState("");
  const componentRef = useRef();
  const [contributorNameError, setcontributorNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [mobileError, setMobileError] = useState("");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  const Employee = localStorage.getItem("username");

  const newWidth = {
    width: "7.vw",
  };

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };

  useEffect(() => {
    document.title = "Purchase Operation";
  });

  const showModal = () => {
    setVisible(true);
  };
  const showBrandModal = () => {
    setBrandVisible(true);
  };
  const ShowUnitModal = () => {
    setUnitVisible(true);
  };
  const showVatModal = () => {
    setVatVisible(true);
  };

  useEffect(() => {
    if (paymentTypeData && paymentTypeData.length > 0) {
      const cashPayment = paymentTypeData.find(
        (data) => data.payment_type === paymentType
      );
      if (cashPayment) {
        setPaymentId(cashPayment.payment_type_id);
      }
    }
  }, [paymentType, paymentTypeData]);

  const today = new Date();
  const formattedDate = today.toISOString();
  const fetchBrandData = async () => {
    try {
      const response = await axiosInstance.get("/brand/getAll");

      setBrandData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDataUnit = async () => {
    try {
      const response = await axiosInstance.get("/unit/getAll");
      setUnitData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSupplierData = async () => {
    try {
      const response = await axiosInstance.get("/contributorname/getAll");
      setData(response.data);
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
  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get("/producttraces/getAll");
      setProductFetchData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDataFetchTransaction = async () => {
    try {
      // Make an HTTP GET request using axiosInstance
      const response = await axiosInstance.get(
        "/transactionsRouter/getAllTransactions"
      );

      const filteredTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Purchase"
      );

      setTransactionData(filteredTransactions);
      console.log(filteredTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    setTodayDate(formattedDate);

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/paymenttypes/getAll");
        setPaymentTypeData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchProductdata = async () => {
      try {
        const response = await axiosInstance.get("/producttraces/getAll");

        setProductData(response.data);
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

    fetchSupplierData();
    fetchData();
    fetchDataUnit();
    fetchProductdata();
    fetchBrandData();
    fetchShop();
    handleDataFetchTransaction();
    fetchVatData();
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredData = VatData && VatData.find((item) => item.rate === vat);
    setVatID(filteredData?.tax_id);
  }, [vat, VatData]);

  useEffect(() => {
    if (brand) {
      const filteredData = brandData.find((item) => item.brand_name === brand);
      setBrandID(filteredData?.brand_id);
      console.log(filteredData?.brand_id);
    }
    const fiterBrand = unitData.find((item) => item.unit === unitName);
    setUnitId(fiterBrand?.unit_id);
  }, [brand, brandData, shopNameData, unitData, unitName]);

  useEffect(() => {
    const filteredData = data.filter((item) => item.contributor_type_id === 2);

    setSupplierData(filteredData);
  }, [data]);

  const handleCancel = () => {
    setVisible(false);
  };
  const handleBrandCancel = () => {
    setBrandVisible(false);
    setBrandError("");
  };
  const handleVatCancel = () => {
    setVatVisible(false);
    setVatError("");
  };
  const handleUnitCancel = () => {
    setUnitVisible(false);
    setunitError("");
  };

  useEffect(() => {
    const handleChangeSupplier = () => {
      const result = data.find(
        (item) => item.contributor_name === supplierName
      );

      if (result) {
        setSupplierNameID(result.contributor_name_id);
        setSupplierAddress(result.address);
        setSupplierMobile(result.mobile);
      } else {
        setSupplierAddress("");
        setSupplierMobile("");
      }
    };
    handleChangeSupplier();
  }, [supplierName, data]);

  useEffect(() => {
    const handleChangeProductCode = () => {
      const result = produtData.find(
        (item) => item.product_code === product_code
      );
      console.log(result);
      if (!ischecked) {
        if (result) {
          setProductTraceId(result.product_trace_id);
          setcategory(result.Category?.category_name);
          setProductName(result.name);
          setProductType(result.type);
        } else {
          setcategory("");
          setProductName("");
          setProductType("");
        }
      }
    };
    handleChangeProductCode();
  }, [product_code, produtData, ischecked]);

  const generateInvoiceNumber = () => {
    const validInvoiceNumbers = transactionData
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
    if (data.length >= 0) {
      generateInvoiceNumber();
    }
  }, [data]);

  console.log("invoice", invoice);

  const itemTotal = parseInt(purchase_price) * parseInt(quantity) || 0;
  const discountAmount = itemTotal * (parseInt(discount) / 100);
  const totalWithDiscount = Math.round(itemTotal - discountAmount) || itemTotal;

  useEffect(() => {
    if (vat && totalAmount) {
      const vatAmount = totalAmount * (vat / 100);
      const totalWithVAT = Math.round(totalAmount + vatAmount);
      setNetTotalAmount(totalWithVAT);
    } else {
      setNetTotalAmount(totalAmount);
    }
  }, [vat, totalAmount]);

  const handleReset = () => {
    setProductCode("");
    setProductName("");
    setProductType("");
    setcategory("");
    setBrand("");
    setPurchasePrice("");
    setQuantity("");
    setUnitName("");
    setDiscount("");
    setSalePrice("");
    setWarranty("");
    setSupplierName("");
    setVat("");
    setPaid("");
    setTabledata([]);
    setSaveData([]);
    setSupplierName("");
    setPaymentType("");
    setVat(0);
  };

  const AddToCart = () => {
    if (
      product_code === "" &&
      purchase_price === "" &&
      quantity === "" &&
      sale_price === ""
    ) {
      setError("Don't leave empty field");
      return;
    }

    if (product_code === "") {
      setError("Don't leave empty field");
      return;
    }
    if (purchase_price === "") {
      setError("Don't leave empty field");
      return;
    }
    if (quantity === "") {
      setError("Don't leave empty field");
      return;
    }
    if (sale_price === "") {
      setError("Don't leave empty field");
      return;
    }

    const newItem = {
      category: category,
      product_code: product_code,
      product_name: product_name,
      product_type: product_type,
      brand_name: brand,
      quantity: quantity,
      unit: unitName,
      purchase_price: purchase_price,
      item_total: itemTotal,
      discount: discount || 0,
      warranty: warranty || "none",
      total: totalWithDiscount,
      salePrice: sale_price,
      unitID: unitID,
      brandId: brandID,
      product_trace_id: product_trace_id,
    };

    setTabledata((prevTableData) => [...prevTableData, newItem]);
    setProductCode("");
    setBrand("");
    setPurchasePrice("");
    setQuantity("");
    setUnitName("pcs");
    setDiscount("");
    setSalePrice("");
    setWarranty("");
  };

  useEffect(() => {
    if (tableData.length > 0) {
      const total = tableData.reduce(
        (accumulator, item) => accumulator + item.total,
        0
      );
      setTotalAmount(parseInt(total, 10));
    } else {
      setTotalAmount(0);
    }
  }, [tableData]);

  useEffect(() => {
    if (paid) {
      setDuePaid(parseInt(NettotalAmount) - parseInt(paid));
    } else {
      setDuePaid(NettotalAmount);
    }
  }, [NettotalAmount, paid]);

  // Math.round(parseInt(NettotalAmount) - parseInt(paid)) || (parseInt(NettotalAmount) - parseInt(paid));

  //all save api

  const handleSave = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (tableData.length === 0 && supplierName === "") {
      setError("Don't leave empty field");
      setSupplierError("Don't leave empty field");
      return;
    }
    if (supplierName === "") {
      setSupplierError("Don't leave empty field");

      return;
    }
    if (paid < 0) {
      toast.dismiss();

      // Show a new toast
      toast.warning("You Can't Paid 0 !", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });
      return;
    }
    const newTransactions = tableData.map((item) => ({
      invoice_no: invoice,
      product_trace_id: item.product_trace_id,
      quantity_no: item.quantity,
      unit_id: item.unitID,
      brand_id: item.brandId || null,
      warranty: item.warranty,
      tax_id: vatID || 0,
      amount: NettotalAmount,
      authorized_by_id: 1,
      contributor_name_id: supplierNameID || null,
      operation_type_id: 2,
      date: formattedDate,
      payment_type_id: payment_id || null,
      paid: paid || 0,
      employee_id: Employee,
      purchase_price: item.purchase_price,
      sale_price: item.salePrice,
      discount: item.discount,
      shop_name_id: 1,
    }));

    try {
      const response = await axiosInstance.post(
        "/transactionsRouter/postTransactionFromAnyPageBulk",
        newTransactions,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        handleDataFetchTransaction();
        generateInvoiceNumber();
        handleReset();

        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data. Please try again later");
    }
  };

  const saveBrandName = async (event) => {
    if (brand_name === "") {
      setBrandError("Can't leave empty field");
      return;
    }
    if (event.detail > 1) {
      return;
    }
    const brandName =
      brandData &&
      brandData.find(
        (item) => item.brand_name.toLowerCase() === brand_name.toLowerCase()
      );
    if (brandName) {
      toast.warning("This Brand is already exist");
      setBrand_name("");
      return;
    }
    try {
      const response = await axiosInstance.post("/brand/postBrandFromAnyPage", {
        brand_name,
      });
      if (response.status === 200) {
        fetchBrandData();
        setBrand_name("");
        toast.success("Brand name saved successfully!");
      } else {
        toast.error("Failed to save brand name");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };

  const handlesaveUnit = async (event) => {
    if (unit === "") {
      setunitError("Can't leave empty field");
      return;
    }
    if (event.detail > 1) {
      return;
    }
    const unitCheck =
      unitData &&
      unitData.find((item) => item.unit.toLowerCase() === unit.toLowerCase());
    if (unitCheck) {
      toast.warning("This Unit is already exist");
      setUnitName("");
      return;
    }
    try {
      const response = await axiosInstance.post("/unit/postUnitFromAnyPage", {
        unit,
      });
      if (response.status === 200) {
        fetchDataUnit();
        setUnit("");
        toast.success("Unit Add successfully!");
      } else {
        toast.error("Failed to save unit ");
      }
    } catch (error) {
      console.error("Error saving Unit :", error);
    }
  };

  const handlesaveVat = async (event) => {
    if (rate === "") {
      setVatError("Can't leave empty field");
      return;
    }
    if (event.detail > 1) {
      return;
    }
    const VatCheck = VatData && VatData.find((item) => item.rate === rate);
    if (VatCheck) {
      toast.warning("This Vat is already exist");
      setRate("");
      return;
    }
    try {
      const response = await axiosInstance.post("/tax/postTaxFromAnyPage", {
        rate,
      });
      if (response.status === 200) {
        fetchVatData();
        setRate("");
        toast.success("Vat Add successfully!");
      } else {
        toast.error("Failed to save Vat");
      }
    } catch (error) {
      console.error("Error saving Vat:", error);
      toast.error("Error saving Vat");
    }
  };
  const handleSaveSupplier = async () => {
    if (setContributorName === "" && setAddress === "" && setMobile === "") {
      toast.warning("Please fill all field");
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
    const contributor_type_id = 2;

    try {
      const response = await axiosInstance.post(
        "/contributorname/postContributorNameFromAnyPage",
        { contributor_name, address, mobile, contributor_type_id }
      );
      if (response.status === 200) {
        fetchSupplierData();
        setContributorName("");
        setAddress("");
        setMobile("");
        toast.success("Supplier Add successfully!");
      } else {
        toast.error("Failed to save Supplier");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };

  const handlePaidChange = (e) => {
    const newPaid = parseFloat(e.target.value);

    if (newPaid > NettotalAmount) {
      toast.dismiss();
      // Show a new toast
      toast.warning("Paid amount cannot exceed Net Total", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });
    } else if (newPaid < 0) {
      toast.dismiss();
      toast.warning("Paid amount cannot Decrease 0", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });
    } else {
      setPaid(newPaid);
    }
  };

  const handleRowClick = (rowIndex) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
      setActiveRowIndex(null); // If already selected, deselect it
    } else {
      newSelectedRows.add(rowIndex); // If not selected, select it
      setActiveRowIndex(rowIndex);
    }
    setSelectedRows(newSelectedRows); // Update selected rows state
  };

  // Function to handle keydown events
  const handleKeyDown = (e) => {
    if (e.key === "Delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this row?"
      );
      if (confirmDelete) {
        const updatedItems = [...tableData];
        updatedItems.splice(selectedRows, 1);
        setTabledata(updatedItems);
        setSelectedRows(new Set());
        setActiveRowIndex(null); // Clear selected rows after deletion
      }
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Remove event listener when component unmounts
    };
  }, [tableData, selectedRows, handleKeyDown]);
  return (
    <>
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="full_div">
        <div className="first_row_div">
          <div className="invisible_div">
            <div className="input_field_purchase_first_column">
              <div className="input_field_purchase">
                <div className="purchases_input">
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Product Code*
                    </label>
                    <div className="error_handle_input">
                      <input
                        type="text"
                        onChange={(e) => {
                          setProductCode(e.target.value);
                          setError("");
                        }}
                        value={product_code}
                        className="input_field_supershop_purchase_long"
                        style={{
                          borderColor:
                            error && product_code === "" ? "red" : "",
                        }}
                        list="product_code_list"
                      />
                      <datalist id="product_code_list">
                        {productFetchData.length > 0 &&
                          productFetchData.map((product, index) => {
                            return (
                              <option key={index}>
                                {product.product_code}
                              </option>
                            );
                          })}
                      </datalist>

                      <div className="error_message">
                        {error && product_code === "" ? error : ""}
                      </div>
                    </div>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Category*
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setcategory(e.target.value)}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && category === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "3.3vw" }}
                    >
                      {error && category === "" ? error : ""}
                    </div>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Product Name*
                    </label>
                    <input
                      type="text"
                      value={product_name}
                      onChange={(e) => setProductName(e.target.value)}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && product_name === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "3.3vw" }}
                    >
                      {error && product_name === "" ? error : ""}
                    </div>
                  </div>

                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Product Type*
                    </label>
                    <input
                      type="text"
                      value={product_type}
                      onChange={(e) => setProductType(e.target.value)}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && product_type === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "3.3vw" }}
                    >
                      {error && product_name === "" ? error : ""}
                    </div>
                  </div>
                </div>
                <div className="purchases_input">
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="input_field_supershop_purchase_long_brand"
                      list="select_invoice_no"
                    />
                    <datalist id="select_invoice_no">
                      {brandData.length > 0 &&
                        brandData.map((brand, index) => {
                          return (
                            <option key={index}>{brand.brand_name}</option>
                          );
                        })}
                    </datalist>
                    <button
                      className="brand_add_button"
                      onClick={showBrandModal}
                    >
                      +
                    </button>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Purchase Price*
                    </label>
                    <div className="error_handle_input">
                      <input
                        type="number"
                        onChange={(e) => {
                          setPurchasePrice(e.target.value);
                          setError("");
                        }}
                        value={purchase_price}
                        className="input_field_supershop_purchase_long"
                        style={{
                          borderColor:
                            error && purchase_price === "" ? "red" : "",
                        }}
                      />

                      <div className="error_message">
                        {error && purchase_price === "" ? error : ""}
                      </div>
                    </div>
                  </div>

                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Quantity*
                    </label>

                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                        setError("");
                      }}
                      className="input_field_supershop_purchase_long quantity_add_purchaes"
                      style={{
                        borderColor: error && quantity === "" ? "red" : "",
                      }}
                    />
                    <select
                      type="text"
                      value={unitName}
                      onChange={(e) => {
                        setUnitName(e.target.value);
                        setError("");
                      }}
                      style={{
                        borderColor: error && product_name === "" ? "red" : "",
                        color: "black",
                      }}
                      className="unit_add_purchaes_opeartion"
                    >
                      {unitData &&
                        unitData.map((data, index) => (
                          <option
                            style={{ color: "black" }}
                            key={index}
                            value={data.unit}
                          >
                            {data.unit}
                          </option>
                        ))}
                    </select>

                    <button
                      className="brand_add_button"
                      onClick={ShowUnitModal}
                    >
                      +
                    </button>
                    <div
                      className="error_message"
                      style={{ marginLeft: "3.3vw" }}
                    >
                      {error && quantity === "" && unit === "" ? error : ""}
                    </div>
                  </div>

                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Item Total*
                    </label>
                    <input
                      type="number"
                      value={itemTotal}
                      className="input_field_supershop_purchase_long"
                    />
                  </div>
                </div>
                <div className="purchases_input_last">
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Discount
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="input_field_supershop_purchase_long_discount"
                    />
                    <span>%</span>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Total*
                    </label>
                    <input
                      type="number"
                      value={totalWithDiscount}
                      className="input_field_supershop_purchase_long"
                    />
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Sale Price*
                    </label>
                    <input
                      type="number"
                      value={sale_price}
                      onChange={(e) => {
                        setSalePrice(e.target.value);
                        setError("");
                      }}
                      className="input_field_supershop_purchase_long"
                      style={{
                        borderColor: error && sale_price === "" ? "red" : "",
                      }}
                    />
                    <div
                      className="error_message"
                      style={{ marginLeft: "3.3vw" }}
                    >
                      {error && sale_price === "" ? error : ""}
                    </div>
                  </div>
                  <div className="input_field_short_long">
                    <label className="label_field_supershop_purchase">
                      Warranty
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => {
                        setWarranty(e.target.value);
                      }}
                      className="input_field_supershop_purchase_long"
                    />
                  </div>
                </div>
                <div className="add_to_cart_purchase_button">
                  <button onClick={AddToCart}>
                    <FaCartPlus className="cart_icon_purchase" />
                  </button>
                  <div className="button_title">Add To cart</div>
                </div>
              </div>
              <div className="barcode_check_box_purchase">
                <input
                  type="checkbox"
                  onClick={() => setIschecked(true)}
                  name=""
                  id=""
                />
                Same Product (Multi Barcode)
              </div>
            </div>

            <fieldset className="customer_fieldset">
              <div
                style={{
                  marginLeft: "1vw",
                  marginTop: ".3vw",
                  fontSize: "1vw",
                }}
              >
                Vendor/Supplier
              </div>

              <div className="customer_inner_div2">
                <div className="input_field_long_supplier">
                  <label className="label_field_supershop_purchase">Name</label>
                  <select
                    type="text"
                    className="add_supplier_select_input"
                    value={supplierName}
                    onChange={(e) => {
                      setSupplierName(e.target.value);
                      setSupplierError("");
                    }}
                    style={{
                      borderColor:
                        SupplierError && supplierName === "" ? "red" : "",
                    }}
                  >
                    <option value="" redOnly>
                      Please Select supplier
                    </option>
                    {supplierData.map((data) => (
                      <option
                        key={data.contributor_name}
                        value={data.contributor_name}
                      >
                        {data.contributor_name}
                      </option>
                    ))}
                  </select>

                  <button className="supplier_add_button" onClick={showModal}>
                    +
                  </button>
                  <div className="error_message_supllier">
                    {SupplierError && supplierName === "" ? SupplierError : ""}
                  </div>
                </div>
                <div className="input_field_long_supplier">
                  <label className="label_field_supershop_purchase">
                    Address
                  </label>
                  <input value={Supplieraddress} />
                </div>
                <div className="input_field_long_supplier">
                  <label className="label_field_supershop_purchase">
                    Mobile
                  </label>
                  <input value={Suppliermobile} />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="third_row_div">
          <div className="table_supershop_purchase">
            <div className="table_div_supershop_purchase">
              <table className="" border={2} cellSpacing={2} cellPadding={6}>
                <thead>
                  <tr>
                    <th style={Color}>Serial No</th>
                    <th style={Color}>Category</th>
                    <th style={Color}>Product Code</th>
                    <th style={Color}>Product Name</th>
                    <th style={Color}>Product Type</th>
                    <th style={Color}>Brand</th>
                    <th style={Color}>Quantity</th>
                    <th style={Color}>Unit</th>
                    <th style={Color}>Purchase Price</th>
                    <th style={Color}>Sale Price</th>
                    <th style={Color}>Item Total</th>
                    <th style={Color}>Discount</th>
                    <th style={Color}>Warranty</th>
                    <th style={Color}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 &&
                    tableData.map((row, index) => (
                      <tr
                        key={index}
                        className={activeRowIndex === index ? "active-row" : ""}
                        onClick={() => handleRowClick(index)}
                      >
                        <td>{index + 1}</td>
                        <td>{row.category}</td>
                        <td>{row.product_code}</td>
                        <td>{row.product_name}</td>
                        <td>{row.product_type}</td>
                        <td>{row.brand_name}</td>
                        <td>{row.quantity}</td>
                        <td>{row.unit}</td>
                        <td>{row.purchase_price}</td>
                        <td>{row.salePrice}</td>
                        <td>{row.item_total}</td>
                        <td>{row.discount}</td>
                        <td>{row.warranty}</td>
                        <td>{row.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="input_field_short_total">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1vw",
                }}
                className="label_field_supershop_purchase"
              >
                Total
              </label>
              <input
                style={{ fontSize: "1vw" }}
                className="input_field_supershop_purchase"
                value={totalAmount}
              />
            </div>
          </div>
        </div>
        <div className="second_row_div">
          <div className="first_column_second_row">
            <div className="first_column_second_row_input_field">
              <div>
                <div className="input_field_short_select">
                  <label className="label_field_supershop_purchase">Shop</label>
                  <select>
                    {shopNameData &&
                      shopNameData.map((shop) => (
                        <option
                          value={shop.shop_name_id}
                          key={shop.shop_name_id}
                        >
                          {shop.shop_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="input_field_short_select1">
                  <label className="label_field_supershop_purchase">
                    Employee
                  </label>
                  <select>
                    <option>{Employee}</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="input_field_short_date">
                  <label className="label_field_supershop_purchase">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    className="input_field_supershop_purchase_long"
                    value={todayDate}
                    onChange={(e) => setTodayDate(e.target.value)}
                  />
                </div>
                <div className="input_field_short_select1">
                  <label className="label_field_supershop_purchase">
                    Payment Type
                  </label>
                  <select
                    name=""
                    id=""
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    {paymentTypeData.map((data) => (
                      <option key={data.payment_id} value={data.payment_type}>
                        {data.payment_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="button_first_column_second_row">
              <div className="save_button">
                <div style={{ display: "none" }}>
                  <ComponentToPrint
                    ref={componentRef}
                    supplier={supplierName}
                    address={Supplieraddress}
                    mobile={Suppliermobile}
                    employee_name={Employee}
                    date={todayDate}
                    total={NettotalAmount}
                    due={duePaid}
                    paid={paid}
                    invoice={invoice}
                    rows={tableData}
                    vat={vat}
                  />
                </div>
                <button
                  className=" button_supershop button1"
                  onClick={handlePrint}
                >
                  <FcPrint className="print_icon" title="Print" />
                </button>
                Print
              </div>

              <div className="save_button">
                <button
                  className="button_supershop button2"
                  onClick={handleSave}
                >
                  <img src={Save} alt="" />
                </button>
                Save
              </div>
            </div>
          </div>

          <div className="total_div_supershop_purchase">
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Total
              </label>
              <input type="number" style={newWidth} value={totalAmount} />
            </div>
            {/* <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Total Discount
              </label>
              <input type="number" style={newWidth} value={totalDiscount} />
            </div> */}
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Vat
              </label>
              <select
                type="number"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                className="vat_input_purchase_operation"
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

              <span>%</span>
              <button className="vat_add_button" onClick={showVatModal}>
                +
              </button>
            </div>
            <div className="bar_net_total">
              <div className="input_field_short_purchase bar_total_purchase">
                <label
                  className="label_field_supershop_purchase"
                  style={newWidth}
                >
                  Net Total
                </label>
                <input type="number" style={newWidth} value={NettotalAmount} />
              </div>
            </div>

            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Paid*
              </label>
              <input type="number" value={paid} onChange={handlePaidChange} />
            </div>
            <div className="input_field_short_purchase">
              <label
                className="label_field_supershop_purchase"
                style={newWidth}
              >
                Due
              </label>
              <input type="number" value={duePaid} style={newWidth} />
            </div>
          </div>
          <div className="third_row_third_column_purchase_operation">
            <div className="reset_button_purchses_report">
              <button onClick={handleReset}>
                <img src={reset} alt="" />
              </button>
              Reset
            </div>
          </div>
        </div>

        <div className="popup-window_supershop">
          <Modal
            title="Add Supplier"
            open={visible}
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
                            <label>Supplier Name*</label>
                            <input
                              type="text"
                              value={contributor_name}
                              onChange={(e) =>
                                setContributorName(e.target.value)
                              }
                              style={{
                                borderColor:
                                  contributorNameError &&
                                  contributor_name === ""
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
                            <label>Mobile*</label>
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
                            <label>Address*</label>
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
                              {addressError && address === ""
                                ? addressError
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="save_button">
                        <button
                          className="button_supershop button2"
                          onClick={handleSaveSupplier}
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
                      <th style={Color}>Supplier Id</th>
                      <th style={Color}>Name</th>
                      <th style={Color}>Mobile</th>
                      <th style={Color}>Address</th>
                    </tr>
                    {supplierData &&
                      supplierData.map((item, index) => (
                        <tr>
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

        <Modal
          title="Add Brand"
          open={brandVisible}
          onCancel={handleBrandCancel}
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
                          <label>Brand Name</label>
                          <input
                            type="text"
                            value={brand_name}
                            onChange={(e) => {
                              setBrand_name(e.target.value);
                              setBrandError("");
                            }}
                            style={{
                              borderColor:
                                brandError && brand_name === "" ? "red" : "",
                            }}
                          />

                          <div className="error_message_brand_save">
                            {brandError && brand_name === "" ? brandError : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="brand_save_button">
                      <button
                        className="button_supershop button2"
                        onClick={saveBrandName}
                      >
                        <img src={Save} alt="" />
                      </button>
                      <span>Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Add Unit"
          open={unitvisible}
          onCancel={handleUnitCancel}
          width={500}
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
                          <label>Unit Name</label>
                          <input
                            type="text"
                            value={unit}
                            onChange={(e) => {
                              setUnit(e.target.value);
                              setunitError("");
                            }}
                            style={{
                              borderColor:
                                unitError && unit === "" ? "red" : "",
                            }}
                          />

                          <div className="error_message_brand_save">
                            {unitError && unit === "" ? unitError : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="brand_save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handlesaveUnit}
                      >
                        <img src={Save} alt="" />
                      </button>
                      <span>Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Add Vat"
          open={vatVisible}
          onCancel={handleVatCancel}
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
                          <label>Vat</label>
                          <input
                            type="text"
                            value={rate}
                            onChange={(e) => {
                              setRate(e.target.value);
                              setVatError("");
                            }}
                            style={{
                              borderColor: vatError && rate === "" ? "red" : "",
                            }}
                          />
                          <div className="error_message_brand_save">
                            {vatError && rate === "" ? vatError : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="brand_save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handlesaveVat}
                      >
                        <img src={Save} alt="" />
                      </button>
                      <span>Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PurchaseOperation;
