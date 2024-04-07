import React, { useEffect, useRef, useState } from "react";
import "./xltojsonConvert.css";
import * as XLSX from "xlsx";
import exportFromJSON from "export-from-json";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "antd";

function XltoJsonConvert({ getCustomerInfo }) {
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [filesName, setFilesName] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========handleCsvDownload==========
  const handleCsvDownload = () => {
    const data = items;
    const fileName = "excel_data";
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data, fileName, exportType });
  };

  //=========handleJSONDownload==========
  const handleJSONDownload = () => {
    const jsonContent = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "excel_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  //=========readExcel==========
  const handleFileChange = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      setFilesName(fileName);

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data);
          const sheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          if (jsonData.length === 0) {
            toast.warning(
              "This file is empty. Please choose a non-empty file."
            );

            fileInput.value = "";
          } else {
            setItems(jsonData);
            getCustomerInfo(jsonData);
          }
        };
      } else {
        // Handle file with an invalid extension
        toast.warning(
          "Please select a valid Excel file with extension .xlsx or .xls"
        );

        // Clear the file input value
        fileInput.value = "";
      }
    }
  };
  const isURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  };

  //========modal controlling function:
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //==========Edit and Copy function:
  const handleEditClick = () => {
    // Make a copy of currentData to editingData for editing
    setEditingData(JSON.stringify(items, null, 2));
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    try {
      // Save the edited data to currentData after parsing the JSON
      const editedData = JSON.parse(editingData);
      // Note: You might want to perform additional validation before saving
      setItems(editedData);
      setEditingData(null);
      setIsEditing(false);
      toast("Changes saved!", { autoClose: 1500 });
      setIsModalOpen(false);
    } catch (error) {
      toast("Error parsing JSON. Please make sure the input is valid.", {
        autoClose: 1500,
      });
    }
  };

  const handleInputChange = (e) => {
    // Update the editingData based on user input
    setEditingData(e.target.value);
  };

  const handleCopyClick = () => {
    // Convert the currentData to a JSON-formatted string
    const jsonString = JSON.stringify(items, null, 2);

    // Copy the JSON string to the clipboard
    navigator.clipboard.writeText(jsonString).then(() => {
      toast(" Data copied to clipboard!", { autoClose: 1500 });
    });
    setIsModalOpen(false);
  };

  //=======================handleClearAll===============
  const handleClearAll = () => {
    setFilesName("");
    setItems([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  return (
    <>
      <div className="convert_xl_main_container">
        <ToastContainer />
        <div className="convert_input_container">
          <div className="convert_input_div">
            {" "}
            <label className="convert_input_label">
              {filesName ? filesName.substring(0, 19) : "Upload customer excel"}
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                onChange={(e) => {
                  handleFileChange(e);
                }}
                accept=".xls, .xlsx"
                className="convert_xl_btn "
                hidden
              />
            </label>
          </div>
          <div className="convert_download_div">
            {" "}
            {items.length > 0 && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="convert_download_btn btn1"
                >
                  <label htmlFor="json" className="json_label">
                    JSON
                  </label>
                  <GrFormView />
                </button>

                {/* <button
                onClick={handleJSONDownload}
                className="convert_download_btn btn2"
              >
                <label htmlFor="json" className="json_label">
                  JSON
                </label>
                <FaArrowAltCircleDown />
              </button> */}
                {/* <button
                onClick={handleCsvDownload}
                className="convert_download_btn btn3"
              >
                <label htmlFor="json" className="json_label">
                  CSV
                </label>
                <FaArrowAltCircleDown />
              </button> */}
                <button
                  onClick={handleClearAll}
                  className="convert_download_btn clear_btn"
                >
                  <label htmlFor="json" className="json_label">
                    CLEAR ALL
                  </label>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="convert_table_container">
          {items && items.length > 0 ? (
            <div className="convert_table_padding_container">
              <div className="convert_table_div ">
                <table className="convert_table">
                  <thead className="coverted_table_head">
                    <tr>
                      {Object.keys(items[0]).map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {isURL(cell) ? (
                              <img
                                src={cell}
                                alt="Image"
                                style={{
                                  maxWidth: "15vw",
                                  maxHeight: "5vh",
                                }}
                              />
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="data_text">
              <p>No data available</p>
            </div>
          )}
        </div>
        {/* =========modal_div================= */}
        <div className="modal_div">
          <Modal
            title={`${items.length} Items Found`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{}}
            footer={null}
          >
            <div className="json_container">
              <div className="json_data">
                {/* <h4 className="json_text">JSON DATA</h4> */}
                <div className="Json_button">
                  {isEditing ? (
                    <button onClick={handleSaveClick} className="Jsave_btn">
                      Save Changes
                    </button>
                  ) : (
                    <>
                      <button onClick={handleEditClick} className="Jedit_btn">
                        EDIT DATA
                      </button>
                      <button onClick={handleCopyClick} className="Jcopy_btn">
                        COPY DATA
                      </button>
                    </>
                  )}
                </div>
                <div className={isEditing ? "json_field2" : "json_field"}>
                  {isEditing ? (
                    <textarea
                      value={editingData}
                      onChange={handleInputChange}
                      rows={14}
                      className="editing_json_text"
                    />
                  ) : (
                    <pre>{JSON.stringify(items, null, 2)}</pre>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default XltoJsonConvert;
