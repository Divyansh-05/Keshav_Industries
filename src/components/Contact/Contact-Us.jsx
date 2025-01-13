import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../layout/Layout';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import NewLoader from '../loader/NewLoader';
import toast from 'react-hot-toast';
const Contacts = () => {
  // Variants for scroll animations

  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };


  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault(); // Prevent any default action

    if (isFormValid()) {
      if (!validateEmail(formData.email)) {
        toast.error("Invalid email address. Please use @gmail.com, @yahoo.com, or @outlook.com domains.");
        setLoading(false);
        return;
      }

      if (!validateMobile(formData.phone)) {
        toast.error("Mobile number must be exactly 10 digits.");
        setLoading(false);
        return;
      }
      const messageRef = collection(fireDB, 'Messages');
      try {
        await addDoc(messageRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          time: Timestamp.now(),
        }
        )
        toast.success("message sent successfully!")
        setLoading(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })

      } catch (error) {
        toast.error(error);
        setLoading(false);
      }
      // createRazorpayOrder(amount);
    }
    // dispatch(clearCart());
  };


  return (
    <Layout>
      <div className="mx-auto px-4 py-5 bg-customNewBack">
        {/* Contact Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scrollVariants}
          transition={{ duration: 1 }}
          className="text-center  bg-eda72f py-16"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            Contact Us
          </h1>
          <p className="text-md md:text-xl lg:text-2xl text-white mt-4">
            Our team of customer care ninjas is ready to hear from you.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between py-10 gap-10">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scrollVariants}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-white p-8 shadow-lg rounded-lg flex-1"
          >
            <h2 className="text-2xl font-bold text-gray-800">Reach out to us!</h2>
            <p className="text-gray-600 mt-4">
              Got a question about Keshav Industries? Are you interested in
              partnering with us? Have some suggestions or just want to say hi?
              Contact us:
            </p>
            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Your Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              ></textarea>
              <button
                type="submit"
                // className="w-full py-3 bg-eda72f text-white font-bold rounded-lg hover:bg-ffab19"
                className={` w-full py-3 px-4 rounded-lg ${isFormValid() ? 'bg-orange-500 text-white' : 'bg-orange-100 text-white cursor-not-allowed'}`}

                onClick={handleSubmit}
                disabled={!isFormValid()}

              >
                {loading ? 'Submitting....' : 'Submit'}
              </button>
            </form>
          </motion.div>

          {/* Customer Care Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scrollVariants}
            transition={{ duration: 1, delay: 0.4 }}
            className="bg-white p-8 shadow-lg rounded-lg flex-1"
          >
            <h2 className="text-2xl font-bold text-gray-800">Reach Us</h2>
            <p className="text-gray-600 mt-4">
              Not sure where to start? Need help adding that extra mojo to your
              business? Just visit our{' '}
              <a href="/" className="text-customBlue hover:underline">
                help center
              </a>{' '}
              or get in touch with us:
            </p>

            <div className="mt-6 space-y-6">
              <h2 className='text-gray-800 font-bold'>Factory</h2>
              <p className='text-gray-700'>Plot No. 101 , Industrial Area No: 3, A.B. Road, Dewas, Madhya Pradesh – 455001, India</p>
              <h2 className='text-gray-800 font-bold'>Corporate Office</h2>
              <p className='text-gray-700'>402 , Pukhraj Corporate, Navlakha Main Road, Janki Nagar, Indore, Madhya Pradesh-452001, India</p>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-8">
              Other ways to connect
            </h2>
            <p className="text-gray-600 mt-4">
              Be the first on your block to get product updates, announcements,
              news, and lots of really good content,{' '}
              <a href="#" className="text-customBlue hover:underline">
                like us on Facebook
              </a>{' '}
              today!
            </p>
            <p className="text-gray-600 mt-2">
              Want the best tips on business optimization, marketing strategies,
              and industry insights? Then{' '}
              <a href="#" className="text-customBlue hover:underline">
                follow us on Twitter
              </a>{' '}
              at @keshavindustries
            </p>
          </motion.div>
        </div>

        {/* Google Map */}
        <div className='mt-5'>
          <h1 className="text-center text-3xl md:text-5xl lg:text-5xl font-bold text-dark">
            Locate Us on Google Maps
          </h1>
        </div>
        <div className="mt-10 rounded-lg mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57355.06782223527!2d75.8235450432432!3d22.70819496754725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd26aaaaaaa9%3A0xbffeaa955ff2e11a!2sKESHAV%20INDUSTRIES%20(P)%20LTD.!5e1!3m2!1sen!2sin!4v1723885149953!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;
