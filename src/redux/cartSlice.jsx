import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];
// console.log(initialState)


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user?.role === "user") {
                state.push(action.payload)
                toast.success("Added to Cart Successfully");
            }
            else {
                // return <Navigate to={'/userlogin'} />
                toast.error("Please Login to Add Product");
            }
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id != action.payload.id);
        },
        clearCart: (state) => {
            return []; // Reset the cart to an empty array
        },
        incrementQuantity: (state, action) => {
            state = state.map(item => {
                if (item.id === action.payload) {
                    item.quantity++;
                }
                return item;
            });
        },
        decrementQuantity: (state, action) => {
            state = state.map(item => {
                if (item.quantity !== 1) {
                    if (item.id === action.payload) {
                        item.quantity--;
                    }
                }
                return item;

            })
        },
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer