import React, { useEffect, useState } from "react";
import "./homeDashboard.css";
import { useTheme } from "../../components/DashboardComponent/context/ThemeContext";
import Footer from "../../components/DashboardComponent/Footer/Footer";
import BarChartBox from "../../components/DashboardComponent/BarChart/BarChartBox";
import PieChartBox from "../../components/DashboardComponent/PiChartBox/PiChartBox";
import TopMenu from "../../components/DashboardComponent/TopMenu/TopMenu";
import ThemeToggle from "../../components/DashboardComponent/ThemeToggle/ThemeToggle";

import {
  monthlySale,
  monthlyTopTenSaleProducts,
  topTenSaleProducts,
  allTimeTopTen_ProductStyle,
  lastTweelveMonth_SaleStyle,
  netIncomeFunction,
  totalSaleFunction,
  totalCostFunction,
  todaysIncomefunction,
  todaysTotalQuantityFunction,
  todaysSaleFunction,
  CurrentDate,
} from "./chartData";
import axios from "axios";

const HomeDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [theme, toggle] = useTheme();

  const [items, setItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fixedItems, setFixedItem] = useState([]);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  //fetch all transections:
  const fetchData = async () => {
    try {
      const transectionsData = sessionStorage.getItem("transectionsData");
      if (transectionsData) {
        setItems(JSON.parse(transectionsData));
        setFixedItem(JSON.parse(transectionsData));
      } else {
        const response = await axiosInstance.get(
          "/transactionsRouter/getAllTransactions"
        );
        setItems(response.data);
        setFixedItem(response.data);
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
    document.title = "Home";
    fetchData();
    return () => sessionStorage.removeItem("transectionsData");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //=====Real time chard data handling====================
  const AllTimeTopTenSaleProducts = topTenSaleProducts(items);
  const lastTweelveIndividualMonthSale = monthlySale(items);
  const LastMonthTopTenSaleProducts = monthlyTopTenSaleProducts(items);

  //todays sale:
  const todaysTotalSale = items ? todaysSaleFunction(items) : 0;
  //todays totalIncome:
  const todaysTotalIncome = items ? todaysIncomefunction(items) : 0;

  // const todaysTotalIncome = todaysSaleFunction(items);

  //todays total sell quantity:
  const todaysTotalsellQuantity = items
    ? todaysTotalQuantityFunction(items)
    : 0;
  //totalSale:
  const totalSale = items ? totalSaleFunction(items) : 0;
  //totalCost:
  const totalCost = items ? totalCostFunction(items) : 0;
  //netIncome:
  const netIncome = items ? netIncomeFunction(items) : 0;

  return (
    <div className="homeDashboard">
      <div className="home_dash_sideBar"></div>
      <div className={`Dashboard_container ${theme} `}>
        <div className="dash_nav">
          <div className="nav_container">
            <div className="nav_left">
              <h1 className="nav_text">DASHBOARD</h1>
            </div>
            <div className="nav_middle">
              <CurrentDate />{" "}
            </div>
            <div className="nav_right">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="dash_main">
          <div className="dash_bar_container">
            {/* <div className="dash_sidebar"></div> */}
            <div className="dash_graph">
              <TopMenu
                data={{
                  todaysTotalSale,
                  todaysTotalIncome,
                  todaysTotalsellQuantity,
                  totalSale,
                  totalCost,
                  netIncome,
                }}
              />
              <div className="dash_graph_main">
                <div
                  className="bragraph1"
                  style={{ border: theme === "dark" && "1px solid #1f273a" }}
                >
                  <BarChartBox
                    Data={AllTimeTopTenSaleProducts}
                    style={allTimeTopTen_ProductStyle}
                  />
                </div>
                <div
                  className="bragraph2"
                  style={{ border: theme === "dark" && "1px solid #1f273a" }}
                >
                  <BarChartBox
                    Data={lastTweelveIndividualMonthSale}
                    style={lastTweelveMonth_SaleStyle}
                  />
                </div>
                <div
                  className="bragraph3"
                  style={{ border: theme === "dark" && "1px solid #1f273a" }}
                >
                  <PieChartBox data={LastMonthTopTenSaleProducts} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash_footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
