import React, { useEffect, useRef, useState } from "react";
import "./quotation.css";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "./QuatationPrint/QuatationPrint";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Quotation = () => {
  const [toastId, setToastId] = useState(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  const [items, setItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [calculationItems, setCalculationItems] = useState([]);

  const [cart, setCart] = useState([]);
  const [Allproducts, setAllProducts] = useState([]);
  const [allEmployee, setAllEmployee] = useState([]);

  //first row handling:
  const [idCode, setIdCode] = useState("");
  const [productName, setProductName] = useState("");
  const [type, setType] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("");
  const [ItemTotalPrice, setitemTotalprice] = useState("");
  const [warrenty, setWarrenty] = useState([]);

  // customer:

  const [CustomerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  //sale summary:
  const [totalAmount, setTotalAmount] = useState("");
  const [quatationNumber, setQuatationNumber] = useState("");
  const [date, setdate] = useState("");
  const [shopName, setShopName] = useState("");

  //employee:

  const [comment, setComment] = useState("");
  const [printByEmployeeName, setPrintByEmployeeName] = useState("");
  const [employeeId, setemployeeId] = useState("");
  const [area, setArea] = useState("");

  //shop name:
  const [allShopNames, setAllShopNames] = useState([]);

  // const [currentDate, setCurrentDate] = useState(() => {
  //   const today = new Date();
  //   const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
  //   return formattedDate;
  // });

  //get all transections
  const fetchAllTransections = async () => {
    try {
      const transectionsData = sessionStorage.getItem("transectionsData");
      if (transectionsData) {
        setItems(JSON.parse(transectionsData));
        setCalculationItems(JSON.parse(transectionsData));
      } else {
        const response = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );
        setItems(response.data);
        setCalculationItems(response.data);
        sessionStorage.setItem(
          "transectionsData",
          JSON.stringify(response.data)
        );
      }
    } catch (error) {
      console.error("Error fetching or storing transectionsData Data :", error);
    }
  };
  useEffect(() => {
    fetchAllTransections();
    return () => sessionStorage.removeItem("transectionsData");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //print functionality:
  const componentRef = useRef();
  const approveSaleByPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const print = () => {
    if (cart && cart.length > 0) {
      approveSaleByPrint();
      resetAll();

      //toast message:
      if (toastId) {
        toast.dismiss(toastId); // Dismiss the previous toast
      }
      const newToastId = toast.success(`Sale approved wait a moment to print`, {
        duration: 1000,
      });
      setToastId(newToastId);
    } else {
      //toast message:
      if (toastId) {
        toast.dismiss(toastId); // Dismiss the previous toast
      }
      const newToastId = toast.error(`Cart is empty!`, {
        duration: 1000,
      });
      setToastId(newToastId);
    }
  };

  // ItemTotalAmount
  useEffect(() => {
    document.title = "Quotation";
    const ItemTotalAmount = salePrice * saleQuantity;
    setitemTotalprice(ItemTotalAmount);
  }, [salePrice, saleQuantity]);
  //total amount
  useEffect(() => {
    let totalAmount = 0;
    // eslint-disable-next-line array-callback-return
    cart.map((c) => {
      totalAmount = totalAmount + c.ItemTotalPrice;
    });
    setTotalAmount(totalAmount);
  }, [cart]);
  //==========get all products product=============:
  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get("/producttraces/getAll");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching or storing productTrace Data :", error);
    }
  };
  //==========get all employee=============:
  const fetchAllEmployee = async () => {
    try {
      const response = await axiosInstance.get("/employee/getAll");
      setAllEmployee(response.data);
    } catch (error) {
      console.error("Error fetching or storing productTrace Data :", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchAllEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employeeFunction = (name) => {
    setPrintByEmployeeName(name);
    const selectedEmployee = allEmployee.find((e) => e.name === name);
    if (selectedEmployee) {
      setemployeeId(selectedEmployee.employee_id);
      setArea(selectedEmployee.designation);
    }
  };

  //click on product & fill the input field:
  const handleProduct = (name) => {
    setProductName(name);
    const selectedProduct = Allproducts.find((p) => p.name === name);
    if (selectedProduct) {
      setIdCode(selectedProduct.product_code);
      setType(selectedProduct?.type);
      const item = items.find(
        (item) => item.product_trace_id === selectedProduct.product_trace_id
      );
      if (item) {
        setSalePrice(item.sale_price);
      }
    }
  };

  const handleCart = () => {
    if (
      productName &&
      // idCode &&
      // type &&
      salePrice &&
      saleQuantity &&
      ItemTotalPrice &&
      warrenty
    ) {
      const cartItem = {
        productName,
        idCode,
        type,
        salePrice,
        saleQuantity,
        ItemTotalPrice,
        warrenty,
      };
      setCart((prevCart) => [...prevCart, cartItem]);
      resetCartInput();
    } else {
      //toast message:
      if (toastId) {
        toast.dismiss(toastId); // Dismiss the previous toast
      }
      const newToastId = toast.error(`Can't post empty field!`, {
        duration: 1000,
      });
      setToastId(newToastId);
    }
  };
  const resetCartInput = () => {
    setProductName("");
    setIdCode("");
    setType("");
    setSalePrice("");
    setSaleQuantity("");
    setitemTotalprice("");
    setWarrenty("");
  };

  const resetEmployee = () => {
    setComment("");
    setemployeeId("");
    setPrintByEmployeeName("");
    setArea("");
  };

  const resetCustomer = () => {
    setCustomerName("");
    setCustomerId("");
    setCustomerMobile("");
    setCustomerAddress("");
  };

  const resetSaleSumarry = () => {
    setTotalAmount("");
    setQuatationNumber("");
    setdate("");
    setShopName("");
  };

  const resetAll = () => {
    setCart([]);
    resetCartInput();
    resetEmployee();
    resetCustomer();
    resetSaleSumarry();
  };
  const printData = {
    comment,
    employeeId,
    printByEmployeeName,
    area,
    CustomerName,
    customerId,
    customerAddress,
    customerMobile,
    totalAmount,
    quatationNumber,
    date,
    shopName,
  };

  //shop name fetch:
  const fetchShopNameData = async () => {
    try {
      const employeeCachedData = sessionStorage.getItem("allShopNames");
      if (employeeCachedData) {
        setAllShopNames(JSON.parse(employeeCachedData));
      } else {
        const response = await axiosInstance.get("/shopname/getAll");
        setAllShopNames(response.data);
        sessionStorage.setItem("allShopNames", JSON.stringify(response.data));
      }
      sessionStorage.removeItem("allShopNames");
    } catch (error) {
      console.error("Error fetching or storing employee Data :", error);
    }
  };
  useEffect(() => {
    fetchShopNameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(allShopNames);
  return (
    <div className="full_div_quotation">
      <Toaster />
      <div className="conatiner_div_quotation">
        <div className="first_rov_div_quotation">
          <div className="quotation_search_row_div1">
            <div className="quotation_search1">
              <div className="input_field_quotation">
                <label>*Product Name</label>

                <input
                  type="text"
                  value={productName}
                  onChange={(e) => handleProduct(e.target.value)}
                  list="products"
                />
                <datalist id="products">
                  {Allproducts.filter((item) =>
                    item.name.toLowerCase().includes(productName.toLowerCase())
                  ).map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="input_field_quotation">
                <label>*ID/Code</label>
                <input type="text" value={idCode} />
              </div>
              <div className="input_field_quotation">
                <label>*Type/No</label>
                <input type="text" value={type} />
              </div>
            </div>
            <div className="quotation_search2">
              <div className="input_field_quotation">
                <label>*Sales Price</label>
                <input
                  type="text"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
              <div className="input_field_quotation">
                <label>*Sale Quantity</label>
                <input
                  type="text"
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(e.target.value)}
                />
              </div>
              <div className="input_field_quotation">
                <label>*Item Total Peice</label>
                <input type="text" value={ItemTotalPrice} />
              </div>
              <div className="input_field_quotation">
                <label>Warranty</label>
                <input
                  type="text"
                  value={warrenty}
                  onChange={(e) => setWarrenty(e.target.value)}
                />
              </div>
            </div>
            <div className="quotation_search3">
              <div className="input_field_quotation">
                <button onClick={handleCart}>Add To Cart</button>
              </div>
            </div>
          </div>
          <div className="container_table_quotation">
            <div classname="quotation_table_wrapper">
              <table border={3} cellSpacing={2} cellPadding={10}>
                <tr className="heading_row">
                  <th className="headerTh">SL</th>
                  <th className="headerTh">ID/Code</th>
                  <th className="headerTh">Product Name</th>
                  <th className="headerTh">Type/No</th>
                  <th className="headerTh">Warranty</th>
                  <th className="headerTh">Sale Price</th>
                  <th className="headerTh">Quantity</th>
                  <th className="headerTh">Item Total</th>
                </tr>
                <tbody>
                  {cart &&
                    cart.length > 0 &&
                    cart.map((c, index) => {
                      return (
                        <tr key={cart.idCode}>
                          <td className="tableTd">{index}</td>
                          <td className="tableTd">{c.idCode}</td>
                          <td className="tableTd">{c.productName}</td>
                          <td className="tableTd">{c.type}</td>
                          <td className="tableTd">{c.warrenty}</td>
                          <td className="tableTd">{c.salePrice}</td>
                          <td className="tableTd">{c.saleQuantity}</td>
                          <td className="tableTd">{c.ItemTotalPrice}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cotainer_view_quotation">
            <div className="input_field_quotation_custom">
              <label>Comment/Service</label>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="cotainer_view_quotation_select">
              <div className="input_field_quotation">
                <label className="custom_label_quotation">
                  Print By(Employee)
                </label>

                <input
                  value={printByEmployeeName}
                  onChange={(e) => employeeFunction(e.target.value)}
                  list="employeeName"
                />
                <datalist id="employeeName">
                  {allEmployee
                    .filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(printByEmployeeName.toLowerCase())
                    )
                    .map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </datalist>
              </div>
              <div className="input_field_quotation">
                <label>Employee ID</label>
                <input type="text" value={employeeId} />
              </div>
              <div className="input_field_quotation">
                <label>Area</label>
                <input type="text" value={area} />
              </div>
            </div>
          </div>
        </div>
        <div className="second_row_div_quotation">
          <div className="quotion_search_row_div2">
            <div className="quotation_font_size">Customer Information</div>

            <div className="input_field_quotation">
              <label>*Name</label>
              <input
                value={CustomerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="input_field_quotation">
              <label>ID</label>
              <input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>
            <div className="input_field_quotation">
              <label>*Mobile</label>
              <input
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
              />
            </div>
            <div className="input_field_quotation">
              <label>*Address</label>
              <input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="container_sale_summary_quotation_full_div">
            <div className="quotation_font_size"> Sale Summary</div>
            <div className="container_sale_summary_quotation">
              <div className="input_field_quotation">
                <label>*Total Amount</label>
                <input
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                />
              </div>
              <div className="input_field_quotation">
                <label>*Quotation No</label>
                <input
                  value={quatationNumber}
                  onChange={(e) => setQuatationNumber(e.target.value)}
                />
              </div>
              <div className="input_field_quotation">
                <label>*Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setdate(e.target.value)}
                />
              </div>
              <div className="input_field_quotation">
                <label>*Shop Name</label>
                <input
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  list="shopName"
                />
                <datalist id="shopName">
                  {allShopNames.map((item, index) => (
                    <option key={index} value={item.shop_name}>
                      {item.shop_name}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
            <div className="container_sale_summary_quotation_button">
              <div className="input_field_quotation">
                <button onClick={print}>Approve Sale</button>
              </div>
              <div className="input_field_quotation">
                <button onClick={resetAll}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} cart={cart} data={printData} />
      </div>
    </div>
  );
};

export default Quotation;
