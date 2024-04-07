import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./piChartBox.css";
import { useTheme } from "../context/ThemeContext";

const PieChartBox = ({ data }) => {
  const [theme] = useTheme();
  const [rerenderChart, setRerenderChart] = useState(false);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        // textAnchor={x > cx ? "start" : "end"}
        textAnchor={"center"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    const handleReloadChart = () => {
      setRerenderChart(!rerenderChart);
    };
    handleReloadChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div
      className="pieChartBox"
      style={{ backgroundColor: theme === "light" && "#a3c5b2" }}
    >
      <h1
        style={{
          fontSize: "1.8vw",
          textAlign: "center",
          marginBottom: "2vh",
        }}
      >
        Current Month Top Sale Products
      </h1>
      <div className="Pi_charts">
        <ResponsiveContainer width="99%" height={200}>
          <PieChart key={rerenderChart ? "reload" : "initial"}>
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a3447",
                borderRadius: "5px",
              }}
              cursor={{ fill: "none" }}
              labelStyle={{ color: "white" }}
              wrapperClassName="tooltip-content" // Apply CSS class here
            />

            <Pie
              data={data}
              innerRadius={"35%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {data &&
                data.map((item) => <Cell key={item.name} fill={item.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {data &&
          data.map((item) => (
            <div className="option" key={item.name}>
              <div className="title">
                <div className="dot" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span>{item.value}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PieChartBox;
