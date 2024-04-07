import React, { useEffect, useState } from "react";
import "./barChartBox.css";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
const BarChartBox = ({ Data, style }) => {
  const [theme] = useTheme();
  const [rerenderChart, setRerenderChart] = useState(false);

  //chart reload
  useEffect(() => {
    const handleReloadChart = () => {
      setRerenderChart(!rerenderChart);
    };
    handleReloadChart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (
    !style.colors ||
    !Array.isArray(style.colors) ||
    style.colors.length === 0
  ) {
    // Handle the case when props.colors is undefined, not an array, or empty
    return null; // or return an error message or default component
  }

  return (
    <div
      className="BarChartBox"
      style={{ backgroundColor: theme === "light" && "#a3c5b2" }}
    >
      <h1 style={{ textAlign: "center" }}>{style.title}</h1>
      <div className="chart">
        <ResponsiveContainer
          width="99%"
          height={350}
          key={rerenderChart ? "reload" : "initial"}
        >
          <BarChart data={Data.chartData} animationDuration={2500}>
            <Legend />
            <XAxis dataKey="name" tick={{ fontSize: 14, dy: 10 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a3447",
                borderRadius: "5px",
                color: "white",
              }}
              cursor={{ fill: "none" }}
            />
            <Bar dataKey={Data.dataKey} fill={style.color}>
              {Data.chartData.map((data, index) => (
                <Cell
                  key={data.name}
                  fill={style.colors[index % style.colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartBox;
