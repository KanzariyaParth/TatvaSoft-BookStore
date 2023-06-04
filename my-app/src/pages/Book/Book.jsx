import React, { useEffect, useState } from "react";
import './Book.css';

import Button from '@mui/material/Button';
import { Table, 
    // Paper,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow,
    Typography, 
    }  from '@mui/material';

import { TextField } from "@mui/material";
import { RecordsPerPage, defaultFilter } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import categoryService from "../../service/catagory.service";
import bookService from "../../service/book.service";

import ConfirmDialog from "../../components/dialogBox/confirmDialog";
import { toast } from "react-toastify";
import { messages } from "../../utils/shared";


const Book = () => {

    const navigate = useNavigate();

//-----------------------------------------------------------------------------------

    const [filters, setfilters] = useState(defaultFilter)
    const [bookRecords, setbookRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    })

    const [open, setOpen] = useState(false);
        //------------------------------------------------ or Dialog box
    const [selectId, setSelectId] = useState();
        //-------------------------- identify book that's gonna be edited
    const [categories, setCategories] = useState([])


    //-------------------------------------------------st get all Category
    useEffect(() => {
        getAllCategories();
    }, [])

    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if (res) {
                setCategories(res)
            }
        })
    }
    //-------------------------------------------------nd get all Category

    
    //-------------------------------------------------st search books
    useEffect(() => {
        const timer = setTimeout(() => {

            //-------------------------------st customized
            if (filters.keyword === "") delete filters.keyword
            //--------------------------------nd customized
            
            searchAllBooks({...filters});
        }, 500);
        return () => clearTimeout(timer);
    }, [filters])

    const searchAllBooks = (filters) => {
        bookService.getAll(filters).then((res) => {
            setbookRecords(res);
            // console.log(res) //to check the response
        })
    }
    //-------------------------------------------------nd search books

    
    //-------------------------------------------------st Delete book

    const onConfirmDelete = () => {
        bookService.deleteBook(selectId)
            .then((res) => {
                toast.success(messages.DELETE_SUCCESS , { theme: 'colored' })
                setOpen(false)
                setfilters({...filters, pageIndex: 1});
            }).catch((e) => {
                toast.error(messages.DELETE_FAIL , { theme: 'colored' })
            })
    }
    
    //-------------------------------------------------nd Delete book

    
    //--------------------------------------------------st static for heading
    const columns = [ 
        { id: "name", label: "Book Name", minWidth: 100 },
        { id: "price", label: "Price", minWidth: 100 },
        { id: "category", label: "Category", minWidth: 100 },
    ];
    //--------------------------------------------------nd static for heading

//-----------------------------------------------------------------------------------


    return(
        <>
            <div className="book-container-center">
                <h1 
                    className="ff-r txt-41"
                > 
                    Book Page 
                </h1>
                
                <hr />
            </div>

            <div className="book-container-main">
                <div className="book-search-product">
                    <div className="book-search-bar">
                        <TextField 
                            id="text" 
                            placeholder='Search...' 
                            variant="outlined" 
                            name="text"
                            onChange={(e) => {
                                setfilters({
                                    ...filters, 
                                    keyword:e.target.value, 
                                    pageIndex: 1
                                })
                            }}
                        />
                    </div>
                    <div className="book-add-btn">
                        <Button
                            variant="contained"
                            className="bg-f14d54"
                            onClick={() => navigate("/add-book")}
                        >
                            <span className="book-add-btn-txt"> Add </span>
                        </Button>
                    </div>
                </div>

                <div className="book-container-table">
                    <TableContainer 
                        // component={Paper} 
                        className="book-table-container"
                    >
                        <Table 
                            // sx={{ minWidth: 650 }} 
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>

                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{minWidth: column.minWidth}}
                                        >
                                            <Typography variant="h6">
                                                <b> {column.label} </b> 
                                            </Typography>
                                        </TableCell>
                                    ))}

                                    <TableCell> {/* Empty for Button Heading*/} </TableCell>

                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {bookRecords?.items?.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell> {row.name} </TableCell>
                                        <TableCell> {row.price} </TableCell>
                                        <TableCell>
                                            {categories.find((c) => c.id === row.categoryId)?.name}
                                        </TableCell>

                                        <TableCell align="right">
                                            
                                            <div className="book-edit-delete-btn">
                                                <div className="book-edit-btn">
                                                    <Button 
                                                        variant="outlined"
                                                        className="c-80bf32 bo-80bf32"
                                                        onClick={() => {
                                                            navigate(`/edit-book/${row.id}`)
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>                          
                                                </div> 

                                                <div className="book-delete-btn">               
                                                    <Button 
                                                        variant="outlined"
                                                        className="delete-btn-color delete-btn-border"
                                                        onClick={() => {
                                                            setOpen(true);
                                                            setSelectId(row.id ?? 0);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        
                                        </TableCell>
                                    </TableRow>
                                ))}
                                 {/* if no books availabel */}
                                {!bookRecords.items.length && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography align="center">
                                                No Books
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                
                <div className="book-pagination">
                    <TablePagination 
                        rowsPerPageOptions = {RecordsPerPage}
                            // Option howmany records on page => array
                        count = {bookRecords.totalItems}
                            // how many records are there
                        rowsPerPage = {filters.pageSize || 0}
                            // how many row(accordint to first opt.)
                        page = {filters.pageIndex - 1}
                            // current page
                        onPageChange = {(e, newPage) => {
                            // event when page changes
                            setfilters({
                                ...filters, 
                                pageIndex: newPage + 1 
                            });
                        }}
                        onRowsPerPageChange = {(e) => {
                            // event when no. row on page changes.
                            setfilters({
                                ...filters,
                                pageIndex: 1,
                                pageSize: Number(e.target.value),
                            });
                        }}
                    />
                </div>
                <ConfirmDialog
                    open = {open}
                    onClose = {() => setOpen(false)}
                    onConfirm = {() => onConfirmDelete()}
                    title = "Delete book"
                    description = "Are you sure you want to delete this book?"
                />
            </div>
        </>
    );
}

export default Book;