import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import Layout from "../../components/layout/Layout";
import { Trash } from 'lucide-react'
import { decrementQuantity, deleteFromCart, incrementQuantity } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import emptycartimg from "/img/empty-cart-gif.mp4";
import BuyNowPopup from "../../components/buyNowModal/BuyNowPopup";
import { fireDB } from "../../firebase/FirebaseConfig";
import { collection } from "firebase/firestore";
import { query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../helper";
import axios from "axios";
const CartPage = () => {
    const cartItems = useSelector((state) => state.cart);
    const navigate = useNavigate();
    // console.log(cartItems)
    const dispatch = useDispatch();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user);
    const [userObject, setUserObject] = useState();

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
            toast.error(error);
            navigate("/userlogin"); // Redirect to login on error
        } finally {
            setLoading(false); // Stop the loader
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // console.log(userObject)


    const handleBuyNowClick = async () => {
        if (cartItems.length == 0) {
            toast.error("Please Add Some Item");
            return;
        }
        // console.log(userObject);
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Item Deleted")
    }

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    // const cartQuantity = cartItems.length;

    const cartItemTotal = cartItems.map(item => item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);

    const cartTotal = cartItems.map(item => item.price * item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);
    const cartMRPTotal = cartItems.map(item => item.mrp * item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);


    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])

    // user
    // const user = JSON.parse(localStorage.getItem('users'))


    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    };
    const fadeInDown = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };


    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl lg:px-0 bg-white">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <motion.h1
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        transition={{ duration: 0.9 }}

                        className="text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl"
                    >
                        Shopping Cart
                    </motion.h1>
                    <motion.form
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        transition={{ duration: 1.5 }}

                        className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
                    >
                        <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-7 mx-5">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <ul role="list" className="mx-4 divide-y divide-gray-200">
                                {cartItems.length > 0 ?

                                    <>
                                        {cartItems.map((item, index) => {
                                            const { id, title, price, productImageUrls, quantity, category } = item
                                            return (
                                                <div key={index} className="my-2 p-4 ">
                                                    <li className="flex py-6 sm:py-6 ">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={productImageUrls[0]}
                                                                alt="img"
                                                                className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                                <div>
                                                                    <div className="flex justify-between">
                                                                        <h3 className="text-sm">
                                                                            <div className="font-semibold text-black">
                                                                                {title}
                                                                            </div>
                                                                        </h3>
                                                                    </div>
                                                                    <div className="mt-1 flex text-sm">
                                                                        <p className="text-sm text-gray-500">{category}</p>
                                                                    </div>
                                                                    <div className="mt-1 flex items-end">
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            ₹{price}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <div className="mb-2 flex">
                                                        <div className="min-w-24 flex">
                                                            <button onClick={() => handleDecrement(id)} type="button" className="h-7 w-7" >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="mx-1 h-7 w-9 rounded-md border text-center"
                                                                value={quantity}
                                                            />
                                                            <button onClick={() => handleIncrement(id)} type="button" className="flex h-7 w-7 items-center justify-center">
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className="ml-6 flex text-sm">
                                                            <button onClick={() => deleteCart(item)} type="button" className="flex items-center space-x-1 px-2 py-1 pl-0">
                                                                <Trash size={12} className="text-red-500" />
                                                                <span className="text-xs font-medium text-red-500">Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                    :

                                    <h1 className="text-center font-bold text-2xl">Your Cart Feel So Light.
                                        <video src={emptycartimg} autoPlay loop muted className=" w-96 mx-auto object-cover"></video>
                                    </h1>
                                }
                            </ul>
                        </section>
                        {/* Order summary */}
                        <section
                            aria-labelledby="summary-heading"
                            className="mt-16 rounded-md bg-gray-200 mx-4 lg:col-span-5 lg:mt-0 lg:p-4 px-4 py-40"
                        >
                            <h2
                                id="summary-heading"
                                className="border-b border-black px-4 py-3 text-center text-xl font-bold text-gray-900 sm:p-4"
                            >
                                Order Summary
                            </h2>
                            <div>
                                <dl className="space-y-1 px-2 py-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Total Items</dt>
                                        <dd className="text-sm font-medium text-gray-900"><CountUp duration={0.4} end={cartItemTotal} /></dd>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Total Cost</dt>
                                        <dd className="text-sm font-medium text-gray-900">₹ <CountUp duration={0.4} end={cartMRPTotal} /></dd>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Total Price</dt>
                                        <dd className="text-sm font-medium text-gray-900">₹ <CountUp duration={0.4} end={cartTotal} /></dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Discount</dt>
                                        <dd className="text-sm font-medium text-gray-900">₹ <CountUp duration={0.4} end={cartMRPTotal - cartTotal} /></dd>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-black">
                                        <dt className="flex text-sm text-gray-800">
                                            <span>Delivery Charges</span>
                                        </dt>
                                        <dd className="text-sm font-medium text-green-700">Free</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-y border-dashed py-4">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900">₹ <CountUp duration={0.4} end={cartTotal} /></dd>
                                    </div>
                                </dl>
                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        {/* <BuyNowModal amounttoPay={cartTotal} cartItems={cartItems} /> */}
                                        <Button
                                            type="button"
                                            onClick={() => handleBuyNowClick()}
                                            className="w-full px-4 py-3 text-center text-gray-100 bg-customBlue border border-transparent dark:border-gray-700 hover:border-orange-600 hover:text-white hover:bg-orange-600 rounded-xl"
                                        >
                                            Buy now
                                        </Button>
                                        <BuyNowPopup isOpen={isPopupOpen} onClose={closePopup} amount={cartTotal} cartItems={cartItems} userObject={userObject} />
                                    </div>
                                    <div className="justify-center items-center flex">
                                        <Link className="text-center jusitfy-center mx-auto items-center" to={`/returns`}>Refund Policy</Link>

                                    </div>

                                </div>
                            </div>
                        </section>
                    </motion.form>
                </div>
            </div>
        </Layout>
    );
}

export default CartPage;


