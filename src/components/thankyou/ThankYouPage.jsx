import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import thankyouimg from "../../../public/img/thank-you-gif-2.mp4";
import thankyouimggif from "/img/thank-you-gif-3.gif";
import Layout from "../../components/layout/Layout";


const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/allproduct'); // Adjust the path as necessary
  };

  return (
    <Layout>
    <div className="bg-white p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-5">Thanks For Choosing Us!</h1>
        <p className="text-lg md:text-xl">We'll send your order confirmation to your email address.</p>
      </div>
      <div className="flex flex-col md:flex-row mt-16">
        <div className="flex-1"></div>
        <div className="flex-2 px-4"> 
          <p className="mb-2 mt-20 text-lg">
            Thank you for using our services; <br /> we've successfully processed your payment 
          </p>
          <p className="mb-4 text-lg"> 
            You can access your product information from your email app. 
          </p>
          <button
            onClick={handleRedirect}
            type="button"
            className="bg-amber-800 hover:bg-white hover:text-amber-800 text-white border hover:border-amber-700 text-center py-2 px-5 rounded-md transition duration-300 text-lg md:text-2xl"
          >
            Click Here To Continue
          </button>
        </div>
        <div className="flex-2 px-4">
          <video src='../img/thank-you-gif-2.mp4' autoPlay loop className="w-96 object-cover"></video>
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
    </Layout>
  );
};

export default ThankYouPage;
