import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import { Button, ButtonGroup, List, ListItem, TextField } from '@mui/material';
import { addIcon } from "../../assets";
import { Search } from "@mui/icons-material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

/* st api for search */
import bookService from "../../service/book.service";
/* st api for search */

import { useAuthContext } from "../../context/auth"; //----------------------------------------------------
import { NavigationItems, addtoCart } from "../../utils/shared";
import { RoutePaths } from "../../utils/enum";
import { toast } from "react-toastify";
import { useCartContext } from "../../context/cart";
 
function Header() {

    const authContext = useAuthContext(); 
    const cartContext = useCartContext();
    const navigate = useNavigate();

    //----------------------------------------------------

    const handlelogout = () => {
        authContext.signOut() //--------------------------------------------
    }
    const handleLogin = () => {
        navigate('/login')
    };
    const handleRegister = () => {
        navigate('/register')
    };
    const handleCansal = () => {
        setOpenSearchResult(false);
    }

    const [query, setquery] = useState("");
    const [bookList, setbookList] = useState([]);
    const [openSearchResult, setOpenSearchResult] = useState();

    const searchBook = async () => {
        try {
            const res = await bookService.searchBook(query);
            setbookList(res);
            // console.log(res) // to test gloabal search api 
        } catch (err) {
            alert('Error occured while searching.  Check the API and try again: ', err)
        }
    };

    const search = () => {
        document.body.classList.add("search-result-open");
        searchBook();
        setOpenSearchResult(true)
    };

    const items = useMemo(() => {
        return NavigationItems.filter(
            (item) => 
                !item.access.length || item.access.includes(authContext.user.roleId)
        );
    }, [authContext.user])

    const addToCart = (book) => {
        if(!authContext.user.id) {
            navigate(RoutePaths.Login);
            toast.error("Please Login before adding books to cart", { theme: 'colored' });
        } else {
            addtoCart(book, authContext.user.id).then((res) => {
                if(res.error) {
                    toast.error(res.error, {theme: 'colored'});
                } else {
                    toast.success("Item added in cart", { theme: 'colored' });
                    cartContext.updateCart();
                }
            })
        }
    }


    return(
        <>
        
        <div className="h-container">
            <div className="h-container-wrapper">
                <div className="h-container-lft">
                    <Link to='/'>
                        <img 
                            src={addIcon} 
                            className="h-tt-logo" 
                            alt="TatvaSoft logo" 
                        />
                    </Link>
                </div>

                <div className="h-container-rght">
                    
                    <div className="h-log-reg">
                        {/* ----------------------------------- */}
                        {/* <List> */}
                        <ButtonGroup 
                            variant="text" 
                            aria-label="text button group"
                        >
                            {(!authContext.user.id) && (
                                <>
                                {/* <ListItem>
                                    <Link to={RoutePaths.Register}>
                                        Register
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link to={RoutePaths.Login}>
                                        Login
                                    </Link>
                                </ListItem> */}

                                <Button
                                    className="h-br-1"
                                    size="small"
                                    sx={{ 
                                        color: "#f14d54",
                                        borderColor: "#f14d54 !important"
                                    }}
                                    onClick={handleLogin}
                                > 
                                    Login 
                                </Button>
                                                    
                                <Button
                                    size="small"
                                    sx={{ 
                                        color: "#f14d54" 
                                    }}
                                    onClick={handleRegister}
                                > 
                                    Register 
                                </Button>

                                </>
                            )}
                            
                            {items.map((item, index) => (
                                // <ListItem key={index}>
                                //     <Link to={item.route} title={item.name}>
                                //         {item.name}
                                //     </Link>
                                // </ListItem>

                                <Link to={item.route} title={item.name}>
                                    <Button
                                        size="small"
                                        sx={{ 
                                            color: "#f14d54" 
                                        }}
                                    > 
                                        {item.name} 
                                    </Button>
                                </Link>

                            ))}
                            </ButtonGroup>
                        {/* </List> */}
                        {/* ----------------------------------- */}
                    </div>

                    <div className="h-rght-cart">
                        <Link to='/cart'>
                            <Button 
                                size="small"
                                variant="outlined" 
                                className="c-f14d54 b-f14d54"
                                startIcon={<ShoppingCartIcon />}
                            >
                                {cartContext.cartData.length} Cart
                            </Button>
                        </Link>
                    </div>

                    {(authContext.user.id) ? 
                        <>
                            <div className="h-rght-logout">
                                <Button 
                                    size="small"
                                    variant="outlined" 
                                    className="c-f14d54 b-f14d54"
                                    onClick={handlelogout}
                                >
                                    Log Out 
                                </Button>
                            </div>
                        </> : <></>
                    }
                </div>
            </div>    
        </div>
        
        <div 
            className="search-overlay"
            onClick={ () => {
                document.body.classList.remove('search-result-open')
                setOpenSearchResult(false)
            }}
        >
            {/* This is an Empty div     */}
        </div>

        <div className="h-searchbar">
            <div className="h-searchbar-center">

                <div className="h-txtfield">
                    <TextField 
                        id="outlined-basic" 
                        placeholder='what are you looking for...' 
                        variant="outlined" 

                        name="text"
                        value={query}
                        onChange={(e) => setquery(e.target.value)}
                    />
                    {openSearchResult && 
                    <>
                        <div className="h-product-list">
                            <div className="h-no-prod">
                                {bookList?.length === 0 && (
                                        <p className="h-not-found"> No Products Found </p>
                                    )
                                }
                            </div>
                            <List className="h-related-product-list">
                                {bookList?.length > 0 && bookList.map((item, i) => {
                                    return(
                                        <ListItem>
                                            <div className="h-product-list-inner">
                                                <div className="h-inner-lft">
                                                    <span className="txt-41 txt-lb">
                                                        {item.name}
                                                    </span>
                                                    <p>
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="h-inner-rght">
                                                    <span>
                                                        {item.price}
                                                    </span>
                                                    <Button
                                                        size="small"
                                                        className="c-f14d54"
                                                        onClick={() => addToCart(item)}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListItem>
                                    )})    
                                }
                            </List>
                        </div>
                    </>
                    }
                </div>

                <div className="h-search-btn">
                    <Button 
                        type="submit"
                        variant="contained" 
                        className="bg-search" 
                        startIcon={<Search />}

                        onClick={search}
                    > 
                        Search 
                    </Button>
                </div>

                <div  className="h-search-btn">
                    <Button 
                        variant="contained" 
                        className="bg-f14d54"
                        onClick={handleCansal}
                    > 
                        Cancel 
                    </Button>
                </div>
            </div>
        </div>

        </>
    );
}

export default Header;