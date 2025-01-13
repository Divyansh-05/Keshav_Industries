import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import Layout from '../../components/layout/Layout';
import NewLoader from "../../components/loader/NewLoader";
import axios from "axios";
import { BASE_URL } from "../../helper";
const UserLogin = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const [buttonloading, setButtonLoading] = useState(false);
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    const userLoginFunction = async () => {
        setButtonLoading(true);
        if (userLogin.email === "" || userLogin.password === "") {
            toast.error("All Fields are required");
            setButtonLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/user/loginUser`, {
                email: userLogin.email,
                password: userLogin.password,
            });
            const { token, user } = response.data;

            // Store token and user details in localStorage
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));

            setUserLogin({ email: "", password: "" });
            toast.success("Login Successful");

            setLoading(false);
            setButtonLoading(false);

            // Navigate based on user role
            if (user.role === "admin") {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoading(false);
            setButtonLoading(false);

            // Show error message
            const errorMessage = error.response?.data?.error || "Login failed";
            toast.error(errorMessage);
        }
    };

    return (
        <Layout>
            <div className='flex justify-center items-center min-h-screen relative'>
                {loading && <NewLoader />}
                {/* Background Image */}
                <div className="absolute inset-0 bg-[url('../img/bg-image-1.jpg')] bg-cover bg-center"></div>
                {/* Login Form */}
                <div className="relative z-10 bg-eda72f px-8 py-8 border border-gray-100 rounded-xl shadow-md w-full max-w-md mx-4 my-16">
                    {/* Top Heading */}
                    <div className="flex items-center justify-center mb-5">
                        <img src='../img/Logo_removebg.png' alt="logo" className="inline-block w-16 h-16 me-5" />
                        <h2 className='mx-3 inline-block text-center text-2xl font-bold text-gray-900'>
                            Login
                        </h2>
                    </div>
                    {/* <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-gray-900'>
                            User Login
                        </h2>
                    </div> */}

                    {/* Input One */}
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder='Email Address'
                            value={userLogin.email}
                            onChange={(e) => {
                                setUserLogin({
                                    ...userLogin,
                                    email: e.target.value
                                });
                            }}
                            className='bg-gray-50 border border-gray-200 px-2 py-2 w-full rounded-md outline-none placeholder-gray-500'
                        />
                    </div>

                    {/* Input Two */}
                    <div className="mb-5">
                        <input
                            type="password"
                            placeholder='Password'
                            value={userLogin.password}
                            onChange={(e) => {
                                setUserLogin({
                                    ...userLogin,
                                    password: e.target.value
                                });
                            }}
                            className='bg-gray-50 border border-gray-200 px-2 py-2 w-full rounded-md outline-none placeholder-gray-500'
                        />
                    </div>

                    {/* Login Button */}
                    <div className="mb-5">
                        <button
                            type='button'
                            onClick={userLoginFunction}
                            className='bg-customBlue hover:bg-blue-900 w-full text-white text-center items-center justify-center py-2 font-bold rounded-md'
                        >
                            {buttonloading ? (<div className="flex items-center justify-center">
                                <NewLoader className='' />
                            </div>
                            ) : 'Login'}
                        </button>
                    </div>
                    <div>
                        <h2 className='text-black'>Don't Have an account? <Link className='text-customBlue font-bold' to={'/signup'}>Register Here</Link></h2>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default UserLogin;
