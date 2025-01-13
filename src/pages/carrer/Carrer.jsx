import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import NewLoader from '../../components/loader/NewLoader';
import toast from 'react-hot-toast';
import cloudinary from '../../config/cloudinary';
const departments = [
  'HR',
  'Marketing',
  'Sales',
  'IT',
  'Finance',
  'Operations',
  'Management',
  'Research and Development',
  'Customer Support'
];

const Carrer = () => {
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const leftToRightVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const rightToLeftVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // File state
  const [resumeUrl, setResumeUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    department: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== '') && file !== null;
  };

  const uploadFileToCloudinary = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'file_upload');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/raw/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // console.log(data);
      if (data.secure_url) {
        setResumeUrl(data.secure_url); // Store the uploaded file URL
        return data.secure_url;
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      toast.error('Error uploading file: ' + error.message);
      return null;
    }
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
      const fileUrl = await uploadFileToCloudinary(); // Upload file to Cloudinary

      if (!fileUrl) {
        setLoading(false);
        return;
      }
      const messageRef = collection(fireDB, 'Carrer');
      try {
        await addDoc(messageRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          department: formData.department,
          time: Timestamp.now(),
          resumeUrl: fileUrl,
        }
        )
        toast.success("message sent successfully!")
        setLoading(false);
        setFile(null);
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
      <div className="mx-auto px-4 py-6 bg-customNewBack my-0">
        {/* Contact Header */}
        <motion.div
          className="text-center bg-eda72f py-16"
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            Career With Us
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between py-10 gap-10">
          {/* Contact Form */}
          <motion.div
            className="bg-white p-8 shadow-lg rounded-lg flex-1"
            initial="hidden"
            animate="visible"
            variants={leftToRightVariants}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Fill Out Your Details</h2>
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
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              ></textarea>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                // className="w-full py-3 bg-eda72f text-white font-bold rounded-lg hover:bg-ffab19"
                className={` w-full py-3 px-4 rounded-lg ${isFormValid() ? 'bg-orange-500 text-white' : 'bg-orange-100 text-white cursor-not-allowed'}`}

                onClick={handleSubmit}
                disabled={!isFormValid()}

              >
                {loading ? <NewLoader /> : 'Submit'}
              </button>
            </form>
          </motion.div>

          {/* Customer Care Section */}
          <motion.div
            className="bg-white p-8 shadow-lg rounded-lg flex-1"
            initial="hidden"
            animate="visible"
            variants={rightToLeftVariants}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Career With Us</h2>
            <p className="text-gray-600 mt-4 text-justify">
              At Keshav Industries, we always work for employee’s advancement through proper training & handholding to each individual.
            </p>
            <p className="text-gray-600 mt-4 text-justify">
              We nurture our employees by providing proper learning & growth opportunities to balance their work life as well as professional life.
            </p>
            <p className="text-gray-600 mt-4 text-justify">
              We always welcome enthusiastic & dedicated professionals who can add significant value in our journey. Interested candidates can fill up the below form and apply through our portal in specific departments.
            </p>
            <p className="text-gray-600 mt-4 text-justify">
              For any further career-related information, please feel free to reach us at hrd@keshav.co.in
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Carrer;
