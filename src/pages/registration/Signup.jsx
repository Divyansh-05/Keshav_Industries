/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import Layout from '../../components/layout/Layout';
import NewLoader from "../../components/loader/NewLoader";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { BASE_URL } from "../../helper";

const Signup = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userSignup, setUserSignup] = useState({
        name: "",
        mobile: "",
        email: "",
        password: "",
        role: "user"
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [userInputCode, setUserInputCode] = useState("");

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/.test(email);
    const validateMobile = (mobile) => /^\d{10}$/.test(mobile);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password);

    const userSignupFunction = async () => {
        setLoading(true);
        const { name, mobile, email, password } = userSignup;

        if (!name || !mobile || !email || !password) {
            setLoading(false);
            toast.error("All fields are required.");
            return;
        }

        if (!validateEmail(email)) {
            setLoading(false);
            toast.error("Invalid email address. Use @gmail.com, @yahoo.com, or @outlook.com domains.");
            return;
        }

        if (!validateMobile(mobile)) {
            setLoading(false);
            toast.error("Mobile number must be exactly 10 digits.");
            return;
        }

        if (!validatePassword(password)) {
            setLoading(false);
            toast.error("Password must meet security requirements.");
            return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);

        try {
            setLoading(true);
            await emailjs.send("service_nxpm74r", "template_6paeh9u", {
                to_name: name,
                to_email: email,
                message: code,
            }, "AX5QPEWUDd7UZrPe9");

            toast.success("Verification code sent to your email.");
            setIsModalOpen(true);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to send verification email.");
        }
    };

    const handleVerifyCode = async () => {
        if (userInputCode === verificationCode) {
            try {
                setIsModalOpen(false);
                setLoading(true);

                // const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);
                const response = await axios.post(`${BASE_URL}/user/createUser`, userSignup);
                if(response.data.success){
                    toast.success("Signup Successfully");
                    setLoading(false);
                    setIsModalOpen(false);
                    navigate('/userlogin');    
                }
                else{
                    setLoading(false);
                    setIsModalOpen(false);
                    toast.error('Error in Signing Up!. Please Try Again')
                }
                
            } catch (err) {
                setLoading(false);
                toast.error("An error occurred during signup.");
                console.log(err);
            }
            finally {
                setVerificationCode("");
                setUserInputCode("");
                setUserSignup({
                    name: "",
                    mobile: "",
                    email: "",
                    password: "",
                    role: "user"
                });
            }
        } else {
            setLoading(false);
            toast.error("Invalid verification code. Please try again.");
        }
    };

    return (
        <Layout>
            <div className='flex justify-center items-center min-h-screen relative'>
                <div className="absolute inset-0 bg-[url('../img/bg-image-1.jpg')] bg-cover bg-center "></div>
                {/* {loading && <Loader />} */}

                <div className="relative z-10 bg-eda72f px-6 py-8 border border-gray-100 rounded-xl shadow-md w-full max-w-lg mx-4 my-16">
                    <h2 className='text-center text-4xl font-bold mb-5'>Signup</h2>

                    <input
                        type="text"
                        placeholder='Full Name'
                        value={userSignup.name}
                        onChange={(e) => setUserSignup({ ...userSignup, name: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    />
                    <input
                        type="text"
                        placeholder='Mobile Number'
                        value={userSignup.mobile}
                        onChange={(e) => setUserSignup({ ...userSignup, mobile: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    />
                    <input
                        type="email"
                        placeholder='Email Address'
                        value={userSignup.email}
                        onChange={(e) => setUserSignup({ ...userSignup, email: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={userSignup.password}
                        onChange={(e) => setUserSignup({ ...userSignup, password: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    />

                    <button
                        onClick={userSignupFunction}
                        className='bg-gray-900 hover:bg-black w-full text-white text-center py-2 font-bold rounded-md transition duration-300'
                        disabled = {loading}
                    >
                        {loading ? 'Signing Up .....' : 'Signup'}
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-bold mb-4">Enter Verification Code</h2>
                            <input
                                type="text"
                                placeholder="Verification Code"
                                value={userInputCode}
                                onChange={(e) => setUserInputCode(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md mb-4"
                            />
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded-md mr-2"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={handleVerifyCode}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Signup;
