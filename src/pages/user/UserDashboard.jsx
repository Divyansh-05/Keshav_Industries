import { useContext, useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import user_logo_male from "/img/profile-pic-male.png";
import account_icon from "/img/account-icon.png";
import order_img from "../../../public/img/purchase-order.png";
import logout_img from "../../../public/img/Logout.png";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../helper";


const UserDashboard = () => {
  const navigate = useNavigate();
  const [userObject, setUserObject] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Redirecting to login...");
          navigate("/userlogin");
          return;
        }

        const response = await axios.get(`${BASE_URL}/user/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserObject(response.data.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/userlogin");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const userLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen ">
        <div className="flex mx-auto">
          {/* Left Plane */}
          <div className="w-1/4 bg-gray-100 p-6 space-y-6">
            {/* User Info */}
            <div className="bg-white p-4 rounded-sm shadow-md flex items-center space-x-4">
              <div className="w-12 h-12rounded-full flex items-center justify-center">
                <img src={user_logo_male} alt="Logo" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hello,</p>
                <h2 className="text-lg font-semibold text-gray-800">Divyansh Rana</h2>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white p-4 rounded-sm shadow-md border-b-4 border-blue-500">
              <ul className="space-y-4 text-gray-700">
                <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                  <img src={order_img} alt="" className="w-8 h-8 inline-block" />
                  <span className="text-lg font-semibold ps-4">My Orders</span>
                </li>
                <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                  <img src={account_icon} alt="" className="w-8 h-8 inline-block" />
                  <span className="text-lg font-semibold ps-4">Account Settings</span>
                </li>
                <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                  <img src={logout_img} alt="" className="w-8 h-8 inline-block" />
                  <span className="text-lg font-semibold ps-4">Log Out</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Plane */}
          <div className="flex-1 bg-gray-100 p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white p-6 rounded-sm shadow-md">
              {/* Section Header */}
              <div className="flex justify-start items-center mb-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <h2><a href="#" className="text-blue-500 font-semibold ps-5">Edit</a></h2>
              </div>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value="Divyansh"
                      className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value="Rana"
                      className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <div className="flex space-x-6 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        className="form-radio text-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        className="form-radio text-blue-500"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Email Address</h2>
                  <input
                    type="email"
                    value="rdev6365@gmail.com"
                    className="mt-1 block w-1/2 border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Mobile Number</h2>
                  <input
                    type="text"
                    value="+919074106177"
                    className="mt-1 block w-1/2 border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                  />
                </div>

                {/* Address */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Address</h2>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value="Address"
                        className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value="City"
                        className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value="State"
                        className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value="Country"
                        className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value="Pincode"
                        className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Save
                </button>
                
                <p><span className="text-red-700 font-semibold"><a href="">Delete Account</a></span></p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
