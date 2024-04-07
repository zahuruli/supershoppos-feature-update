import React, { useEffect, useState } from "react";
import "./employee-setup.css";
import { IoIosSave } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdOutlineViewCozy } from "react-icons/md";
import { MdBrowserUpdated } from "react-icons/md";

import toast, { Toaster } from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
const EmployeeSetup = () => {
  const [toastId, setToastId] = useState(null);

  //state management for employee save:
  const [employeeData, setEmployeeData] = useState([]);
  const [fixedEmployeeData, setfixedEmployeeData] = useState([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [nid, setNid] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [designation, setDesignation] = useState("");
  const [joining_date, setJoiningDate] = useState("");

  //search by employeeName:
  const [employeeName, setEmployeeName] = useState("");

  //state management for employee update:
  const [update_employee_id, setUpdateEmployeeId] = useState("");
  const [update_name, setUpdateName] = useState("");
  const [update_mobile, setUpdateMobile] = useState("");
  const [update_address, setUpdateAddress] = useState("");
  const [update_nid, setUpdateNid] = useState("");
  const [update_email, setUpdateEmail] = useState("");
  const [update_salary, setUpdateSalary] = useState("");
  const [update_designation, setUpdateDesignation] = useState("");
  const [update_joining_date, setUpdateJoiningDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [shop_name_id, setShopName] = useState("1");
  //table row click handling:
  const [selectedTabID, setSelectedTabID] = useState(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  const fetchData = async () => {
    try {
      const employeeCachedData = sessionStorage.getItem("employeeData");
      if (employeeCachedData) {
        setEmployeeData(JSON.parse(employeeCachedData));
        setfixedEmployeeData(JSON.parse(employeeCachedData));
      } else {
        const response = await axiosInstance.get("/employee/getAll");
        setEmployeeData(response.data);
        setfixedEmployeeData(response.data);
        sessionStorage.setItem("employeeData", JSON.stringify(response.data));
      }
      sessionStorage.removeItem("employeeData");
    } catch (error) {
      console.error("Error fetching or storing employee Data :", error);
    }
  };
  useEffect(() => {
    document.title = "Employee Setup";
    fetchData();
    // return () => sessionStorage.removeItem("employeeData");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===============saveEmployee============
  const saveEmployee = async () => {
    try {
      if (
        !mobile ||
        !address ||
        !nid ||
        !name ||
        !email ||
        !salary ||
        !designation ||
        !joining_date
      ) {
        //toast message:
        if (toastId) {
          toast.dismiss(toastId); // Dismiss the previous toast
        }
        const newToastId = toast.error(`Can't save empty field !`, {
          duration: 1000,
        });
        setToastId(newToastId);
      } else {
        const res = await axiosInstance.post(
          "/employee/postEmployeeFromAnyPage",
          {
            mobile,
            address,
            nid,
            name,
            email,
            salary,
            designation,
            joining_date,
          }
        );
        resetEmployee();
        fetchData();

        //toast message:
        if (toastId) {
          toast.dismiss(toastId); // Dismiss the previous toast
        }
        const newToastId = toast.success(`employee save successfully !`, {
          duration: 1000,
        });
        setToastId(newToastId);
        console.log(res);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ===============update employee============
  const updateEmployee = async () => {
    try {
      if (!update_employee_id) {
        //toast message:
        if (toastId) {
          toast.dismiss(toastId); // Dismiss the previous toast
        }
        const newToastId = toast.error(`Can't update empty field !`, {
          duration: 1000,
        });
        setToastId(newToastId);
      } else {
        const res = await axiosInstance.put(
          "/employee/updateEmployeeFromAnyPage",
          {
            employee_id: update_employee_id,
            mobile: update_mobile,
            address: update_address,
            nid: update_nid,
            name: update_name,
            email: update_email,
            salary: update_salary,

            designation: update_designation,
            joining_date: update_joining_date,
            shop_name_id,
          }
        );
        resetuUpdatedEmployee();
        fetchData();

        //toast message:
        if (toastId) {
          toast.dismiss(toastId); // Dismiss the previous toast
        }
        const newToastId = toast.success(`employee updated successfully`, {
          duration: 1000,
        });
        setToastId(newToastId);

        console.log(res);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //======deleteEmployee============
  const deleteEmployee = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axiosInstance.delete(
        `/employee/deleteEmployeeFromAnyPage`,
        { data: { employee_id: update_employee_id } }
      );
      resetuUpdatedEmployee();

      //toast message:
      if (toastId) {
        toast.dismiss(toastId); // Dismiss the previous toast
      }
      const newToastId = toast.success(
        `Employee ${update_name} deleted succefully!`,
        {
          duration: 1000,
        }
      );
      setToastId(newToastId);
      fetchData();
    } catch (error) {
      console.log(error.message);
      //toast message:
      if (toastId) {
        toast.dismiss(toastId); // Dismiss the previous toast
      }
      const newToastId = toast.error(`Please select aemployee to delete!`, {
        duration: 1000,
      });
      setToastId(newToastId);
    }
  };

  //reset employee field
  const resetEmployee = () => {
    setMobile("");
    setAddress("");
    setNid("");
    setName("");
    setEmail("");
    setSalary("");
    setDesignation("");
    setJoiningDate("");
  };

  //reset employee field
  const resetuUpdatedEmployee = () => {
    setUpdateEmployeeId("");
    setUpdateMobile("");
    setUpdateAddress("");
    setUpdateNid("");
    setUpdateName("");
    setUpdateEmail("");
    setUpdateSalary("");
    setUpdateDesignation("");
    setUpdateJoiningDate("");
  };

  // handleFilterEmployeeByName================
  //handleFilterByName
  const handleFilterEmployeeByName = () => {
    if (employeeName && fixedEmployeeData) {
      const searchTermLowerCase = employeeName.toLowerCase();

      const exactEmployee = fixedEmployeeData.filter((employee) => {
        const employeeNameLowerCase = employee.name.toLowerCase();
        return employeeNameLowerCase.includes(searchTermLowerCase);
      });

      if (exactEmployee.length > 0) {
        setEmployeeData(exactEmployee);
        setEmployeeName("");
      } else {
        fetchData();
        toast.error("Employee does not exist!");
      }
    } else {
      fetchData();
      //toast message:
      if (toastId) {
        toast.dismiss(toastId); // Dismiss the previous toast
      }
      const newToastId = toast.error(`Employee does not exist!`, {
        duration: 1000,
      });
      setToastId(newToastId);
    }
  };

  //handle table row:
  const handleClickTableDataShowInputField = (employee) => {
    setSelectedTabID(employee.employee_id);
    const selectedEmployee =
      employeeData &&
      employeeData.length > 0 &&
      employeeData.find((i) => i.employee_id === employee.employee_id);

    if (selectedEmployee) {
      console.log(selectedEmployee);
      setUpdateEmployeeId(selectedEmployee.employee_id);
      setUpdateName(selectedEmployee.name);
      setUpdateMobile(selectedEmployee.mobile);
      setUpdateAddress(selectedEmployee.address);
      setUpdateNid(selectedEmployee.nid);
      setUpdateEmail(selectedEmployee.email);
      setUpdateSalary(selectedEmployee.salary);
      setUpdateDesignation(selectedEmployee.designation);
      setUpdateJoiningDate(selectedEmployee.joining_date.split("T")[0]); // Extract date part
    }
  };

  return (
    <div className="full_div_employee_setup">
      <Toaster />
      {/* first_row_div_employee_setup */}
      <div className="first_row_div_employee_setup">
        <div
          style={{ fontWeight: "bold", marginBottom: "1vw", fontSize: "1vw" }}
        >
          Employee Setup
        </div>
        <div className="container_create_employee_setup">
          <div className="create_employee_setup_column1">
            <div className="input_field_employee_setup">
              <label>*Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input_field_employee_setup">
              <label>Mobile</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="create_employee_setup_column2">
            <div className="input_field_employee_setup">
              <label>NID</label>
              <input value={nid} onChange={(e) => setNid(e.target.value)} />
            </div>
            <div className="input_field_employee_setup">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input_field_employee_setup">
              <label>Salary</label>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>
          <div className="create_employee_setup_column3">
            <div className="input_field_employee_setup">
              <label>*Designation</label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*Joining Date</label>
              <input
                type="date"
                value={joining_date}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </div>
          </div>
          <div className="create_employee_setup_column4">
            <div className="input_field_employee_setup">
              <div className="divForALlbutton">
                <button className="showAll_button " onClick={saveEmployee}>
                  <IoIosSave className="saveIcon" />{" "}
                </button>
                <p className="buttonText">Save</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second_row_div_employee_setup */}
      <div className="second_row_div_employee_setup">
        <div className="container_search_employee_setup">
          <div className="input_field_employee_setup forEmployNameDiv_animation">
            <label>Employee Name</label>
            <input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              list="employeeName"
            />
            <datalist id="employeeName">
              {employeeData
                .filter((item) =>
                  item.name.toLowerCase().includes(employeeName.toLowerCase())
                )
                .map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </datalist>
            <button className="search_button">
              <FaSearch
                className="searchIcon"
                onClick={handleFilterEmployeeByName}
              />
            </button>
          </div>
          <div className="input_field_employee_setup forEmployNameDivButton_animation">
            <div className="divForALlbutton">
              <button className="showAll_button " onClick={fetchData}>
                <MdOutlineViewCozy className="viewAllIcon" />
              </button>
              <p className="buttonText">Show All</p>
            </div>
          </div>
        </div>
      </div>
      {/* third_row_div_employee_setup */}
      <div className="third_row_div_employee_setup">
        <div className="table-wrapper_employee_setup">
          <table
            border={3}
            cellSpacing={2}
            cellPadding={10}
            className="employee_table"
          >
            <tr>
              <th className="employee_table_th">ID</th>
              <th className="employee_table_th">Name</th>
              <th className="employee_table_th">Mobile</th>
              <th className="employee_table_th">Address</th>
              <th className="employee_table_th">NID</th>
              <th className="employee_table_th">Email</th>
              <th className="employee_table_th">Salary</th>
              <th className="employee_table_th">Designation</th>
              <th className="employee_table_th">Joining Day</th>
            </tr>
            <tbody>
              {employeeData &&
                employeeData.length > 0 &&
                employeeData.map((employee) => (
                  <tr
                    key={employee.employee_id}
                    className={`
          ${
            selectedTabID === employee.employee_id
              ? `employee_tr tab_selected`
              : `employee_tr`
          }
        `}
                    onClick={() => handleClickTableDataShowInputField(employee)}
                    tabIndex="0"
                  >
                    <td className="employee_table_td">
                      {employee.employee_id}
                    </td>
                    <td className="employee_table_td">{employee.name}</td>
                    <td className="employee_table_td">{employee.mobile}</td>
                    <td className="employee_table_td">{employee.address}</td>
                    <td className="employee_table_td">{employee.nid}</td>
                    <td className="employee_table_td">{employee.email}</td>
                    <td className="employee_table_td">{employee.salary}</td>
                    <td className="employee_table_td">
                      {employee.designation}
                    </td>
                    <td className="employee_table_td">
                      {employee.joining_date.split("T")[0]}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* forth_row_div_employee_setup */}
      <div className="forth_row_div_employee_setup">
        <div className="UpdateText">
          <h2 style={{ fontSize: "1vw" }}>Employee Update</h2>
        </div>
        <div className="container_update_employee_setup">
          <div className="create_employee_setup_column1">
            <div className="input_field_employee_setup">
              <label>*ID</label>
              <input
                value={update_employee_id}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*Name</label>
              <input
                value={update_name}
                onChange={(e) => setUpdateName(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*Mobile</label>
              <input
                value={update_mobile}
                onChange={(e) => setUpdateMobile(e.target.value)}
              />
            </div>
          </div>
          <div className="create_employee_setup_column2">
            <div className="input_field_employee_setup">
              <label>*Address</label>
              <input
                value={update_address}
                onChange={(e) => setUpdateAddress(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*NID</label>
              <input
                value={update_nid}
                onChange={(e) => setUpdateNid(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*Email</label>
              <input
                value={update_email}
                onChange={(e) => setUpdateEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="create_employee_setup_column3">
            <div className="input_field_employee_setup">
              <label>*Salary</label>
              <input
                value={update_salary}
                onChange={(e) => setUpdateSalary(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*Designation</label>
              <input
                value={update_designation}
                onChange={(e) => setUpdateDesignation(e.target.value)}
              />
            </div>
            <div className="input_field_employee_setup">
              <label>*Joining Date</label>
              <input
                type="date"
                value={update_joining_date || ""}
                onChange={(e) => setUpdateJoiningDate(e.target.value)}
              />
            </div>
          </div>
          <div className="create_employee_setup_column4">
            <div className="input_field_employee_setup">
              <div className="divForALlbutton">
                <button
                  className="update_button"
                  onClick={updateEmployee}
                  style={{ marginRight: ".8vw" }}
                >
                  <MdBrowserUpdated className="updateIcon" />
                </button>
                <p className="buttonText">Update</p>
              </div>

              <div className="divForALlbutton">
                <button className="update_button" onClick={deleteEmployee}>
                  <MdDeleteForever className="deleteicon" />
                </button>
                <p className="buttonText">Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSetup;
