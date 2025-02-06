/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import Layout from '../../components/layout/Layout';
import emailjs from "@emailjs/browser";  // Import emailjs but won't use it
import axios from "axios";
import { BASE_URL } from "../../helper";

const Signup = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userSignup, setUserSignup] = useState({
        fname: "",
        lname:"",
        gender:"",
        mobile: "",
        email: "",
        password: "",
        role: "user"
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal to input OTP
    const [verificationCode, setVerificationCode] = useState(""); // Store generated OTP
    const [userInputCode, setUserInputCode] = useState(""); // User input for OTP

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/.test(email);
    const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

    // Updated password validation
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/.test(password);

    const userSignupFunction = async () => {
        setLoading(true);
        const { fname, lname, mobile, email, password, gender } = userSignup;

        if (!fname || !lname || !gender ||!mobile || !email || !password) {
            setLoading(false);
            toast.error("All fields are required.");
            return;
        }

        if(gender == "Select Gender"){
            setLoading(false);
            toast.error("All fields are required");
            return;
        }

        if (!validateEmail(email)) {
            setLoading(false);
            toast.error("Invalid email address.");
            return;
        }

        if (!validateMobile(mobile)) {
            setLoading(false);
            toast.error("Mobile number must be exactly 10 digits.");
            return;
        }

        if (!validatePassword(password)) {
            setLoading(false);
            toast.error("Password must be at least 8 characters, include uppercase, lowercase, numbers, and symbols.");
            return;
        }

        // Generate OTP (the OTP logic is still here)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);  // Store OTP but won't send email for now

        // --- Commented Out Email Sending Logic ---
        /*
        try {
            setLoading(true);
            await emailjs.send("service_ye3dx4n", "template_dlzvvfq", {
                to_name: name,
                to_email: email,
                message: code,
            }, "kXlqQY1TCYSrxQwwC");

            toast.success("Verification code sent to your email.");
            setIsModalOpen(true);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to send verification email.");
        }
        */
        
        // Instead of waiting for OTP verification, let's directly create the user
        try {
            // console.log(userSignup);
            const response = await axios.post(`${BASE_URL}/user/createUser`, userSignup);
            // console.log("Backend response: ", response.data); // Log the backend response

            if (response.data.success) {
                toast.success("Signup Successful");
                setLoading(false);
                navigate('/userlogin');
            } else {
                setLoading(false);
                toast.error('Error in Signing Up! Please Try Again');
            }
        } catch (err) {
            setLoading(false);
            console.error("Error during signup:", err);
            toast.error("An error occurred during signup.");
        } finally {
            setUserSignup({
                fname: "",
                lname: "",
                gender: "",
                mobile: "",
                email: "",
                password: "",
                role: "user"
            });
        }
    };

    // Handle OTP verification (though it's currently not required)
    const handleVerifyCode = async () => {
        // console.log("User input code: ", userInputCode);
        // console.log("Generated verification code: ", verificationCode);

        // For now, we skip OTP verification and assume it's correct
        if (userInputCode === verificationCode) {
            try {
                setIsModalOpen(false);
                setLoading(true);

                const response = await axios.post(`${BASE_URL}/user/createUser`, userSignup);
                // console.log("Backend response: ", response.data); // Log the backend response

                if (response.data.success) {
                    toast.success("Signup Successfully");
                    setLoading(false);
                    setIsModalOpen(false);
                    navigate('/userlogin');
                } else {
                    setLoading(false);
                    setIsModalOpen(false);
                    toast.error('Error in Signing Up! Please Try Again');
                }
            } catch (err) {
                setLoading(false);
                toast.error("An error occurred during signup.");
                console.log(err);
            } finally {
                setVerificationCode("");
                setUserInputCode("");
                setUserSignup({
                    fname: "",
                    lname:"",
                    gender: "",
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

                <div className="relative z-10 bg-eda72f px-6 py-8 border border-gray-100 rounded-xl shadow-md w-full max-w-lg mx-4 my-16">
                    <h2 className='text-center text-4xl font-bold mb-5'>Signup</h2>

                    <input
                        type="text"
                        placeholder='First Name'
                        value={userSignup.fname}
                        onChange={(e) => setUserSignup({ ...userSignup, fname: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    />
                    <input
                        type="text"
                        placeholder='Last Name'
                        value={userSignup.lname}
                        onChange={(e) => setUserSignup({ ...userSignup, lname: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    />
                    <select
                        value={userSignup.gender}
                        onChange={(e) => setUserSignup({ ...userSignup, gender: e.target.value })}
                        className='bg-fafafa border border-black px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 mb-4'
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
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

                    <h5 className="ps-2 mb-5">
                        <span className="text-sm">
                            The password must meet all these conditions: <br />
                            <ol className="list-disc pl-5">
                                <li>At least 8 characters.</li>
                                <li>At least one lowercase letter.</li>
                                <li>At least one uppercase letter.</li>
                                <li>At least one number.</li>
                                <li>At least one special character (e.g. : m#P52s@ap$V )</li>
                            </ol>
                        </span>
                    </h5>

                    <button
                        onClick={userSignupFunction}
                        className='bg-gray-900 hover:bg-black w-full text-white text-center py-2 font-bold rounded-md transition duration-300'
                        disabled={loading}
                    >
                        {loading ? 'Signing Up .....' : 'Signup'}
                    </button>
                </div>

                {/* OTP Modal (still in place but doesn't trigger) */}
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
