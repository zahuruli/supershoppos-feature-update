/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./marketing-due-collection.css";
import { useState } from "react";

import PurchaseReportExcelExport from "../../components/ExportExcel";
import { MdPreview } from "react-icons/md";
const MarketingDueCollection = () => {
  // eslint-disable-next-line no-unused-vars
  const [rows, setRows] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [customerName, setCustomerName] = useState([]);
  const [customerId, setCustomerId] = useState([]);
  // const [customerAll, setCustomerAll] = useState([]);
  // const [employeeAll, setEmployeeAll] = useState([]);
  const [employeeName, setEmployeeName] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(()=>{
   document.title="Marketing Due Collection"
  },[])

  return (
    <div className="full_div_marketing_due_collection_report_supershop">
      <div className="first_row_marketing_due_collection_report_supershop">
        <div className="container_search_marketing_due_collection_report_supershop">
          <div className="search_field_marketing_due_collection_report1_supershop">
            <div className="search_field_marketing_due_collection1_supershop">
              <div className="input_field_marketing_due_collection_report_supershop">
                <label>Customer Name</label>
                <input
                  onChange={(event) => {
                    setCustomerName(event.target.value);
                  }}
                  list="customername"
                />
              </div>
              <div className="input_field_marketing_due_collection_report_supershop">
                <label>Employee Name</label>
                <input
                  onChange={(event) => {
                    setEmployeeName(event.target.value);
                  }}
                  list="employeename"
                />
              </div>
            </div>
            <div className="search_field_marketing_due_collection2_supershop">
              <div className="input_field_marketing_due_collection_report_supershop">
                <label>ID</label>
                <select
                  onSelect={(event) => {
                    setCustomerId(event.target.value);
                  }}
                ></select>
                <button>Search</button>
              </div>
              <div className="input_field_marketing_due_collection_report_supershop">
                <label>ID</label>
                <select
                  onSelect={(event) => {
                    setEmployeeId(event.target.value);
                  }}
                ></select>
                <button>Search</button>
              </div>
            </div>
          </div>
          <div className="search_field_marketing_due_collection_report2_supershop">
            <div>
              <PurchaseReportExcelExport
                excelData={rows}
                fileName={"Excel Export"}
              />
            </div>
            <div className="marketing_due_collection_report2_supershop_button">
              <button>
                <MdPreview />
              </button>
              <span>Show All</span>
            </div>
          </div>
        </div>
      </div>
      <div className="second_row_marketing_due_collection_report_supershop">
        <div className="table_wrapper_marketing_due_collection_report_supershop">
          <table border={3} cellSpacing={2} cellPadding={10}>
            <tr>
              <th>Serial</th>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Invoice</th>
              <th>Customer Name</th>
              <th>Customer ID</th>
              <th>Mobile No</th>
              <th>Address</th>
              <th>Due Collection</th>
              <th>Cash Type</th>
              <th>Cheque Number</th>
              <th>Bank Name</th>
              <th>Area</th>
              <th>Date</th>
            </tr>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div className="third_row_marketing_due_collection_report_supershop">
        <div className="container_view_marketing_due_collection_report_supershop">
          <div className="input_field_marketing_due_collection_report_supershop">
            <label style={{ width: "12vw" }}>Total Due Collection (TK.)</label>
            <input readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDueCollection;
