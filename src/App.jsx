import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import NoPage from "./pages/noPage/NoPage";
import ProductInfo from "./pages/productInfo/ProductInfo";
import ScrollTop from "./components/scrollTop/ScrollTop";
import CartPage from "./pages/cart/CartPage";
import AllProduct from "./pages/allProduct/AllProduct";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import Contacts from "./components/Contact/Contact-Us";
import ThankYouPage from "./components/thankyou/ThankYouPage";
import UserDashboard from "./pages/user/UserDashboard";
import UserTable from "./pages/user/UserTable";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProductPage from "./pages/admin/AddProductPage";
import UpdateProductPage from "./pages/admin/UpdateProductPage";
import MyState from "./context/myState";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";
import CategoryPage from "./pages/category/CategoryPage";
import OverviewPage from "./pages/admin/OverviewPage";
import SalesPage from "./pages/admin/SalesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import UsersPage from "./pages/admin/UsersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import TermsOfUse from "./pages/policy/TermsOfUse";
import PrivacyPolicy from "./pages/policy/PrivacyPolicy";
import Shipping from "./pages/policy/Shipping&Cancellation";
import ReturnsExchangeRefunds from "./pages/policy/ReturnsExchangeRefunds";
import ProductServicePolicy from "./pages/policy/ProductServicePolicy";
import Export from "./pages/export/export";
import Carrer from "./pages/carrer/Carrer";
import QualificationCertification from "./pages/q&c/Qualification";
import SpicesProduct from "./pages/allProduct/SpicesProduct";
import LecithinProduct from "./pages/allProduct/LecithinProduct";
import SpicesProductInfo from "./pages/productInfo/SpicesProductInfo";
import LecithinProductInfo from "./pages/productInfo/LecithinProductInfo";
import AddExportProduct from "./pages/admin/AddExport";
import Company from "./pages/company/Company";
import UserLogin from "./pages/registration/UserLogin";
import UserMessage from "./pages/admin/UserMessage";
import UserCarrer from "./pages/admin/UserCarrer";
import ProgressOrder from "./pages/admin/ProgressOrder";
import CompletedOrder from "./pages/admin/CompletedOrder";

const App = () => {
  return (
    <MyState>
      <Router>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NoPage />} />
          <Route path="/company" element={<Company />} />
          <Route path="/export" element={<Export />} />
          <Route path="/carrer" element={<Carrer />} />
          <Route path="/qualification" element={<QualificationCertification />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/spicesproductinfo/:id" element={<SpicesProductInfo />} />
          <Route path="/lecithinproductinfo/:id" element={<LecithinProductInfo />} />
          <Route path="/cart" element={
            <ProtectedRouteForUser>
              <CartPage />
            </ProtectedRouteForUser>
          } />
          <Route path="/allproduct" element={<AllProduct />} />
          <Route path="/thankyoupage" element={<ThankYouPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path={"/userlogin"} element={<UserLogin />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/category/:categoryname" element={<CategoryPage />} />  {/* category Page route  */}
          <Route path="/spicesProduct" element={<SpicesProduct />} />
          <Route path="/lecithinProduct" element={<LecithinProduct />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/UserTable" element={<UserTable />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRouteForAdmin>
              <OverviewPage />
            </ProtectedRouteForAdmin>

          } />
          <Route path="/addproduct" element={
            <ProtectedRouteForAdmin>
              <AddProductPage />
            </ProtectedRouteForAdmin>

          } />
          <Route path="/addexport" element={
            <ProtectedRouteForAdmin>
              <AddExportProduct />
            </ProtectedRouteForAdmin>

          } />

          <Route path="/updateproduct/:id" element={
            <ProtectedRouteForAdmin>
              <UpdateProductPage />

            </ProtectedRouteForAdmin>
          } />
          <Route path="/adminSalesPage" element={<SalesPage />} />
          <Route path="/userMessages" element = {<UserMessage/> }/>
          <Route path="/userCarrer" element = {<UserCarrer/> }/>
          <Route path="/adminAnalytics" element={<AnalyticsPage />} />
          <Route path="/adminProductPage" element={<ProductsPage />} />
          <Route path="/adminUserPage" element={<UsersPage />} />
          <Route path="/adminSettings" element={<SettingsPage />} />
          <Route path="/adminOrders" element={<OrdersPage />} />
          <Route path="/admininProgressOrders" element={<ProgressOrder />} />
          <Route path="/adminCompletedOrders" element={<CompletedOrder />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cancellation" element={<Shipping />} />
          <Route path="/returns" element={<ReturnsExchangeRefunds />} />
          <Route path="/Products_and_Service" element={<ProductServicePolicy />} />


        </Routes>
        <Toaster />
      </Router>
    </MyState>
  );
}

export default App;
