import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { FcBullish} from "react-icons/fc";

import { FaLuggageCart } from "react-icons/fa";

import { TiShoppingCart } from "react-icons/ti"; //Purchase 
import { BsCashCoin} from "react-icons/bs"; // Cashbook
import { FaSackDollar } from "react-icons/fa6"; // Expense
import { LiaFileInvoiceSolid} from "react-icons/lia"; //Quotation
import { BsMegaphone} from "react-icons/bs"; //Marketing

 
export const SidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: ["ROLE_ADMIN"],
    
  },
  {
    title: "Sales",
    icon: <FcBullish/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: ["ROLE_SELLER", "ROLE_ADMIN"],
 
    subNav: [
      {
        title: "Sales",
        path: "/salepage",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Product Sales Report",
        path: "/sale/product-sale-report",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Customer Transactions Report",
        path: "/sale/customer-transactions-report",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Stock",
    icon: <FaLuggageCart/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: ["ROLE_SELLER", "ROLE_ADMIN"],
    subNav: [
        {
          title: "Stock Report",
          path: "/stock/stock-report",
          icon: <IoIcons.IoIosPaper />,
        },
        {
            title: "Add Product",
            path: "/stock/addproduct",
            icon: <IoIcons.IoIosPaper />,
        }
        
      ],
  },
  {
    title: "Purchase",
    icon: <TiShoppingCart />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["ROLE_SELLER", "ROLE_ADMIN"],
 
    subNav: [
      {
        title: "Purchase Operation",
        path: "/purchase-operation",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Product Purchase Report",
        path: "/purchase/product-purchase-report",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Supplier Transactions Report",
        path: "/purchase/supplier-transactions-report",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Cash Book",
    icon: <BsCashCoin/>,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: ["ROLE_ADMIN"],
 
    subNav: [
      {
        title: "Cash Book",
        path: "/cashbook",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Income & Expense",
    icon: <FaSackDollar />,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: [ "ROLE_ADMIN"],
   
    subNav: [
      {
        title: "Expense Input",
        path: "/income-expense/expense-iput",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Expense Report",
        path: "/income-expense/expense-report",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Profit/Loss",
        path: "/income-expense/profit-loss",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Quotation",
    icon: <LiaFileInvoiceSolid />,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: [ "ROLE_ADMIN"],
 
    subNav: [
      {
        title: "Quotation",
        path: "/quotation",
        icon: <IoIcons.IoIosPaper />,
      },
      
    ],
  },
  {
    title: "Marketing and Collection",
    icon: <BsMegaphone />,
 
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
     allowedRoles: [ "ROLE_ADMIN"],
 
    subNav: [
      {
        title: "Marketing and Collection",
        path: "/marketing/marketing-due-collection",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Employee Setup",
        path: "/marketing/employee-setup",
        icon: <IoIcons.IoIosPaper />,
      }
    ],
  },
];

 