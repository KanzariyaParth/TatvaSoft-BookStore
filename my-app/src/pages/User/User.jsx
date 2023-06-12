import React, { useEffect, useState } from 'react';
import './User.css';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userService from '../../service/user.service';
import ConfirmDialog from '../../components/dialogBox/confirmDialog';
import { RecordsPerPage, defaultFilter } from '../../constant/constant';
import { messages } from '../../utils/shared';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


const User = () => {
    //-----------------------------------------------------------------------------------

    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate();

    //------------------------------------------------------------st getAllUser

    const [filters, setFilters] = useState(defaultFilter);
    const [userList, setUserList] = useState({
        pageIndex: 0,
        pageSize: 0,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            getAllusers({...filters})
        }, 500)
        return () => clearTimeout(timer)
    }, [filters])

    const getAllusers = async (filters) => {
        await userService.getAllUsers(filters).then((res) => {
            if (res) {
                setUserList(res)
            }
        })
    }

    //------------------------------------------------------------nd getAllUser

    
    //------------------------------------------------------------st for delete

        const [open, setOpen] = useState(false);
        const [selectedId, setSelectedId] = useState(0);

        const onConfirmDelete = async () => {
            await userService
            .deleteUser(selectedId)
                .then((res) => {
                    if (res) {
                        toast.success(messages.DELETE_SUCCESS , { theme: 'colored' })
                        setOpen(false);
                        setFilters({...filters})
                    }
                }).catch((e) => {
                    toast.error(messages.DELETE_FAIL , { theme: 'colored' })
                })        
        }
    
    //------------------------------------------------------------st for delete


    //------------------------------------------static for heading
    const columns = [
        { id: "firstName", label: "First Name", minWidth: 100 },
        { id: "lastName", label: "Last Name", minWidth: 100 },
        {
          id: "email",
          label: "Email",
          minWidth: 170,
        },
        {
          id: "roleName",
          label: "Role",
          minWidth: 130,
        },
      ];

    //-----------------------------------------------------------------------------------

    return (
    <>
        <div className="u-container-center">
            <h1 
                className="ff-r txt-41"
            > 
                User 
            </h1>
            
            <hr />
        </div>

        <div className="u-container-main">
            <div className="u-search-user">
                <div className="u-search-bar">
                    <TextField 
                        id="text" 
                        placeholder='Search...' 
                        variant="outlined" 
                        name="text"
                        onChange={(e) => 
                            setFilters({
                                ...filters, 
                                keyword: e.target.value, 
                                pageIndex: 1
                            })
                        }
                    />
                </div>
            </div>

            <div className="u-container-table">
                <TableContainer 
                    className="u-table-container"
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
                                        <Typography variant="h6" className='txt-fw-600'>
                                            {column.label}
                                        </Typography>
                                    </TableCell>
                                ))}

                                <TableCell> {/* Empty for Button Heading*/} </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {userList?.items?.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell> {row.firstName} </TableCell>
                                    <TableCell> {row.lastName} </TableCell>
                                    <TableCell> {row.email} </TableCell>
                                    <TableCell> {row.role} </TableCell>
                                    <TableCell align="right">
                                        
                                        <div className="u-edit-delete-btn">
                                            <div className="u-edit-btn">
                                                <Button 
                                                    variant="outlined"
                                                    className="c-80bf32 bo-80bf32"
                                                    onClick={() => {
                                                        navigate(`/edit-user/${row.id}`)
                                                    }}
                                                >
                                                    Edit
                                                </Button>                          
                                            </div> 

                                            {row.id !== user.id && <div className="u-delete-btn">               
                                                <Button 
                                                    variant="outlined"
                                                    className="delete-btn-color delete-btn-border"
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setSelectedId(row.id ?? 0);
                                                    }}

                                                >
                                                    Delete
                                                </Button>
                                            </div>}
                                        </div>
                                    
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            {/* if no us availabel */}
                            {!userList.items.length && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography align="center">
                                            No Users
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="u-pagination">
                <TablePagination
                    rowsPerPageOptions = {RecordsPerPage}
                        // Option howmany records on page => array
                    count = {userList.totalItems}
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
                title = "Delete user"
                description = {messages.USER_DELETE}
            />
        </div>
    </>
  )
}

export default User
