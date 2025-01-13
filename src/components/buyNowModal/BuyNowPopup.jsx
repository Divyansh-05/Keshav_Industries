// src/components/BuyNowPopup.jsx
import {
  Button,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import React, { useState, useContext } from 'react';
import axios from 'axios'
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getFirestore, query, where, getDocs, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { redirect, useNavigate } from "react-router-dom";
import { BASE_URL } from '../../helper';
import { clearCart } from '../../redux/cartSlice';
import { useDispatch } from 'react-redux';
import { fireDB, auth } from "../../firebase/FirebaseConfig";
import myContext from "../../context/myContext";
// import { CircularProgress } from "@material-ui/core";
import NewLoader from "../loader/NewLoader";
import toast from "react-hot-toast";


const BuyNowPopup = ({ isOpen, onClose, amount, cartItems, userObject }) => {
  // console.log(userObject)
  const context = useContext(myContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/.test(email);
  const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
  const [formData, setFormData] = useState({
    name: userObject?.name || '',
    email: userObject?.email || '',
    phone: userObject?.mobile || '',
    addressLane: '',
    city: '',
    state: '',
    country:  '',
    pincode: '',
  });

  // console.log(userObject)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  async function updateFirebaseAfterPayment(cartItems, totalAmount) {
    try {
      // Update product sales and price for each item in the cart
      const currentMonth = new Date().getMonth() + 1;
      for (let item of cartItems) {
        const productRef = doc(fireDB, 'products', item.id);
        const salesField = `monthlySales.${currentMonth}`;
        const revenueField = `monthlyRevenue.${currentMonth}`;

        await updateDoc(productRef, {
          // Update monthly sales and total sales
          [salesField]: increment(item.quantity),
          totalSales: increment(item.quantity),

          // Update monthly revenue and total revenue
          [revenueField]: increment(item.quantity * item.price),
          totalRevenue: increment(item.quantity * item.price)
        });
      }
      // Update the admin dashboard data
      console.log('Firebase updated successfully!');
    } catch (error) {
      console.error('Error updating Firebase:', error);
    }
  }
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault(); // Prevent any default action

    const updatedFormData = {
      ...formData,
      addressLane: formData.addressLane.trim() ,
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      pincode: formData.pincode.trim(),
    };

    if (isFormValid()) {
      // console.log(updatedFormData.email);
      createRazorpayOrder(amount, updatedFormData);
    }

    else {
      toast.error("Error in creating order");
      setLoading(false);
    }
    // dispatch(clearCart());
  };


  const createRazorpayOrder = async (amount, updatedFormData) => {
    let data = JSON.stringify({
      amount: amount * 100, // Convert amount to paise
      currency: 'INR',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/orders`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const orderItems = cartItems.map((item) => ({
          name: item.title,
          units: item.quantity,
          selling_price: item.price,
          sku: item.sku,
        }));
        handleRazorpayScreen(response.data.amount, response.data.order_id, orderItems, updatedFormData);
      })
      .catch((error) => {
        console.log('Error creating Razorpay order:', error);
        toast.error("Error in creating order");
        setLoading(false);
      });
  };

  const handleRazorpayScreen = async (amount, orderid, orderItems, updatedFormData) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
    setLoading(false);

    const options = {
      key: 'rzp_live_w1F1WlXsmUUQMN', // Replace with your Razorpay key
      amount: amount,
      currency: 'INR',
      name: 'Keshav Industries',
      description: 'Payment to Keshav Industries',
      order_id: orderid,
      handler: async function (response) {
        try {
          const paymentRef = collection(fireDB, 'payments');
          const userRef = doc(fireDB, 'users', userObject.id);
          const currentTime = Timestamp.now();


          await updateDoc(userRef, {
            Orders: arrayUnion({
              orderId: response.razorpay_order_id,
              PaymentID: response.razorpay_payment_id,

              Total:amount/100,
              Time: currentTime,
              Status: 'Pending',
            }),
          });

          await addDoc(paymentRef, {
            userInfo: updatedFormData,
            PaymentID: response.razorpay_payment_id,
            OrderId: response.razorpay_order_id,
            Signature: response.razorpay_signature,
            Order: orderItems,
            Time: currentTime,
            Status: 'Pending'
          });
          await updateFirebaseAfterPayment(cartItems, amount);
          dispatch(clearCart());
          navigate('/thankyoupage');

        } catch (error) {
          console.error("Error during payment response handling:", error);
          toast.error("Payment failed. Please contact support.");
          setLoading(false); // Reset loading on failure
        }
      },
      prefill: {
        name: updatedFormData.name,
        email: updatedFormData.email,
        contact: updatedFormData.phone,
      },
      theme: {
        color: '#030F27',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-customBlue p-6 rounded-lg shadow-lg bg-opacity-85 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 items-center text-center text-white">Enter Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* <input
            type="tel"
            name="phone"
            placeholder={userObject.mobile}
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full text-black"
            required
            defaultValue={userObject.mobile}
          /> */}
          <input
            type="text"
            name="addressLane"
            placeholder={'Address'}
            value={formData.addressLane}
            onChange={handleChange}
            className="border p-2 w-full text-black"
            required
          />
          <input
            type="text"
            name="city"
            placeholder={'City'}
            value={formData.city}
            onChange={handleChange}
            className="border p-2 w-full text-black"
            required
          />
          <input
            type="text"
            name="state"
            placeholder={'State'}
            value={formData.state}
            onChange={handleChange}
            className="border p-2 w-full text-black"
            required
          />
          <input
            type="text"
            name="country"
            placeholder={'Country'}
            value={formData.country}
            onChange={handleChange}
            className="border p-2 w-full text-black"
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder={'Pincode'}
            value={formData.pincode}
            onChange={handleChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div className="flex justify-between mt-4">
          <button type="button" onClick={onClose} className="bg-red-700 text-white py-2 px-4 rounded">Cancel</button>
          <button
            onClick={handleSubmit}
            className={`py-2 px-4 rounded ${isFormValid() ? 'bg-blue-900 text-white' : 'bg-gray-600 text-gray-100 cursor-not-allowed'}`}
            disabled={!isFormValid()}
          >
            {loading ? <NewLoader /> : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPopup;
