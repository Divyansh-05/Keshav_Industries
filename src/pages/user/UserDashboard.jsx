import { useContext, useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import user_logo_male from "/img/profile-pic-male.png";
import account_icon from "/img/account-icon.png";
import order_img from "/img/purchase-order.png";
import logout_img from "/img/logout.png";
import axios from "axios";
// import toast from "react-hot-toast";
import { Toaster, toast } from "react-hot-toast";
import { BASE_URL } from "../../helper";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userObject, setUserObject] = useState();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isChecked, setIsChecked] = useState(false); 

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
        console.log(response.data.userData);
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
    localStorage.removeItem("user")
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (isChecked) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Redirecting to login...");
          navigate("/userlogin");
          return;
        }

        await axios.delete(`${BASE_URL}/user/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Account deleted successfully.");
        localStorage.removeItem("authToken");
        navigate("/"); 
      } catch (error) {
        toast.error("Error deleting account.");
        console.error("Error:", error);
      } finally {
        setIsModalOpen(false);
      }
    } else {
      toast.error("Please check the confirmation box to proceed.");
    }
  };

  return (
    <Layout>
      <Toaster />
      <div className="bg-gray-100 min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row lg:mx-32">
            {/* Left Pane */}
            <div className="w-full lg:w-1/4 bg-gray-100 p-5 lg:p-6 space-y-6">
              {/* User Info */}
              <div className="bg-white p-4 rounded-sm shadow-md flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src={user_logo_male} alt="Logo" />
                </div>
                <div>
                <p className="text-sm text-gray-600">Hello,</p>
                <h2 className="text-lg font-semibold text-gray-800">Divyansh Rana</h2>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white p-4 rounded-sm shadow-md border-b-4 border-blue-500">
              {/* Dropdown Button for Mobile */}
              <div className="block lg:hidden">
                <button
                  className="w-full flex items-center justify-between p-2 text-gray-700 font-semibold bg-gray-200 rounded-md"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  More Options
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Dropdown Content */}
                {dropdownOpen && (
                  <ul className="mt-2 space-y-4 text-gray-700">
                    <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer flex items-center">
                      <img src={order_img} alt="" className="w-8 h-8 inline-block" />
                      <span className="text-lg font-semibold ps-4">My Orders</span>
                    </li>
                    <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer flex items-center">
                      <img src={account_icon} alt="" className="w-8 h-8 inline-block" />
                      <span className="text-lg font-semibold ps-4">
                        Account Settings
                      </span>
                    </li>
                    <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer flex items-center">
                      <img src={logout_img} alt="" className="w-8 h-8 inline-block" />
                      <span className="text-lg font-semibold ps-4">Log Out</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Static Options for Larger Screens */}
              <ul className="hidden lg:block space-y-4 text-gray-700">
                <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer flex items-center">
                  <img src={order_img} alt="" className="w-8 h-8 inline-block" />
                  <span className="text-lg font-semibold ps-4">My Orders</span>
                </li>
                <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer flex items-center">
                  <img src={account_icon} alt="" className="w-8 h-8 inline-block" />
                  <span className="text-lg font-semibold ps-4">Account Settings</span>
                </li>
                <li className="hover:bg-gray-200 p-2 rounded-md cursor-pointer flex items-center">
                  <img src={logout_img} alt="" className="w-8 h-8 inline-block" />
                  <span className="text-lg font-semibold ps-4">Log Out</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Plane */}
          <div className="flex-1 bg-gray-100 p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white">
              <div className=" p-6 rounded-sm shadow-md">
                {/* Section Header */}
                <div className="flex justify-start items-center mb-4">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <h2><a href="#" className="text-blue-500 font-semibold ps-5">Edit</a></h2>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="flex flex-wrap space-x-4 gap-4">
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
                      className="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Mobile Number</h2>
                    <input
                      type="text"
                      value="+919074106177"
                      className="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                    />
                  </div>

                    {/* Address */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Address</h2>
                      <div className="flex flex-wrap gap-4 sm:flex-col lg:flex-row">
                        <div className="sm:w-full lg:w-1/5">
                          <input
                            type="text"
                            value={userObject?.address?.street || "Street"}
                            className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                          />
                        </div>
                        <div className="sm:w-full lg:w-1/5">
                          <input
                            type="text"
                            value={userObject?.address?.city || "City"}
                            className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                          />
                        </div>
                        <div className="sm:w-full lg:w-1/5">
                          <input
                            type="text"
                            value={userObject?.address?.state || "State"}
                            className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                          />
                        </div>
                        <div className="sm:w-full lg:w-1/5">
                          <input
                            type="text"
                            value={userObject?.address?.zip || "Zip"}
                            className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 p-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      Save
                    </button>

                    {/* Delete Account Button */}
                    <p>
                      <span
                        className="text-red-700 font-semibold cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Delete Account
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Deleting Account */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete your account?</h3>
            <p className="text-sm mb-4">
              This action is irreversible. Please confirm by checking the box below.
            </p>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="mr-2"
              />
              <label>Yes, I want to delete my account.</label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserDashboard;
