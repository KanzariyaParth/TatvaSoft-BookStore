import React, { useEffect, useState } from "react";
import './Cart.css';
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../../service/cart.service";
import { toast } from "react-toastify";
import orderService from "../../service/order.service";
import { messages } from "../../utils/shared";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData, removeFromCart, setCartData } from "../../State/Slice/cartSlice";

function Cart() {

//-----------------------------------------------------------------------------

    const navigate = useNavigate();

    const [cartList, setCartList] = useState([]);
    const [itemsInCart, setItemsInCart] = useState(0);
    const [totalPrice, SetTotalPrice] = useState(0);

    //-------------------------------------------------st getTotalPrice

    const getTotalPrice = (itemList ) => {
        let totalPrice = 0;
        itemList.forEach((item) => {
            const itemPrice = item.quantity * parseInt(item.book.price);
            totalPrice = totalPrice + itemPrice;
        });
        SetTotalPrice(totalPrice);
    }

    //-------------------------------------------------nd getTotalPrice


    //==========================================================================================================================

    const cartData = useSelector((state) => state.cart.cartData)
    const user = useSelector((state) => state.auth.user)
    const dispach = useDispatch();

    //==========================================================================================================================


    //----------------------------------st update page when cartData Changes

    useEffect(() => {
        
        setCartList(cartData);
        setItemsInCart(cartData.length);
        getTotalPrice(cartData);

    }, [cartData])

    //----------------------------------nd update page when cartData Changes


    //-------------------------------------------------st removeItem

    const removeItem = async (id) => {
        try {
            const res = await cartService.removeItem(id);
            if (res) {
                dispach(removeFromCart(id));
            }
        } catch (error) {
            toast.error("Something went wrong!", { theme: 'colored' })
        }
    }

    //-------------------------------------------------nd removeItem


    //-------------------------------------------------st updateQuantity

    const updateQuantity = async (cartItem, inc) => {
        const currentCount = cartItem.quantity;
        const quantity = inc ? currentCount + 1 : currentCount - 1;
        if (quantity === 0) {
            toast.error("Item quantity should not be zero.", { theme: 'colored' })
            return;
        }

        try {
            const res = await cartService.updateItems({
                id: cartItem.id,
                userId: cartItem.userId,
                bookId: cartItem.bookId,
                quantity,
            });
            if (res) {
                const updateCartList = cartList.map((item) => 
                    item.id === cartItem.id ? {...item, quantity} : item
                );
                dispach(setCartData(updateCartList));
                const updatedPrice = 
                    totalPrice + (
                        inc ? parseInt(cartItem.book.price)
                            : - parseInt(cartItem.book.price)
                    );
                SetTotalPrice(updatedPrice);
            }
        } catch (error) {
            toast.error("Something went wrong!", { theme: 'colored' });
        }
    };

    //-------------------------------------------------nd updateQuantity
    

    //-------------------------------------------------st placeOrder

    const placeOrder = async () => {
        if (user.id) {
            const userCart = await cartService.getList(user.id);
            if (userCart.length > 0) {
                try {
                    let cartIds = userCart.map((element) => element.id);
                    const newOrder = {
                        userId: user.id,
                        cartIds,
                    };
                    const res = await orderService.placeOrder(newOrder);
                    if (res) {
                        dispach(fetchCartData(user.id))
                        navigate('/');
                        toast.success(messages.ORDER_SUCCESS, { theme: 'colored' })
                    }
                } catch (error) {
                    toast.error(`Order cannot be placed ${error}`, { theme: "colored" })
                }
            } else {
                toast.error("Your cart is empty. ", { theme: 'colored' });
            }
        }
    }

    //-------------------------------------------------nd placeOrder
 
//-----------------------------------------------------------------------------

    return(
        <>
            <div className="cart-container-center">
                <h1 
                    className="ff-r txt-41"
                > 
                    Cart Page 
                </h1>
                
                <hr />
            </div>
            <div className="cart-container-main">

                <div className="cart-info-header">
                    <div className="cart-info-header-lft">
                        <h3 className="txt-lb txt-41"> 
                            My Shopping Bag ({ itemsInCart } items) 
                        </h3>
                    </div>

                    <div className="cart-info-header-rght">
                        <h4 className="txt-lb txt-41">
                            Total Price: { totalPrice }
                        </h4>
                    </div>
                </div>



                <div className="cart-container-allproducts">

                    { cartList.map((cartItem) => {
                        return(
                        <div className="cart-container-product" key={cartItem.id}>

                            <div className="cart-container-product-lft">

                                <img 
                                    src={cartItem.book.base64image}
                                    alt={cartItem.book.name}
                                />

                            </div>

                            <div className="cart-container-product-middle">

                                <div className="cart-product-name">
                                    <h4 className="txt-lb txt-41">
                                        {cartItem.book.name}
                                    </h4>
                                </div>

                                <div className="cart-product-link">
                                    <Link> 
                                        Cart item name
                                    </Link>
                                </div>

                                <div className="cart-product-inc-dec-btn">
                                    <Button
                                        variant="contained"
                                        className="bg-f14d54 f1-btn-hover"
                                        onClick={() => {
                                                updateQuantity(cartItem, true)
                                            }
                                        }
                                    >
                                        +
                                    </Button>

                                    <span> {cartItem.quantity} </span>

                                    <Button
                                        variant="contained"
                                        className="bg-f14d54 f1-btn-hover"
                                        onClick={() => {
                                            updateQuantity(cartItem, false)
                                        }
                                    } 
                                    >
                                        -
                                    </Button>
                                </div>

                            </div>
                            
                            <div className="cart-container-product-rght">
                                <h4 className="txt-lb txt-41"> 
                                    MRP {cartItem.book.price} 
                                </h4>
                                
                                <Link
                                    onClick={() => removeItem(cartItem.id)}
                                >
                                    Remove
                                </Link>
                            </div>
                        </div>
                    )})}
                </div>

                <div className="cart-place-order-btn">
                    <Button
                        variant="contained"
                        className="bg-f14d54 f1-btn-hover"
                        onClick={placeOrder}    
                    >
                        Place Order
                    </Button>

                    <Button
                        variant="contained"
                        className="bg-f14d54 f1-btn-hover"
                        onClick= {() => navigate('/')}    
                    >
                        continue Shopping
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Cart;