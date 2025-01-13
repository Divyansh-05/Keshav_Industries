import { useContext, useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import user_logo from "/img/User_Logo.png";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../helper";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userObject, setUserObject] = useState();
  const [loading, setLoading] = useState(true); // Set loading to true initially

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"; // Handle null/undefined timestamp
    
    // If it's a Firestore Timestamp object (contains _seconds and _nanoseconds)
    if (timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
      return date.toLocaleString(); // Format the date as a local string
    }
  
    // If it's already a JavaScript Date object or string, handle accordingly
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString(); // If it's a native Date object
    }
  
    // Handle other unexpected formats or string timestamps
    return "Invalid Timestamp";
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          toast.error("No token found. Redirecting to login...")
          navigate("/userlogin");
          return;
        }

        // Make a request to fetch user data using the token
        const response = await axios.get(`${BASE_URL}/user/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        setUserObject(response.data.userData); // Set the user data from the response
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/userlogin"); // Redirect to login on error
      } finally {
        setLoading(false); // Stop the loader
      }
    };
    fetchUserData();
  }, [navigate]);

  const userLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="mx-auto px-4 py-6 bg-customNewBack my-0">
        {/* Account Details Section */}
        <motion.div
          className="text-center py-16 bg-eda72f"
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            User Dashboard
          </h1>
        </motion.div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row justify-between py-10 gap-3">
          {/* Account Details */}
          <motion.div
            className="bg-white p-8 shadow-lg rounded-lg w-full"
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-5"> <img src={user_logo} alt="User Icon" className="w-6 h-auto inline-block pb-2" /> Account Details</h2>
            <div className="text-start space-y-4">
              <h1 className="text-sm">
                <span className="font-bold">Name : </span>
                {userObject?.name}
              </h1>
              <h1 className="text-sm">
                <span className="font-bold">Email : </span>
                {userObject?.email}
              </h1>
              <h1 className="text-sm">
                <span className="font-bold">Phone : </span>
                {userObject?.mobile}
              </h1>
              <Button onClick={userLogout} className="mt-4">
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            className="bg-white p-8 shadow-lg rounded-lg flex-1"
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Order Details</h2>
            {/* Loader */}
            <div className="flex justify-center relative top-10">
              {loading && <Loader />}
            </div>

            {/* Order Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700 border border-black overflow-x-scroll">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="h-12 px-6 text-sm md:text-md text-slate-700 bg-slate-100 font-bold border-b border-black text-center"
                    >
                      S.No.
                    </th>
                    <th
                      scope="col"
                      className="h-12 px-6 text-sm md:text-md text-slate-700 bg-slate-100 font-bold border-b border-black text-center"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="h-12 px-6 text-sm md:text-md text-slate-700 bg-slate-100 font-bold border-b border-black text-center"
                    >
                      Date
                    </th>
                    {/* <th
                      scope="col"
                      className="h-12 px-6 text-sm md:text-md text-slate-700 bg-slate-100 font-bold border-b border-black text-center"
                    >
                      Payment Status
                    </th> */}
                    <th
                      scope="col"
                      className="h-12 px-6 text-sm md:text-md text-slate-700 bg-slate-100 font-bold border-b border-black text-center"
                    >
                      Fulfillment Status
                    </th>

                    <th
                      scope="col"
                      className="h-12 px-6 text-sm md:text-md text-slate-700 bg-slate-100 font-bold border-b border-black text-center"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userObject?.Orders &&
                    Object.values(userObject.Orders).map((order, index) => {
                      const { orderId, PaymentID, Status, Time, Total } = order;
                      return (
                        <tr key={index}>
                          <td className="h-12 px-6 text-sm text-slate-500 border-b border-black text-center">
                            {index + 1}.
                          </td>
                          <td className="h-12 px-6 text-sm text-slate-500 border-b border-black text-center">
                            {orderId}
                          </td>
                          <td className="h-12 px-6 text-sm text-slate-500 border-b border-black text-center">
                            {formatDateTime(Time)}
                          </td>
                          <td className="h-12 px-6 text-sm text-slate-500 border-b border-black text-center">
                            <span
                              className={`px-3 py-1 rounded-lg ${Status.toLowerCase() === "pending"
                                ? "bg-red-200 text-red-600"
                                : Status.toLowerCase() === "inprogress"
                                  ? "bg-yellow-200 text-yellow-900"
                                  : "bg-green-200 text-green-600"
                                }`}
                            >
                              {Status.charAt(0).toUpperCase() + Status.slice(1)}
                            </span>
                          </td>
                          <td className="h-12 px-6 text-sm text-slate-500 border-b border-black text-center">
                            Rs. {Total}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>


  );
};

export default UserDashboard;