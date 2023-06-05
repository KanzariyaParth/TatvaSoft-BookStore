import React, { useEffect, useMemo, useState } from "react";
import './BookList.css'
import { Button, FormControl, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";


import { defaultFilter } from "../../constant/constant";
import categoryService from "../../service/catagory.service";
import bookService from "../../service/book.service";
import { addtoCart } from "../../utils/shared";
import { useAuthContext } from "../../context/auth";
import { toast } from "react-toastify";
import { useCartContext } from "../../context/cart";


const BookList = () => {

//----------------------------------------------------- api work -- st

    const authContext = useAuthContext();
    const cartContext = useCartContext();
    const [bookResponse, setBookResponse] = useState({
        pageIndex: 0,
        PageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });
    const [categories, setCategories] = useState([]);
    const[sortBy, setSortBy] = useState(); //----------------------------- for sorting
    const [filters, setFilters] = useState(defaultFilter); 

    //-------------------------- st --- to get array of Categories

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if (res) {
                setCategories(res);
            }
        })
    }

    //-------------------------- nd


    //-------------------------- st --- to search book with onChange in TextField 

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword
            searchAllBooks({ ...filters});
        }, 500);
        return () => clearTimeout(timer);
    }, [filters])

    const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
            setBookResponse(res);
            console.log(res) // to get books in consol
        });
    }

    //-------------------------- nd


    //-------------------------- st --- to set category in bookResponse

    const books = useMemo(() => {
        const bookList = [...bookResponse.items];
        if(bookList) {
            bookList.forEach((element) => {
                element.category = categories.find(
                    (a) => a.id === element.categoryId
                )?.name;
        });
        return bookList;
        }
        return [];
    }, [categories, bookResponse]);

    //-------------------------- nd


    //-------------------------- st ---  for sorting books

    const sortBooks = (e) => {
        setSortBy(e.target.value);

        // console.log("sort called")
        const bookList = [...bookResponse.items];
        // console.log(bookList)

        bookList.sort((a, b) => {
            
            if (a.name < b.name) {
                return e.target.value === "a-z" ? -1 : 1;
            }
            if (a.name > b.name) {
                return e.target.value === "a-z" ? 1 : -1;
            }

            return 0;
        });
        setBookResponse({ ...bookResponse, items: bookList });
    };

    //-------------------------- nd


    //--------------------------------------------st addToCart

    const addToCart = (book) => {
        /* from shared.jsx */
        addtoCart(book, authContext.user.id).then((res) => {
            if (res.error) {
                toast.error(res.message, { theme: 'colored' })
            } else {
                toast.success(res.message, { theme: 'colored' })
                cartContext.updateCart();
            }
        });
    };

    //--------------------------------------------nd addToCart
    
//----------------------------------------------------- api work -- nd
    
    return(
        <>
            <div className="bl-container-center">
                <h1 
                    className="ff-r txt-41"
                >
                    Book Listing
                </h1>

                <hr />
            </div>
            
            <div className="bl-container-main">
                <div className="bl-container-mini-head">

                    <div className="bl-container-bookcount">
                        <h3 
                            className="txt-lb"
                        >
                            Total - {bookResponse.totalItems} items {/* bookResponse.totalItems ==> count */}
                        </h3>
                    </div>
                
                    <div className="bl-container-search-sort">

                        <div className="bl-container-search">
                            <TextField
                                id="outlined-basic" 
                                placeholder='Search...' 
                                variant="outlined" 

                                name="text"
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        keyword: e.target.value,
                                        pageIndex: 1
                                    })
                                }}
                            />
                        </div>

                        <div className="bl-container-sort">
                            <FormControl 
                                variant="standard"  
                                sx={{ m: 1, minWidth: 120 }}
                            >
                                <InputLabel htmlFor="select"> 
                                    Sort By
                                </InputLabel>

                                <Select
                                    value = {sortBy} //------------------------------------------------------ for sort function
                                    onChange={sortBooks} //------------------------------------------------------ for sort function
                                >   
                                    <MenuItem value="a-z"> a - z </MenuItem>
                                    <MenuItem value="z-a"> z - a </MenuItem>    
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                </div>

                <div className="bl-wrapper">
                    <div className="bl-inner-wrapper">

                        {books.map((book, index) => (

                            <div className="bl-card" key={index}>
                                
                                <div className="bl-img">
                                    <img
                                        src={book.base64image}
                                        className="bl-imgtag"
                                        alt={book.name}
                                    />
                                </div>

                                <div className="bl-content">

                                    <div className="bl-name txt-41" title={book.name}>
                                        <h2> {book.name} </h2>
                                    </div>

                                    <div className="bl-category">
                                        <p> {book.category} </p>
                                    </div>

                                    <div className="bl-descreption">
                                        <p> {book.description} </p>
                                    </div>

                                    <div className="bl-price">
                                        <p> MRP {book.price} </p>
                                    </div>

                                    <div className="bl-cart-btn">
                                        <Button
                                            variant="contained"
                                            className="bg-f14d54 f1-btn-hover"
                                            onClick={() => addToCart(book)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>

                                </div>
                            </div>                            
                        ))}

                    </div>
                </div>

                <div className="bl-pagination-wrapper">
                    <Pagination
                        count = {bookResponse.totalPages} 
                            // ------------- howmany pages
                        page = {filters.pageIndex} 
                            // -------------------- current page
                        onChange = {(e,newPage) => { 
                            // ------------------  to update value of pageIndex when user changes a page
                            setFilters({ ...filters, pageIndex: newPage});
                        }}
                    />
                </div>
            </div>

        </>
    );
}

export default BookList;