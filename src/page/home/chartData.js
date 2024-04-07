import React, { useState, useEffect } from "react";

//===================making Top 10 Sale Products starts here====================
export const topTenSaleProducts = (items) => {
  function getTop10Products(data) {
    if (!Array.isArray(data)) {
      console.error("Data is not an array.");
      return [];
    }

    const productCounts = {};
    data.forEach((item) => {
      if (
        item.ProductTrace &&
        item.ProductTrace.name &&
        item.operation_type_id === 1 &&
        item.Unit &&
        item.Unit.unit
      ) {
        const productName = item.ProductTrace.name;
        let quantityToAdd = parseFloat(item.quantity_no); // Default quantity to add
        let unitName = "";

        // Check if the product name is "EAGGS"
        if (
          productName === "EAGGS" ||
          productName === "EGGS" ||
          productName === "eggs" ||
          productName === "egg" ||
          productName === "EGG"
        ) {
          quantityToAdd /= 12; // Divide quantity by 12 for "EAGGS" products
          unitName = "Dozen"; // Set unit name to "Dozen"
        } else {
          // For products other than "EAGGS", use the unit name as is
          unitName = item.Unit.unit;
        }

        // Update productCounts based on the calculated quantityToAdd
        if (productCounts[productName]) {
          productCounts[productName] += quantityToAdd;
        } else {
          productCounts[productName] = quantityToAdd;
        }
      }
    });

    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const top10Products = sortedProducts.map(([name, quantity]) => ({
      name,
      Quantity: quantity.toFixed(2),
    }));

    return top10Products;
  }

  // Call the function with the provided data
  const top10Products = getTop10Products(items);

  const chartBoxProducts = {
    dataKey: "Quantity",
    chartData: top10Products.map((product) => ({
      name: product.name,
      Quantity: product.Quantity,
    })),
  };

  return chartBoxProducts;
};

//===================making Total sale by month starts here====================
export const monthlySale = (items) => {
  function calculateTotalSalesByMonth(transactions) {
    const salesByMonth = {};

    transactions.forEach((item) => {
      if (item.OperationType && item.OperationType.operation_type_id === 1) {
        const date = new Date(item.date);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month}-${year}`;

        if (!salesByMonth[key]) {
          salesByMonth[key] = 0;
        }

        //vat handling:
        if (item?.Tax?.rate) {
          salesByMonth[key] += parseFloat(
            item.sale_price * item.quantity_no -
              (item.sale_price * item.quantity_no * item?.discount) / 100 +
              ((item.sale_price * item.quantity_no -
                (item.sale_price * item.quantity_no * item?.discount) / 100) *
                item.Tax.rate) /
                100
          );
        } else {
          salesByMonth[key] += parseFloat(
            item.sale_price * item.quantity_no -
              (item.sale_price * item.quantity_no * item?.discount) / 100
          );
        }
      }
    });

    const salesArray = Object.entries(salesByMonth).map(([key, value]) => ({
      month: key,
      totalSale: value.toFixed(2),
    }));

    return salesArray;
  }

  const totalSalesByMonth = calculateTotalSalesByMonth(items);

  // Check if totalSalesByMonth is an array
  if (!Array.isArray(totalSalesByMonth)) {
    console.error("Error: totalSalesByMonth is not an array.");
    return null;
  }

  totalSalesByMonth.forEach((item) => {
    const [month, year] = item.month.split("-");
    item.date = new Date(`${month} 01, ${year}`);
  });

  totalSalesByMonth.sort((a, b) => b.date - a.date);

  const last12MonthsSales = totalSalesByMonth.slice(0, 12);

  const chartData = [];

  last12MonthsSales.forEach((item) => {
    const month = item.date.toLocaleString("en-US", { month: "long" });
    chartData.push({ name: month, totalSale: item.totalSale });
  });

  const chartBoxSale = {
    dataKey: "totalSale",
    chartData: chartData,
  };

  return chartBoxSale;
};

//=================== monthlyTopTenSaleProducts===============
export const monthlyTopTenSaleProducts = (items) => {
  // Example colors for each item
  const piChartColors = ["#DD4F4F", "#F39C12", "#0088FE", "#9B59B6", "#008080"];

  function getCurrentMonthTop10Products(data) {
    if (!Array.isArray(data)) {
      console.error("Error: Data is not an array.");
      return [];
    }

    const currentMonth = new Date();
    const currentMonthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const currentMonthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const currentMonthItems = data.filter((item) => {
      if (!item.date || isNaN(new Date(item.date))) {
        console.error("Error: Invalid date found in data.");
        return false;
      }

      const itemDate = new Date(item.date);
      return itemDate >= currentMonthStart && itemDate <= currentMonthEnd;
    });

    const productCounts = {};
    currentMonthItems.forEach((item) => {
      if (
        item.ProductTrace &&
        item.ProductTrace.name &&
        item.operation_type_id === 1 &&
        item.Unit &&
        item.Unit.unit
      ) {
        const productName = item.ProductTrace.name;
        let quantityToAdd = parseFloat(item.quantity_no);
        let unitName = "";

        // Check if the product name is "EAGGS"
        if (
          productName.toLowerCase().includes("eagg" || "eggs" || "egg") &&
          item.unit_id === 1
        ) {
          quantityToAdd /= 12;
          unitName = "Dozen";
        } else {
          unitName = item.Unit.unit;
        }

        if (productCounts[productName]) {
          productCounts[productName] += quantityToAdd;
        } else {
          productCounts[productName] = quantityToAdd;
        }
      }
    });

    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const top10Products = sortedProducts.map(([name, quantity]) => {
      return {
        name,
        quantity: quantity.toFixed(2),
        unitName:
          currentMonthItems.find(
            (item) =>
              item.ProductTrace &&
              item.ProductTrace.name === name &&
              item.operation_type_id === 1 &&
              item.Unit &&
              item.Unit.unit
          )?.unit_id === 1 &&
          name.toLowerCase().includes("eagg" || "eggs" || "egg")
            ? "Dozen"
            : currentMonthItems.find(
                (item) =>
                  item.ProductTrace &&
                  item.ProductTrace.name === name &&
                  item.operation_type_id === 1 &&
                  item.Unit &&
                  item.Unit.unit
              )?.Unit.unit || "",
      };
    });

    return top10Products;
  }

  // Call the function with the provided data
  const currentMonthTop10Products = getCurrentMonthTop10Products(items);

  const piChartData = currentMonthTop10Products.map((product, index) => ({
    name: product.name + " (" + product.unitName + ")",
    value: parseFloat(product.quantity), // Ensure quantity is parsed as a float
    color: piChartColors[index % piChartColors.length],
  }));
  return piChartData;
};

//styles:
export const allTimeTopTen_ProductStyle = {
  color: "#009CFF",
  colors: ["#7158e2", "#671686", "#9b59b6"],
  title: "Top Sale Products",
};

export const lastTweelveMonth_SaleStyle = {
  color: "teal",
  colors: ["#0088FE", "#DD4F4F", "#e67e22"],
  title: "Monthly Sale",
};

//=================topbar chart data is handling here===============:

//=============todays total sale========:
export const todaysSaleFunction = (items) => {
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalSale = 0;

  items.forEach((item) => {
    if (!item.date || isNaN(new Date(item.date))) {
      console.error("Error: Invalid date found in items.");
      return 0;
    }

    const transactionDate = new Date(item.date);
    transactionDate.setHours(0, 0, 0, 0);

    if (
      transactionDate.getTime() === today.getTime() &&
      item.operation_type_id === 1
    ) {
      //vat handling:
      if (item?.Tax?.rate) {
        totalSale += parseFloat(
          item.sale_price * item.quantity_no -
            (item.sale_price * item.quantity_no * item?.discount) / 100 +
            ((item.sale_price * item.quantity_no -
              (item.sale_price * item.quantity_no * item?.discount) / 100) *
              item.Tax.rate) /
              100
        );
      } else {
        totalSale += parseFloat(
          item.sale_price * item.quantity_no -
            (item.sale_price * item.quantity_no * item?.discount) / 100
        );
      }
    }
  });

  return totalSale.toFixed(2);
};

//============================todays income=====================:
export const todaysIncomefunction = (items) => {
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0;
  }

  const todayDate = new Date().toISOString()?.slice(0, 10);
  //filter sell items
  const filteredItems = items.filter((item) => {
    if (!item) {
      console.error("Error: Found null or undefined item in 'items'.");
      return false;
    }
    const itemDate = item.date?.slice(0, 10);
    return itemDate === todayDate && item.operation_type_id === 1;
  });

  //filter purchasesell items
  const filteredPurchaseItems = items.filter((item) => {
    if (!item) {
      console.error("Error: Found null or undefined item in 'items'.");
      return false;
    }
    return item.operation_type_id === 2;
  });

  const totalPurchaseAmount = filteredItems.reduce((total, item) => {
    if (!item) {
      console.error("Error: Found null or undefined item in 'filteredItems'.");
      return total;
    }

    //tax for  this item in purchase time
    const purchasedItem = filteredPurchaseItems.find(
      (PurchaseItem) => PurchaseItem.product_trace_id === item.product_trace_id
    );
    const purchaseItemTax = purchasedItem?.Tax?.rate || 0;

    if (purchaseItemTax > 0) {
      const itemAmount = parseFloat(
        item.purchase_price * item.quantity_no -
          (item.purchase_price * item.quantity_no * item?.discount) / 100 +
          ((item.purchase_price * item.quantity_no -
            (item.purchase_price * item.quantity_no * item?.discount) / 100) *
            item.Tax.rate) /
            100
      );
      return total + itemAmount;
    } else {
      const itemAmount = parseFloat(
        item.purchase_price * item.quantity_no -
          (item.purchase_price * item.quantity_no * item?.discount) / 100
      );
      return total + itemAmount;
    }
  }, 0);

  // todays total sell price
  const todaysTotalSell = todaysSaleFunction(items);

  // now todays net income
  const netIncome = todaysTotalSell - totalPurchaseAmount;

  return netIncome.toFixed(2);
};

//============================todays total sale quantity:===================
export const todaysTotalQuantityFunction = (items) => {
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0;
  }

  const today = new Date().toISOString()?.slice(0, 10);

  const todaysItems = items.filter((item) => {
    return item?.date?.slice(0, 10) === today && item?.operation_type_id === 1;
  });

  const sumOfQuantity = todaysItems.reduce((sum, item) => {
    if (!item) {
      console.error("Error: Found null or undefined item in 'todaysItems'.");
      return sum;
    }

    // Using optional chaining and nullish coalescing operator for null handling
    const quantity = parseFloat(item.quantity_no) ?? 0;
    return sum + quantity;
  }, 0);

  return sumOfQuantity.toFixed(2);
};

//=================================total sale=========================:
export const totalSaleFunction = (items) => {
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0;
  }

  let totalAmount = 0;

  items.forEach((item) => {
    if (item && item.operation_type_id === 1) {
      //vat handling:
      if (item?.Tax?.rate) {
        totalAmount += parseFloat(
          item.sale_price * item.quantity_no -
            (item.sale_price * item.quantity_no * item?.discount) / 100 +
            ((item.sale_price * item.quantity_no -
              (item.sale_price * item.quantity_no * item?.discount) / 100) *
              item.Tax.rate) /
              100
        );
      } else {
        totalAmount += parseFloat(
          item.sale_price * item.quantity_no -
            (item.sale_price * item.quantity_no * item?.discount) / 100
        );
      }
    }
  });

  return totalAmount.toFixed(2);
};

//===========================total cost=======================:
export const totalCostFunction = (items) => {
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0;
  }

  let totalAmountNot1 = 0;

  items.forEach((item) => {
    if (item?.operation_type_id === 2) {
      //vat handling:
      if (item?.Tax?.rate) {
        totalAmountNot1 += parseFloat(
          item.purchase_price * item.quantity_no -
            (item.purchase_price * item.quantity_no * item?.discount) / 100 +
            ((item.purchase_price * item.quantity_no -
              (item.purchase_price * item.quantity_no * item?.discount) / 100) *
              item.Tax.rate) /
              100
        );
      } else {
        totalAmountNot1 += parseFloat(
          item.purchase_price * item.quantity_no -
            (item.purchase_price * item.quantity_no * item?.discount) / 100
        );
      }
    }
  });

  return totalAmountNot1.toFixed(2);
};

//=============================net income=========================:
export const netIncomeFunction = (items) => {
  if (!Array.isArray(items)) {
    console.error("Error: 'items' is not an array.");
    return 0;
  }

  const totalCostAmount = totalCostFunction(items);
  const totalSaleAmount = totalSaleFunction(items);

  const netIncome = totalSaleAmount - totalCostAmount;

  return netIncome.toFixed(2);
};

//===========current date============:
export function CurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []); // Run only once when component mounts

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = `${days[currentDate.getDay()]}, ${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${
    months[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  return (
    <div>
      <p className="date_text">{formattedDate}</p>
    </div>
  );
}
