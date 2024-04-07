import LoginPage from "./page/authentication/LoginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { AuthProvider} from './page/authentication/Auth';
import PurchaseOperation from "./page/purchase/PurchaseOperation";
import Sidebar from "./components/Sidebar";
import StockOperation from "./page/stock/StockOperation";
import PurchasesReport from "./page/purchase/PurchasesReport";
import SupplierReport from "./page/purchase/SupplierReport";
import SalePage from "./page/sale/SalePage";
import Signup from "./page/authentication/SignUp";
import Home from "./page/home/HomeDashboard";
import SaleReport from "./page/sale/SaleReport";
import CustomerTranscationReport from "./page/sale/CustomerTransactionReport";
import Addproducts from "./page/stock/Addproducts";
import CashBook from "./page/cashbook/CashBook";
import EmployeeSetup from "./page/markenting/EmployeeSetup";
import MarketingDueCollection from "./page/markenting/MarketingDueCollection";
import ExpanceReport from "./page/income-expense/ExpenseReport";
import ExpanceInput from "./page/income-expense/ExpenseInput";
import Quotation from "./page/quotation/Quotation";
import { AuthProvider, useAuth } from "./page/authentication/Auth";
import DateBaseIncome from "./page/income-expense/DateBaseIncome";
import BulksalePage from "./page/sale/Bulksale_page";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/signup"
            element={<AdminProtectedRoute component={<Signup />} />}
          />
          <Route
            path="/home"
            element={
              <div>
                <Sidebar />
                <AdminProtectedRoute component={<Home />} />
              </div>
            }
          ></Route>
          <Route
            path="/purchase-operation"
            element={
              <div>
                <Sidebar pageName="Purchase Operation" />
                <ProtectedRoute component={<PurchaseOperation />} />
              </div>
            }
          ></Route>
          <Route
            path="/purchase/product-purchase-report"
            element={
              <div>
                <Sidebar pageName="Product Purchase Report" />
                <ProtectedRoute component={<PurchasesReport />} />
              </div>
            }
          ></Route>
          <Route
            path="/stock/stock-report"
            element={
              <div>
                <Sidebar pageName="Stock Report" />
                <ProtectedRoute component={<StockOperation />} />
              </div>
            }
          ></Route>
          <Route
            path="/purchase/supplier-transactions-report"
            element={
              <div>
                <Sidebar pageName="Supplier Transactions Report" />
                <ProtectedRoute component={<SupplierReport />} />
              </div>
            }
          ></Route>
          <Route
            path="/salepage"
            element={
              <div>
                <Sidebar pageName="Sale Page" />
                <ProtectedRoute component={<SalePage />} />
              </div>
            }
          ></Route>
          <Route
            path="/bulk-salepage"
            element={
              <div>
                <Sidebar pageName="Bulk Sale Page" />
                <ProtectedRoute component={<BulksalePage />} />
              </div>
            }
          ></Route>
          <Route
            path="/stock/addproduct"
            element={
              <div>
                <Sidebar pageName="Add Product" />
                <ProtectedRoute component={<Addproducts />} />
              </div>
            }
          ></Route>
          <Route
            path="/sale/product-sale-report"
            element={
              <div>
                <Sidebar pageName="Product Sale Report" />
                <ProtectedRoute component={<SaleReport />} />
              </div>
            }
          ></Route>
          <Route
            path="/sale/customer-transactions-report"
            element={
              <div>
                <Sidebar pageName="Customer Transactions Report" />
                <ProtectedRoute component={<CustomerTranscationReport />} />
              </div>
            }
          ></Route>
          <Route
            path="/cashbook"
            element={
              <div>
                <Sidebar pageName="Cashbook" />
                <AdminProtectedRoute component={<CashBook />} />
              </div>
            }
          ></Route>
          <Route
            path="/income-expense/expense-iput"
            element={
              <div>
                <Sidebar pageName="Expense Input" />
                <AdminProtectedRoute component={<ExpanceInput />} />
              </div>
            }
          ></Route>
          <Route
            path="/income-expense/expense-report"
            element={
              <div>
                <Sidebar pageName="Expense Report" />
                <AdminProtectedRoute component={<ExpanceReport />} />
              </div>
            }
          ></Route>
          <Route
            path="/income-expense/profit-loss"
            element={
              <div>
                <Sidebar pageName="Profit/Loss" />
                <AdminProtectedRoute component={<DateBaseIncome />} />
              </div>
            }
          ></Route>
          <Route
            path="/quotation"
            element={
              <div>
                <Sidebar pageName="Quotation" />
                <AdminProtectedRoute component={<Quotation />} />
              </div>
            }
          ></Route>
          <Route
            path="/marketing/marketing-due-collection"
            element={
              <div>
                <Sidebar pageName="Marketing Due Collection" />
                <AdminProtectedRoute component={<MarketingDueCollection />} />
              </div>
            }
          ></Route>
          <Route
            path="/marketing/employee-setup"
            element={
              <div>
                <Sidebar pageName="Employee Setup" />
                <AdminProtectedRoute component={<EmployeeSetup />} />
              </div>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
const ProtectedRoute = ({ component }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? component : <Navigate to="/" replace />;
};

const AdminProtectedRoute = ({ component }) => {
  const admin = localStorage.getItem("role");
  const { isLoggedIn } = useAuth();

  return isLoggedIn && admin === "ROLE_ADMIN" ? (
    component
  ) : (
    <Navigate to="/" replace />
  );
};
export default App;
