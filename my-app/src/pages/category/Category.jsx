import React, { useEffect, useState } from 'react';
import './Category.css';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RecordsPerPage, defaultFilter } from '../../constant/constant';
import ConfirmDialog from '../../components/dialogBox/confirmDialog';
import categoryService from '../../service/catagory.service';
import { toast } from 'react-toastify';
import { messages } from '../../utils/shared';

const Category = () => {

//--------------------------------------------------------------------------------

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectId] = useState(0);

    const [filters, setFilters] = useState(defaultFilter);
    const [categoryRecords, setCategoryRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    })
    
    //-------------------------------------------------------st searchAllCategories

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            searchAllCategories({...filters});
        }, 500)
        return () => clearTimeout(timer)
    }, [filters])

    const searchAllCategories = (filters) => {
        categoryService.getAll(filters).then((res) => {
            
            console.log(setCategoryRecords(res));
            console.log(categoryRecords)
        })
    }

    //-------------------------------------------------------nd searchAllCategories


    //-------------------------------------------------------st onConfirmDelete

    const onConfirmDelete = () => {
        categoryService
        .deleteCategory(selectedId)
        .then((res) => {
            toast.success(messages.DELETE_SUCCESS, { theme:'colored' })
            setOpen(false);
            setFilters({ ...filters });
        }).catch((e) => {
            toast.error(messages.DELETE_FAIL, { theme: 'colored' })
        });
    };

    //-------------------------------------------------------nd onConfirmDelete


    //---------------------------------------------------static for heading
    const columns = [{ 
        id: "name", 
        label: "Category Name", 
        minWidth: 100 
    }];

//--------------------------------------------------------------------------------

    return (
        <>

        <div className="category-container-center">
            <h1 
                className="ff-r txt-41"
            > 
                Category
            </h1>
            
            <hr />
        </div>

        <div className="category-container-main">

            <div className="category-search-product">
                <div className="category-search-bar">
                    <TextField 
                        id="text" 
                        placeholder='Search...' 
                        variant="outlined" 
                        name="text"
                        onChange={(e) => {
                            setFilters({
                                ...filters, 
                                keyword:e.target.value, 
                                pageIndex: 1
                            })
                        }}
                    />
                </div>
                <div className="category-add-btn">
                    <Button
                        variant="contained"
                        className="bg-f14d54"
                        onClick={() => navigate("/add-category")}
                    >
                        <span className="category-add-btn-txt"> Add </span>
                    </Button>
                </div>
            </div>


            <div className="category-container-table">
                    <TableContainer
                        className="category-table-container"
                    >
                        <Table
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
                                {categoryRecords?.items?.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell> {row.name} </TableCell>
                                        <TableCell align="right">
                                            
                                            <div className="category-edit-delete-btn">
                                                <div className="category-edit-btn">
                                                    <Button 
                                                        variant="outlined"
                                                        className="c-80bf32 bo-80bf32"
                                                        onClick={() => {
                                                            navigate(`/edit-category/${row.id}`)
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>                          
                                                </div> 

                                                <div className="category-delete-btn">               
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
                                 {/* if no categories availabel */}

                                 {!categoryRecords?.items.length && (
                                    <TableRow className="TableRow">
                                    <TableCell colSpan={6} className="TableCell">
                                        <Typography align="center" className="noDataText">
                                        No Category
                                        </Typography>
                                    </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                
                <div className="category-pagination">
                    <TablePagination
                        rowsPerPageOptions = {RecordsPerPage}
                            // Option howmany records on page => array
                        count = {categoryRecords.totalItems}
                            // how many records are there
                        rowsPerPage = {filters.pageSize || 0}
                            // how many row(accordint to first opt.)
                        page = {filters.pageIndex - 1}
                            // current page
                        onPageChange = {(e, newPage) => {
                            // event when page changes
                            setFilters({
                                ...filters, 
                                pageIndex: newPage + 1 
                            });
                        }}
                        onRowsPerPageChange = {(e) => {
                            // event when no. row on page changes.
                            setFilters({
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
                    title = "Delete Category"
                    description = "Are you sure you want to delete this Category?"
                />

        </div>

        </>
    )
}

export default Category
