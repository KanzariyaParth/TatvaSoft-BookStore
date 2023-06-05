import React, { useEffect, useState } from "react";
import './Cart.css';
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth";
import { useCartContext } from "../../context/cart";
import cartService from "../../service/cart.service";
import { toast } from "react-toastify";
import orderService from "../../service/order.service";
import { messages } from "../../utils/shared";

function Cart() {

//-----------------------------------------------------------------------------

    const authContext = useAuthContext();
    const cartContext =  useCartContext();
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


    //----------------------------------st update page when cartData Changes

    useEffect(() => {
        setCartList(cartContext.cartData);
        setItemsInCart(cartContext.cartData.length);
        getTotalPrice(cartContext.cartData);
    }, [cartContext.cartData])

    //----------------------------------nd update page when cartData Changes


    //-------------------------------------------------st removeItem

    const removeItem = async (id) => {
        try {
            const res = await cartService.removeItem(id);
            if (res) {
                cartContext.updateCart();
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
                cartContext.updateCart(updateCartList);
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
        if (authContext.user.id) {
            const userCart = await cartService.getList(authContext.user.id);
            if (userCart.length > 0) {
                try {
                    let cartIds = userCart.map((element) => element.id);
                    const newOrder = {
                        userId: authContext.user.id,
                        cartIds,
                    };
                    const res = await orderService.placeOrder(newOrder);
                    if (res) {
                        cartContext.updateCart();
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
                        <h3 className="txt-lb"> 
                            My Shopping Bag ({ itemsInCart } items) 
                        </h3>
                    </div>

                    <div className="cart-info-header-rght">
                        <h4 className="txt-lb">
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
                                    // alt={book.name}
                                />

                            </div>

                            <div className="cart-container-product-middle">

                                <div className="cart-product-name">
                                    <h4 className="txt-lb">
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
                                <h4 className="txt-lb"> 
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

                    {/* <div className="cart-container-product">

                        <div className="cart-container-product-lft">

                            <img 
                                src="https://source.unsplash.com/random/900×700/?book"
                                alt="Image"
                            />

                        </div>

                        <div className="cart-container-product-middle">

                            <div className="cart-product-name">
                                <h4 className="txt-lb"> Product Name </h4>
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
                                >
                                    +
                                </Button>

                                <span> 0 </span>

                                <Button
                                    variant="contained"
                                    className="bg-f14d54 f1-btn-hover"    
                                >
                                    -
                                </Button>
                            </div>

                        </div>
                        
                        <div className="cart-container-product-rght">
                            <h4 className="txt-lb"> MRP (price here) </h4>
                            
                            <Link>
                                Remove
                            </Link>
                        </div>
                    </div> */}

                </div>

                <div className="cart-place-order-btn">
                    <Button
                        variant="contained"
                        className="bg-f14d54 f1-btn-hover"
                        onClick={placeOrder}    
                    >
                        Place Order
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Cart;