import React from "react";
import { FaChartBar, FaLuggageCart } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaChartArea } from "react-icons/fa";

import { TiShoppingCart } from "react-icons/ti";
import { FaSackDollar } from "react-icons/fa6";
const TopMenu = ({ data }) => {
  // todaysTotalSale,
  // todaysTotalIncome,
  // todaysTotalsellQuantity,
  // totalSale,
  // totalCost,
  // netIncome,
  return (
    <div className="dash_graph_top">
      <div className="top_g top_g1">
        <div className="icon_div">
          <FaChartLine style={{ color: "#dd4f4f", fontSize: "3.2vw" }} />
        </div>
        <div className="details_div">
          <h1 className="details_title">Today's sales</h1>
          <h2 className="amount">{data.todaysTotalSale} Tk</h2>
        </div>
      </div>
      <div className="top_g top_g2">
        <div className="icon_div">
          <FaChartArea style={{ color: "#f39c12", fontSize: "3.2vw" }} />
        </div>
        <div className="details_div">
          <h1 className="details_title">Today's Income</h1>
          <h2 className="amount">{data.todaysTotalIncome} Tk</h2>
        </div>
      </div>
      <div className="top_g top_g3">
        <div className="icon_div">
          <FaLuggageCart style={{ color: "	#7158E2", fontSize: "3.2vw" }} />
        </div>
        <div className="details_div">
          <h1 className="details_title">Sale Quantity</h1>
          <h2 className="amount">{data.todaysTotalsellQuantity}</h2>
        </div>
      </div>
      <div className="top_g top_g4">
        <div className="icon_div">
          <FaChartBar style={{ color: "#9B59B6	", fontSize: "3.2vw" }} />
        </div>
        <div className="details_div">
          <h1 className="details_title">Total Sales</h1>
          <h2 className="amount">{data.totalSale} Taka</h2>
        </div>
      </div>
      <div className="top_g top_g5">
        <div className="icon_div">
          <TiShoppingCart style={{ color: "#008080", fontSize: "3.2vw" }} />
        </div>
        <div className="details_div">
          <h1 className="details_title">Total Purchase</h1>
          <h2 className="amount">{data.totalCost} Tk</h2>
        </div>
      </div>
      <div className="top_g top_g6">
        <div className="icon_div">
          <FaSackDollar style={{ color: "#009CFF", fontSize: "3.2vw" }} />
        </div>
        <div className="details_div">
          <h1 className="details_title">Net Income</h1>
          <h2 className="amount">{data.netIncome} Tk</h2>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
