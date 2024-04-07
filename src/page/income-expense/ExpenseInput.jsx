import React from "react";
import "./expance-input.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
const ExpanceInput = () => {
  const [expenseName, setExpenseName] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [due, setDue] = useState([]);
  const [expenseNameError, setExpenseNameError] = useState("");
  const [totalError, setTotalError] = useState("");
  const [paidError, setPaidError] = useState("");

  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  useEffect(() => {
    document.title = "Expense Input";
    setDue(parseFloat(total) - parseFloat(paid) || 0);
  }, [total, paid]);

  const handleSaveExpence = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (!expenseName && !total && !paid) {
      setExpenseNameError("Can't leave empty field");
      setTotalError("Can't leave empty field");
      setPaidError("Can't leave empty field");
      return;
    }
    if (!expenseName) {
      setExpenseNameError("Can't leave empty field");
      return;
    }
    if (!total) {
      setTotalError("Can't leave empty field");
      return;
    }
    if (!paid) {
      setPaidError("Can't leave empty field");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/transactionsRouter/postComPaidAmountTransactionFromAnyPage?amount=${total}&paid=${paid}&comment=${expenseName}&date${currentDate}`
      );

      if (res.status === 200) {
        toast.success("Data Save Successfully");
        setExpenseName("");
        setTotal("");
        setPaid("");
        setDue("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="full_div_supershop_expense_input">
      <ToastContainer stacked autoClose={1000} />
      <div className="first_row_div_supershop_expense_input">
        <div className="container_search_column1_supershop_expense_input">
          <div className="input_field_supershop_expense_input">
            <label>Expense Name</label>
            <input
              value={expenseName}
              onChange={(event) => {
                setExpenseName(event.target.value);
                setExpenseNameError("");
              }}
              style={{
                borderColor:
                  expenseNameError && expenseName === "" ? "red" : "",
              }}
            />
            <div className="error_message_expence_input">
              {expenseNameError && expenseName === "" ? expenseNameError : ""}
            </div>
          </div>
          <div className="input_field_supershop_expense_input">
            <label>Date</label>
            <input
              type="date"
              value={currentDate}
              onChange={(event) => setCurrentDate(event.target.value)}
            />
          </div>
        </div>
        <div className="container_search_column2_supershop_expense_input">
          <div className="custom_search_column2_supershop_expense_input">
            <div className="input_field_supershop_expense_input">
              <label>Total Cost</label>
              <input
                value={total}
                onChange={(event) => {
                  setTotal(event.target.value);
                  setTotalError("");
                }}
                style={{ borderColor: totalError && total === "" ? "red" : "" }}
              />
              <div className="error_message_expence_input">
                {totalError && total === "" ? totalError : ""}
              </div>
            </div>
            <div className="input_field_supershop_expense_input">
              <label>Paid</label>
              <input
                value={paid}
                onChange={(event) => {
                  setPaid(event.target.value);
                  setPaidError("");
                }}
                style={{ borderColor: paidError && paid === "" ? "red" : "" }}
              />
              <div className="error_message_expence_input">
                {paidError && paid === "" ? paidError : ""}
              </div>
            </div>
            <div className="input_field_supershop_expense_input">
              <label>Due</label>
              <input
                value={due}
                onChange={(event) => setDue(event.target.value)}
              />
            </div>
          </div>
          <div className="container_button_supershop_expance_input">
            <button onClick={handleSaveExpence}>
              <IoIosSave />
            </button>
            <span>Save</span>
          </div>
        </div>
      </div>
      <ToastContainer stacked autoClose={2000} position="top-center" />
    </div>
  );
};

export default ExpanceInput;
