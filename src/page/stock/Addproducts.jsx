/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useRef, useState } from "react";
import styles from "./AddProduct.module.css";
// import { BsFillFileEarmarkExcelFill } from "react-icons/bs";
import { IoReloadCircleOutline } from "react-icons/io5";
import { BiBarcodeReader } from "react-icons/bi";
import { IoIosSave } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdPhotos } from "react-icons/io";
import { Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./BarCode";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
// import exportFromJSON from "export-from-json";
import ExportExcel from "../../components/ExportExcel";

const Addproducts = () => {
  const [toastId, setToastId] = useState(null);

  const categorySelectRef = useRef(null);
  const rackSelectRef = useRef(null);

  const [items, setItems] = useState([]);
  const [fixedItems, setFixedItems] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [isDisbaled, setIsdisabled] = useState(false);

  //categories
  const [categories, setCategories] = useState([]);
  const [category_id, setCategoryId] = useState("");
  const [category_name, setCategoryName] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  //racks
  const [racks, setRacks] = useState([]);
  const [rack_id, setRackId] = useState("");
  const [rack_no, setRackNo] = useState("");
  const [filteredRacks, setFilteredRacks] = useState([]);

  //product input state:
  const [product_trace_id, setProductTraceId] = useState("");
  const [product_code, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [productCategory, setProductCategory] = useState({
    category_id: "",
    category_name: "",
  });
  const [productRack, setProductRack] = useState({ rack_id: "", rack_no: "" });
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  // const [image_blob, setImageBlob] = useState(null);
  //
  const [image, setImage] = useState(null);
  const [imageChange, setImageChange] = useState(false);

  //========product searching:======
  const [productSearchCode, setProductSearchCode] = useState("");
  const [productSearchEmpty, setProductSearchEmpty] = useState(false);

  //ref:
  const productSearchCodeRef = useRef(null);
  const productCategoryRef = useRef(null);
  const productRackRef = useRef(null);
  //moodal & table selection
  const [productModal, setProductModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [deleteCategory, setDeletecategory] = useState(false);
  const [rackModal, setRackModal] = useState(false);
  const [deleteRack, setDeleteRack] = useState(false);

  const [selectedTabID, setSelectedTabID] = useState(null);

  //barcode state:
  const [barcodeProductCode, setBarcodeProductCode] = useState("");
  const [barcodeProductName, setBarcodeProductName] = useState("");
  const [barcodeProductType, setBarcodeProductType] = useState("");

  //empty field highlight state:
  const [categoryNameRequired, setCategoryNameRequired] = useState(false);
  const [rackNameRequired, setRackNameRequired] = useState(false);

  //product required field
  const [productCategoryRequired, setProductCategoryRequired] = useState(false);
  const [productRackRequired, setProductRackRequired] = useState(false);
  const [productCodeRequired, setproductCodeRequired] = useState(false);
  const [productNameRequired, setproductNameRequired] = useState(false);

  //search state:
  const [productSearchStatus, setProductSearchStatus] = useState(false);
  // axios instance:
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  useEffect(() => {
    document.title = "Add Product";
    fetchAllProducts();
    fetchAllCategory();
    fetchAllRack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //==========get all products product=============:
  const fetchAllProducts = async () => {
    try {
      const productData = sessionStorage.getItem("productData");
      if (productData) {
        setItems(JSON.parse(productData));
        setFixedItems(JSON.parse(productData));
      } else {
        const response = await axiosInstance.get("/producttraces/getAll");
        setItems(response.data);
        setFixedItems(response.data);
        sessionStorage.setItem("productData", JSON.stringify(response.data));
        console.log(response.data);
      }
      sessionStorage.removeItem("productData");
    } catch (error) {
      console.error("Error fetching or storing productTrace Data :", error);
    }
  };

  //================category functionality==========================:
  //get all category:
  const fetchAllCategory = async () => {
    try {
      const { data } = await axiosInstance.get("/category/getAll");
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   fetchAllCategory();
  // }, []);

  //================category select=============
  const handleCategorySelect = (value) => {
    if (categories && categories.length > 0) {
      const selectedCategory = categories.find((c) => c.category_id == value);
      if (selectedCategory) {
        setCategoryId(selectedCategory.category_id);
        setCategoryName(selectedCategory.category_name);
      } else {
        console.log("Selected category not found for value:", value);
      }
      console.log("selectedCategory", selectedCategory);
    } else {
      console.log("Categories is empty");
    }
  };

  //========save category:==========
  const saveCategory = async (event) => {
    !category_name && setCategoryNameRequired(true);
    setTimeout(() => {
      setCategoryNameRequired(false);
    }, 2600);
    if (event.detail > 1) {
      return;
    }
    try {
      if (category_name) {
        const existingCatName = categories.find(
          (c) => c.category_name == category_name
        );
        if (!existingCatName) {
          const res = await axiosInstance.post(
            "/category/postCategoryFromAnyPage",
            {
              category_name,
            }
          );
          setCategoryModal(() => false);
          //toast message:
          if (toastId) {
            toast.dismiss(toastId); // Dismiss the previous toast
          }
          const newToastId = toast.success(`category save successfully`, {
            duration: 1000,
          });
          setToastId(newToastId);
          fetchAllCategory();
          resetCategory();
          console.log(res);
        } else {
          if (toastId) {
            toast.dismiss(toastId); // Dismiss the previous toast
          }
          const newToastId = toast.error(`Can't post existing category!`, {
            duration: 1000,
          });
          setToastId(newToastId);
        }
      } else {
        setCategoryModal(() => false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId); // Dismiss the previous toast
        }
        const newToastId = toast.error(`Can't post  empty category!`, {
          duration: 1000,
        });
        setToastId(newToastId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //update category
  const updateCategory = async () => {
    !category_name && setCategoryNameRequired(true);
    setTimeout(() => {
      setCategoryNameRequired(false);
    }, 2600);
    try {
      if (category_name && category_id) {
        const res = await axiosInstance.put(
          "/category/updateCategoryFromAnyPage",
          {
            category_name,
            category_id,
          }
        );
        setCategoryModal(() => false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.success(`category updated successfully`, {
          duration: 1000,
        });
        setToastId(newToastId);

        fetchAllCategory();
        resetCategory();
        console.log(res);
      } else {
        setCategoryModal(() => false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.error(`Can't update empty category!`, {
          duration: 1000,
        });
        setToastId(newToastId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //category delete functionality:

  const handleCategoryDeleteTrue = async () => {
    try {
      if (category_id) {
        const res = await axiosInstance.delete(
          "/category/deleteCategoryFromAnyPage",
          { data: { category_id } }
        );
        setCategoryModal(false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.success(`category deleted successfully`, {
          duration: 1000,
        });
        setToastId(newToastId);
        fetchAllCategory();
        resetCategory();
        console.log(res);
      } else {
        setCategoryModal(false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.error(`Can't deleted empty id category`, {
          duration: 1000,
        });
        setToastId(newToastId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //================racks functionality================================:
  //get all racks:
  const fetchAllRack = async () => {
    try {
      const { data } = await axiosInstance.get("/rack/getAll");
      setRacks(data);
      setFilteredRacks(data);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   fetchAllRack();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  //rack Handling:
  const handleRackSelect = (value) => {
    if (racks && racks.length > 0) {
      const selectedRack = racks.find((r) => r.rack_id == value);
      if (selectedRack) {
        setRackId(selectedRack.rack_id);
        setRackNo(selectedRack.rack_no);
      } else {
        console.log("Selected category not found for value:", value);
      }
    } else {
      console.log("Categories is empty");
    }
  };

  //===========saveRack:=============
  const saveRack = async (event) => {
    !rack_no && setRackNameRequired(true);
    setTimeout(() => {
      setRackNameRequired(false);
    }, 2600);
    if (event.detail > 1) {
      return;
    }
    try {
      if (rack_no) {
        const existingRackName = racks.find((r) => r.rack_no == rack_no);
        if (!existingRackName) {
          const res = await axiosInstance.post("/rack/postRackFromAnyPage", {
            rack_no,
          });
          setRackModal(() => false);
          //toast message:
          if (toastId) {
            toast.dismiss(toastId);
          }
          const newToastId = toast.success(`rack save successfully`, {
            duration: 1000,
          });
          setToastId(newToastId);
          fetchAllRack();
          resetRack();
          console.log(res);
        } else {
          //toast message:
          if (toastId) {
            toast.dismiss(toastId);
          }
          const newToastId = toast.error(`Can't post existing rack!`, {
            duration: 1000,
          });
          setToastId(newToastId);
        }
      } else {
        setCategoryModal(() => false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.error(`Can't post empty rack!`, {
          duration: 1000,
        });
        setToastId(newToastId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //update rack
  const updateRack = async () => {
    !rack_no && setRackNameRequired(true);
    setTimeout(() => {
      setRackNameRequired(false);
    }, 2600);
    try {
      if (rack_no && rack_id) {
        const res = await axiosInstance.put("/rack/updateRackFromAnyPage", {
          rack_no,
          rack_id,
        });
        setRackModal(() => false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.success(`rack updated successfully`, {
          duration: 1000,
        });
        setToastId(newToastId);

        fetchAllRack();
        resetRack();
        console.log(res);
      } else {
        setCategoryModal(() => false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.success(`Can't update empty rack!`, {
          duration: 1000,
        });
        setToastId(newToastId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //rack delete functionality:

  const handleRackDeleteTrue = async () => {
    try {
      if (rack_id) {
        const res = await axiosInstance.delete("/rack/deleteRackFromAnyPage", {
          data: { rack_id },
        });
        setRackModal(false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.success(
          `rack ${rack_id} deleted successfully`,
          {
            duration: 1000,
          }
        );
        setToastId(newToastId);

        fetchAllRack();
        resetRack();
        console.log(res);
      } else {
        setRackModal(false);
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.error(`Can't deleted empty id rack!`, {
          duration: 1000,
        });
        setToastId(newToastId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //=============add product functionality==========================================
  //handle table row:
  const handleClickTableDataShowInputField = (d) => {
    setSelectedTabID(d.product_trace_id);
    const selectedProduct =
      items &&
      items.length > 0 &&
      items.find((i) => i.product_trace_id === d.product_trace_id);

    if (selectedProduct) {
      console.log(selectedProduct);
      setProductCategory(selectedProduct.Category?.category_id);
      setProductCategory({
        category_id: selectedProduct.Category?.category_id,
        category_name: selectedProduct.Category?.category_name,
      });

      setProductRack({
        rack_id: selectedProduct.Rack?.rack_id,
        rack_no: selectedProduct.Rack?.rack_no,
      });
      setProductTraceId(selectedProduct.product_trace_id);
      setProductCode(selectedProduct.product_code);
      setName(selectedProduct.name);
      setModel(selectedProduct.model);
      setType(selectedProduct.type);

      //barcode state
      setBarcodeProductCode(selectedProduct.product_code);
      setBarcodeProductName(selectedProduct.name);
      setBarcodeProductType(selectedProduct.type);
      //image
      if (selectedProduct.image) {
        setImage(selectedProduct.image_blob);
      } else {
        setImage("");
      }
    }
  };

  //product Category change
  const handleProductCategoryChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filtered = categories.filter((category) =>
      category.category_name.toLowerCase().includes(inputValue)
    );

    setFilteredCategories(filtered);

    const selectedCategory = filtered.find(
      (category) => category.category_name.toLowerCase() === inputValue
    );

    if (selectedCategory) {
      setProductCategory({
        category_id: selectedCategory.category_id,
        category_name: selectedCategory.category_name,
      });
    } else {
      setProductCategory({ category_id: "", category_name: inputValue });
    }
  };
  //product rack change

  // Handle rack input change
  const handleProductRackChange = (e) => {
    const inputValue = e.target.value.toLowerCase();

    const filtered = racks.filter((rack) =>
      rack.rack_no.toLowerCase().includes(inputValue)
    );

    setFilteredRacks(filtered);

    const selectedRack = filtered.find(
      (rack) => rack.rack_no.toLowerCase() === inputValue
    );

    if (selectedRack) {
      setProductRack({
        rack_id: selectedRack.rack_id,
        rack_no: selectedRack.rack_no,
      });
    } else {
      setProductRack({ rack_id: "", rack_no: inputValue });
    }
  };

  //===========save Product:=============

  const saveProduct = async (event) => {
    if (event.detail > 1) {
      return;
    } else {
      try {
        if (
          !productCategory.category_id ||
          !productRack.rack_id ||
          !product_code ||
          !name
        ) {
          setProductCategoryRequired(true);
          setProductRackRequired(true);
          setproductCodeRequired(true);
          setproductNameRequired(true);

          setTimeout(() => {
            setProductCategoryRequired(false);
            setProductRackRequired(false);
            setproductCodeRequired(false);
            setproductNameRequired(false);
          }, 2600);

          setIsdisabled(false);
        } else {
          const existingProductName = items.find((item) => item.name === name);
          const existingProductCode = items.find(
            (item) => item.product_code === product_code
          );
          if (!existingProductName && !existingProductCode) {
            setIsdisabled(false);

            const res = await axiosInstance.post(
              "/producttraces/postProductTraceFromAnyPage",
              {
                category_id: productCategory.category_id,
                rack_id: productRack.rack_id,
                product_code,
                name,
                type,
                model,
                image_url: image,
              }
            );
            resetAllForSaveProduct();
            toast.success(`Product saved successfully!`, { duration: 700 });
            console.log(res);

            fetchAllProducts();
            console.log(res);
          } else {
            toast.error(`Product name or code already exists!`, {
              duration: 700,
            });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //=========== update product===============

  const updateProduct = async () => {
    try {
      if (!product_trace_id) {
        toast.error(`Can't update without product_trace_id !`);
      } else {
        const res = await axiosInstance.put(
          "/producttraces/updateProductTraceFromAnyPage",
          {
            product_trace_id,
            category_id: productCategory.category_id,
            rack_id: productRack.rack_id,
            product_code,
            name,
            type,
            model,
            image_url: image,
          }
        );
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        const newToastId = toast.success(`product updated successfully`, {
          duration: 1000,
        });
        setToastId(newToastId);

        fetchAllProducts();
        resetAllforUpdateProduct();
        console.log(res);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //product delete functionality=================:

  const handleProductDeleteTrue = async () => {
    try {
      const res = await axiosInstance.delete(
        "/producttraces/deleteProductTraceFromAnyPage",
        { data: { product_trace_id } }
      );
      setProductModal(false);
      //toast message:
      if (toastId) {
        toast.dismiss(toastId);
      }
      const newToastId = toast.error(
        `${product_trace_id}Product deleted successfully`,
        {
          duration: 1000,
        }
      );
      setToastId(newToastId);

      fetchAllProducts();
      console.log(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  //handleProductSearch
  const handleProductSearch = () => {
    if (productSearchCode) {
      const filteredproduct = items.filter(
        (item) => item.product_code == productSearchCode
      );
      setItems(filteredproduct);
      setProductSearchStatus(true);
      setProductSearchCode("");
    } else {
      setProductSearchEmpty(true);

      setTimeout(() => {
        setProductSearchEmpty(false);
      }, 2600);
    }
  };

  // handleCleareProductSearch
  const handleCleareProductSearch = () => {
    setProductSearchCode("");
    fetchAllProducts();
    setProductSearchStatus(false);
  };
  //==================reset functionality==================================:
  const resetCategory = () => {
    setCategoryId("");
    setCategoryName("");
    categorySelectRef.current.value = null;
    setCategoryNameRequired(false);
  };
  const resetRack = () => {
    setRackId("");
    setRackNo("");
    rackSelectRef.current.value = null;
    setRackNameRequired(false);
  };
  const resetProduct = () => {
    setSelectedTabID("");
    setProductTraceId("");
    setProductCode("");
    setName("");
    setModel("");
    setType("");
    setImage(null);
    setProductCategory({
      category_id: "",
      category_name: "",
    });
    productCategoryRef.current.value = null;

    setProductRack({
      rack_id: "",
      rack_no: "",
    });
    productRackRef.current.value = null;
    setProductCategoryRequired(false);
    setProductRackRequired(false);
    setproductCodeRequired(false);
    setproductNameRequired(false);

    resetBarcode();
  };
  const resetBarcode = () => {
    setBarcodeProductCode("");
    setBarcodeProductName("");
    setBarcodeProductType("");
  };
  const resetAllForSaveProduct = () => {
    setProductCode("");
    setName("");
    setType("");
    setModel("");
    setImage(null);
    resetBarcode();
  };
  const resetAllforUpdateProduct = () => {
    resetCategory();
    resetRack();
    resetProduct();
    resetBarcode();
  };

  const resetAll = () => {
    resetCategory();
    resetRack();
    resetProduct();
    resetBarcode();
  };
  //==========barcode print functionality========:
  const componentRef = useRef();
  const print = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrint = () => {
    if (product_trace_id) {
      print();
      resetAll();
    } else {
      toast.error("Please select a product to print Barcode", {
        duration: 700,
      });
    }
  };

  //image Upload:
  const handleUploadImage = async () => {
    try {
      if (!image) {
        toast.error("Please select an image.");
        return;
      }

      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=21299bba678bf8643a7fd481654c0303",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response);

      if (response.data && response.data.data && response.data.data.url) {
        setImage(response.data.data.url);
        setImageChange(false);
        toast.success("Image uploaded successfully");
        console.log(response.data.data.url);
      } else {
        throw new Error("Failed to get image URL from response.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  // =========handle xl Download==========
  // const handleXlDownload = () => {
  //   if (items && items.length > 0) {
  //     const data = items;
  //     const fileName = "All_Product_List ";
  //     const exportType = exportFromJSON.types.csv;
  //     exportFromJSON({ data, fileName, exportType });
  //   } else {
  //     toast.error("Currently you have no data to export!");
  //   }
  // };

  return (
    <>
      <div className={styles.product_container}>
        {/*================ categories start from here================== */}
        <div className={styles.Categories_container}>
          <div className={styles.card}>
            <div className={styles.Categories_div}>
              <div className={styles.sanitory_div}>
                <div>
                  <h5 className={styles.text_h3}> Categories</h5>
                </div>
                <div className={styles.sanitory_card}>
                  <select
                    multiple
                    className={styles.sanitary_select}
                    onChange={(event) =>
                      handleCategorySelect(event.target.value)
                    }
                    ref={categorySelectRef}
                  >
                    {categories &&
                      categories.length > 0 &&
                      categories.map((c) => (
                        <option
                          key={c.category_id} // Add key prop here
                          // className="category_option"
                          value={c.category_id}
                        >
                          {c.category_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.sanitory_text}>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    Category Id:
                  </label>
                  <input
                    type="text"
                    className={styles.codeInput}
                    value={category_id}
                    disabled
                  />
                </div>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    *Category Name:
                  </label>
                  <input
                    type="text"
                    className={
                      categoryNameRequired && !category_name
                        ? `${styles.nameInput} ${styles.errorBorder}`
                        : `${styles.nameInput}`
                    }
                    value={category_name}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      setCategoryNameRequired(false);
                    }}
                    placeholder={
                      categoryNameRequired &&
                      !category_name &&
                      "Category Name is required"
                    }
                  />
                </div>
                <div className={styles.sanitory_btn}>
                  <button
                    className={`${styles.sanity_icon} ${styles.refresh}`}
                    onClick={() => resetCategory()}
                  >
                    <IoReloadCircleOutline />{" "}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.add}`}
                    onClick={category_id ? updateCategory : saveCategory}
                  >
                    {category_id ? <FaEdit /> : <MdAddBox />}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.delete}`}
                    onClick={() => {
                      if (category_id) {
                        setCategoryModal(true);
                        setDeletecategory(true);
                      } else {
                        toast.error(
                          "Please select a category to perform delete!"
                        );
                      }
                    }}
                  >
                    <RiDeleteBin6Line />{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*================ Racks start from here================== */}
        <div className={styles.Categories_container}>
          <div className={styles.card}>
            <div className={styles.Categories_div}>
              <div className={styles.sanitory_div}>
                <h5 className={styles.text_h3}>Racks</h5>
                <div className={styles.sanitory_card}>
                  <select
                    multiple
                    className={styles.sanitary_select}
                    onChange={(event) => handleRackSelect(event.target.value)}
                    ref={rackSelectRef}
                  >
                    {racks &&
                      racks.length > 0 &&
                      racks.map((r) => (
                        <option className="category_option" value={r.rack_id}>
                          {r.rack_no}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.sanitory_text}>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    Rack Id:
                  </label>
                  <input
                    type="text"
                    className={styles.codeInput}
                    value={rack_id}
                    disabled
                  />
                </div>
                <div className={styles.input_div}>
                  <label htmlFor="code" className={styles.label}>
                    *Rack No:
                  </label>
                  <input
                    type="text"
                    className={
                      rackNameRequired && !rack_no
                        ? `${styles.nameInput} ${styles.errorBorder}`
                        : `${styles.nameInput}`
                    }
                    value={rack_no}
                    onChange={(e) => {
                      setRackNo(e.target.value);
                      setRackNameRequired(false);
                    }}
                    placeholder={
                      rackNameRequired && !rack_no && "Rack No is required"
                    }
                  />
                </div>
                <div className={styles.sanitory_btn}>
                  <button
                    className={`${styles.sanity_icon} ${styles.refresh}`}
                    onClick={() => resetRack()}
                  >
                    <IoReloadCircleOutline />{" "}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.add}`}
                    onClick={rack_id ? updateRack : saveRack}
                  >
                    {rack_id ? <FaEdit /> : <MdAddBox />}
                  </button>
                  <button
                    className={`${styles.sanity_icon} ${styles.delete}`}
                    onClick={() => {
                      if (rack_id) {
                        setRackModal(true);
                        setDeleteRack(true);
                      } else {
                        toast.error("Please select a rack to perform delete!");
                      }
                    }}
                  >
                    <RiDeleteBin6Line />{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*================ types start from here================== */}

        {/* ====================product  start from here ========================*/}
        <div className={styles.inventory_product_container}>
          <div className={styles.card}>
            <div className={styles.inventory_product_div}>
              {/* /===========/table */}
              <div className={styles.product_table}>
                {/* SearchDiv */}
                <div className={styles.SearchDiv}>
                  <div className={styles.Header_text}>
                    <h5 className={styles.types_h3}>Products</h5>
                  </div>
                  <div className={styles.search_input_div}>
                    <input
                      type="text"
                      className={
                        productSearchEmpty
                          ? `${styles.search_input} ${styles.errorBorder}`
                          : `${styles.search_input} `
                      }
                      value={productSearchCode}
                      onChange={(e) => setProductSearchCode(e.target.value)}
                      placeholder="Search product"
                      list="allProducts"
                      ref={productSearchCodeRef}
                    />
                    <datalist id="allProducts">
                      {items.map((product) => (
                        <option
                          key={product.product_code}
                          value={product.product_code}
                        >
                          {product.name}
                        </option>
                      ))}
                    </datalist>
                    {productSearchStatus ? (
                      <button
                        className={styles.searchBtn}
                        onClick={handleCleareProductSearch}
                      >
                        Show All
                      </button>
                    ) : (
                      <button
                        className={styles.searchBtn}
                        onClick={handleProductSearch}
                      >
                        Search
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.product_table_container}>
                  <table class={styles.tables}>
                    <thead>
                      <tr className={styles.heading_row}>
                        <th>
                          {" "}
                          <div className={styles.t_data}>Code</div>{" "}
                        </th>
                        <th>
                          <div className={styles.t_data}>Name</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Category</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Type</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Model</div>
                        </th>
                        <th>
                          <div className={styles.t_data}>Rack</div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className={styles.tbody}>
                      {items &&
                        items.length > 0 &&
                        items.map((d) => (
                          <tr
                            key={d.product_trace_id}
                            className={`
          ${
            selectedTabID === d.product_trace_id
              ? `${styles.addProduct_tr} ${styles.tab_selected}`
              : styles.addProduct_tr
          }
        `}
                            onClick={() =>
                              handleClickTableDataShowInputField(d)
                            }
                            tabIndex="0"
                          >
                            <td className={styles.addProduct_td}>
                              {d.product_code}
                            </td>
                            <td className={styles.addProduct_td}>{d.name}</td>
                            <td className={styles.addProduct_td}>
                              {d.Category?.category_name || ""}
                            </td>
                            <td className={styles.addProduct_td}>{d.type}</td>
                            <td className={styles.addProduct_td}>{d.model}</td>
                            <td className={styles.addProduct_td}>
                              {d.Rack?.rack_no || ""}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* /===========/input starts from here */}
              <div className={styles.product_input}>
                <div className={styles.product_input_container}>
                  {/* /==================/rack category for product */}
                  <div
                    className={`${styles.input_div} ${styles.forSomeMergine}`}
                  >
                    <div className={styles.left_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        *Category:
                      </label>
                      <input
                        type="text"
                        className={
                          productCategoryRequired &&
                          !productCategory.category_id
                            ? `${styles.productInput} ${styles.errorBorder}`
                            : `${styles.productInput}`
                        }
                        value={productCategory.category_name}
                        onChange={handleProductCategoryChange}
                        list="productCategory"
                        ref={productCategoryRef}
                        placeholder={
                          productCategoryRequired &&
                          !productCategory.category_id &&
                          "Category is required"
                        }
                      />

                      {/* Render datalist with filtered options */}
                      <datalist id="productCategory">
                        {filteredCategories.map((category) => (
                          <option
                            key={category.category_id}
                            value={category.category_name}
                          >
                            {category.category_name}
                          </option>
                        ))}
                      </datalist>
                    </div>
                    <div className={styles.right_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        *Rack:
                      </label>
                      <input
                        type="text"
                        className={
                          productRackRequired && !productRack.rack_id
                            ? `${styles.productInput} ${styles.errorBorder}`
                            : `${styles.productInput}`
                        }
                        value={productRack.rack_no}
                        onChange={handleProductRackChange}
                        list="productRack"
                        ref={productRackRef}
                        placeholder={
                          productRackRequired &&
                          !productRack.rack_id &&
                          "Rack no is required"
                        }
                      />

                      {/* Render datalist with filtered rack options */}
                      <datalist id="productRack">
                        {filteredRacks.map((rack) => (
                          <option key={rack.rack_id} value={rack.rack_no} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div
                    className={`${styles.input_div} ${styles.forSomeMergine}`}
                  >
                    <div className={styles.left_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        *Product Code:
                      </label>
                      <input
                        type="text"
                        className={
                          productCodeRequired && !product_code
                            ? `${styles.productInput} ${styles.errorBorder}`
                            : `${styles.productInput}`
                        }
                        value={product_code}
                        onChange={(e) => {
                          setProductCode(e.target.value);
                          setproductCodeRequired(false);
                        }}
                        placeholder={
                          productCodeRequired &&
                          !product_code &&
                          "Product Code is required"
                        }
                        disabled={product_trace_id ? true : false}
                      />
                    </div>
                    <div className={styles.right_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        *Name:
                      </label>
                      <input
                        type="text"
                        className={
                          productNameRequired && !name
                            ? `${styles.productInput} ${styles.errorBorder}`
                            : `${styles.productInput}`
                        }
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setproductNameRequired(false);
                        }}
                        placeholder={
                          productNameRequired &&
                          !name &&
                          "Product Name is required"
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.input_div}>
                    <div className={styles.left_div}>
                      <label htmlFor="code" className={styles.pLabel}>
                        Type:
                      </label>
                      <input
                        type="text"
                        className={styles.productInput}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      />
                    </div>
                    <div className={styles.right_div}>
                      {" "}
                      <label htmlFor="code" className={styles.pLabel}>
                        Model:
                      </label>
                      <input
                        type="text"
                        className={styles.productInput}
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* /=================/images: */}
                  <div className={`${styles.image_input_div} `}>
                    <div className={`${styles.right_div} `}>
                      <div
                        className={`${styles.image_div} ${styles.selected_img_div}`}
                      >
                        <div className={`${styles.mb_1}`}>
                          <label className={`${styles.img_btn}`}>
                            {image ? (
                              <span className={styles.imageName}>
                                {image.name
                                  ? image.name.substring(0, 19)
                                  : image.substring(0, 19)}
                              </span>
                            ) : (
                              <IoMdPhotos className={styles.imageIcon} />
                            )}
                            <input
                              type="file"
                              name="photo"
                              accept="image/*"
                              id="photoInput"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // const reader = new FileReader();
                                  // reader.onloadend = () => {
                                  //   setImage(reader.result);
                                  // };
                                  // reader.readAsDataURL(file);
                                  setImage(file);
                                  setImageChange(true);
                                }
                              }}
                              hidden
                            />
                          </label>
                        </div>

                        <div className={`${styles.mb_1} `}>
                          {image ? (
                            <div
                              className={`${styles.text_center} ${styles.img_btn_div}`}
                            >
                              <img
                                src={
                                  imageChange
                                    ? URL.createObjectURL(image)
                                    : image
                                }
                                alt="product image"
                                className={`${styles.img} ${styles.img_responsive}`}
                                onClick={() => {
                                  document.getElementById("photoInput").click();
                                }}
                                style={{ cursor: "pointer" }}
                              />
                              {imageChange && (
                                <button
                                  className={`${styles.btn} ${styles.uploadBtn}`}
                                  onClick={handleUploadImage}
                                >
                                  UPLOAD
                                </button>
                              )}
                            </div>
                          ) : null}
                        </div>

                        {/* end */}
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.input_div} `}>
                    <div
                      className={`${styles.sanitory_btn} ${styles.lastIconDiv}`}
                    >
                      <button
                        className={`${styles.sanity_icon} ${styles.refresh} ${styles.refresh2}`}
                        onClick={() => resetAll()}
                      >
                        <IoReloadCircleOutline />{" "}
                      </button>
                      <button
                        className={`${styles.sanity_icon} ${styles.save}`}
                        onClick={product_trace_id ? updateProduct : saveProduct}
                      >
                        {product_trace_id ? (
                          <FaEdit className={styles.saveIcon} />
                        ) : (
                          <IoIosSave className={styles.saveIcon} />
                        )}
                      </button>
                      <button
                        className={`${styles.sanity_icon} ${styles.delete} ${styles.delete2}`}
                        onClick={() => {
                          if (product_trace_id) {
                            setProductModal(true);
                          } else {
                            toast.error("Please select a product to delete!");
                          }
                        }}
                      >
                        <RiDeleteBin6Line />{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //barcode footer div start from here */}
        <div className={`${styles.cash_Footer} `}>
          <div className={styles.totalDiv}>
            <div className={styles.Amount}>
              <div className={styles.amountebelDiv}>
                <label htmlFor="Amount" className={styles.amountLabel}>
                  Product Code
                </label>
              </div>
              <div className={styles.amountInputDiv}>
                <input
                  type="text"
                  className={styles.amountInput}
                  value={barcodeProductCode}
                />
              </div>
            </div>
            <div className={styles.Amount}>
              <div className={styles.amountebelDiv}>
                <label htmlFor="Amount" className={styles.amountLabel}>
                  Product Name
                </label>
              </div>
              <div className={styles.amountInputDiv}>
                <input
                  type="text"
                  className={styles.amountInput}
                  value={barcodeProductName}
                />
              </div>
            </div>
          </div>
          <div className={styles.cashOperationDiv}>
            <div className={styles.chasOperationBtnDiv}>
              <div className={styles.divForALlbutton}>
                <button
                  className={styles.chasOperationBtn}
                  onClick={handlePrint}
                >
                  <BiBarcodeReader className={styles.barcodeIcon} />
                </button>
                <p className={styles.buttonText}>Generate Barcode</p>
              </div>
            </div>
          </div>
          <div className={styles.excelExportDiv}>
            {/* <div className={styles.excelExportBtnDiv}>
              <div className={styles.divForALlbutton}>
                <button
                  className={styles.excelExportBtn}
                  onClick={handleXlDownload}
                >
                  <BsFillFileEarmarkExcelFill className={styles.xlIcon} />
                </button>
                <p className={styles.buttonText}>Excel Report</p>
              </div>
            </div> */}

            <ExportExcel excelData={items} fileName={"AddProduct"} />
          </div>
          <div style={{ display: "none" }}>
            <ComponentToPrint ref={componentRef} code={product_code} />
          </div>
        </div>

        {/* =========================/product  modal starts from here=========================== */}
        <div className={styles.deleteModal_container}>
          <Modal
            title={null}
            open={productModal}
            onCancel={() => setProductModal(false)}
            footer={null}
            closable={false}
            // styles={{ padding: 0, margin: 0 }}
            style={{
              top: 320,
              bottom: 0,
              left: 80,
              right: 0,
              maxWidth: "24%",
              minWidth: "16%",
              height: "2vh",
            }}
          >
            <div className={styles.delete_modal}>
              <div className={styles.delete_modal_box}>
                <p className={styles.delete_popup_text}>
                  Are you sure to delete this?
                </p>
                <p className={styles.delete_popup_revert_text}>
                  You won't be able to revert this!
                </p>

                <div className={styles.delete_modal_btn_div}>
                  <button
                    className={styles.delete_modal_buttonCancel}
                    onClick={() => setProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProductDeleteTrue}
                    className={styles.delete_modal_buttoDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        {/* =========================/category delete modal starts from here=========================== */}
        <div className={styles.deleteModal_container}>
          <Modal
            title={null}
            open={categoryModal}
            onCancel={() => setCategoryModal(false)}
            footer={null}
            closable={false}
            style={{
              top: 80,
              bottom: 0,
              left: 120,
              right: 0,
              maxWidth: deleteCategory ? "24%" : "45%",
              minWidth: deleteCategory ? "16%" : "30%",
              height: "2vh",
            }}
          >
            {deleteCategory ? (
              <>
                <div className={styles.delete_modal}>
                  <div className={styles.delete_modal_box}>
                    <p className={styles.delete_popup_text}>
                      Are you sure to delete this category?
                    </p>
                    <p className={styles.delete_popup_revert_text}>
                      You won't be able to revert this!
                    </p>

                    <div className={styles.delete_modal_btn_div}>
                      <button
                        className={styles.delete_modal_buttonCancel}
                        onClick={() => setCategoryModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCategoryDeleteTrue}
                        className={styles.delete_modal_buttoDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </Modal>
        </div>
        {/* =========================/rack  modal starts from here=========================== */}
        <div className={styles.deleteModal_container}>
          <Modal
            title={null}
            open={rackModal}
            onCancel={() => setRackModal(false)}
            footer={null}
            closable={false}
            styles={{ padding: 0, margin: 0 }}
            style={{
              top: 150,
              bottom: 0,
              left: 120,
              right: 0,
              maxWidth: deleteRack ? "24%" : "45%",
              minWidth: deleteRack ? "16%" : "30%",
              height: "2vh",
            }}
          >
            {deleteRack ? (
              <div className={styles.rackDeleteModal}>
                <div className={styles.delete_modal}>
                  <div className={styles.delete_modal_box}>
                    <p className={styles.delete_popup_text}>
                      Are you sure to delete this rack?
                    </p>
                    <p className={styles.delete_popup_revert_text}>
                      You won't be able to revert this!
                    </p>

                    <div className={styles.delete_modal_btn_div}>
                      <button
                        className={styles.delete_modal_buttonCancel}
                        onClick={() => {
                          setRackModal(false);
                          setDeleteRack(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRackDeleteTrue}
                        className={styles.delete_modal_buttoDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </Modal>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Addproducts;
