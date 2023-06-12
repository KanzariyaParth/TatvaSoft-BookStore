import React, { useEffect, useState } from 'react';
import './ediUser.css';
import { useFormik } from 'formik';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import userService from '../../../service/user.service';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { messages } from '../../../utils/shared';
import { editUserSchema } from '../../../schema';
import { useDispatch, useSelector } from 'react-redux';

const EditUser = () => {
//---------------------------------------------------------------------------

    const navigate = useNavigate();
    const loggedUser = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const [user, setUser] = useState();
    
    //-----------------------------------------------st getRoles
    
    const [roles, setRoles] = useState([]);

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
            setRoles(res);
        });
    };

    useEffect(() =>{
        getRoles();
    }, [])

    //-----------------------------------------------nd getRoles


    //-----------------------------------------------st setUser

    useEffect(() => {
        if(user && roles.length) {
            const roleId = roles.find((role) => role.name === user?.role)?.id;
            setInitialValueState({
                id: user.id,
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
                roleId,
                password: user.password,  // ----
            })
        }
    }, [user, roles]);

    //-----------------------------------------------nd setUser

    //-----------------------------------------------st getUserById

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getUserById();
        }
    }, [id]);

    const getUserById = () => {
        userService.getById(Number(id)).then((res) => {
            setUser(res)
        })
    }

    //-----------------------------------------------nd getUserById


    //-----------------------------------------------st Submit(save-btn)

    const onSubmit = (values) => {
        const updatedValue = {
            ...values,
            role: roles.find((r) => r.id === values.roleId).name
        };
        userService
            .update(updatedValue)
            .then((res) => {
                if (res) {
                    dispatch(setUser(updatedValue))
                    toast.success(messages.UPDATED_SUCCESS, { theme: 'colored' } )
                    navigate('/user')
                }
            }).catch((e) => {
                toast.error(messages.UPDATED_FAIL, { theme: 'colored' } )
            })
    };

    //-----------------------------------------------nd Submit(save-btn)

    //-----------------------------------------------st validation
    const initialValue = {
        firstName: '',
        lastName: '',
        email: '',
        roleId: 3,
    }
    const [initialValueState, setInitialValueState] = useState(initialValue);

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValueState,
        enableReinitialize: true,
        validationSchema: editUserSchema,
        onSubmit: onSubmit,
    })
    //-----------------------------------------------nd validation

//---------------------------------------------------------------------------

  return (
    <>
        <div className="edit-u-container-center">
            <h1 
                className="ff-r txt-41"
            > 
                Edit User
            </h1>
            
            <hr />
        </div>

        <div className="edit-u-container-main">

        <div className="edit-u-frm-container">

            <form onSubmit={ handleSubmit }>

                <div className='edit-u-2in1-0'>
                    <div className="edit-u-2in1-x-err">
                        <div>
                            <TextField
                                id="standard-basic" 
                                className="edit-u-1of2-0" 
                                label="First name*" 
                                variant="standard"

                                name="firstName" 
                                value={ values.firstName }
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                            />
                        </div>
                        <div>
                            {<p className="edit-u-err-msg"> {/*errors.firstName &&*/ touched.firstName && errors.firstName} </p>}
                        </div>
                    </div>

                    <div className="edit-u-2in1-x-err">
                        <div>
                            <TextField 
                                id="standard-basic" 
                                className='edit-u-2of2-0' 
                                label="Last name*" 
                                variant="standard" 

                                name='lastName'
                                value={ values.lastName }
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                            /> 
                        </div>
                        <div>
                            {<p className="edit-u-err-msg"> {/*errors.lastName &&*/touched.lastName && errors.lastName} </p>}
                        </div>
                    </div>
                </div>

                <div className="edit-u-2in1-1">
                    <div className="edit-u-2in1-x-err">
                        <div>
                            <TextField 
                                id="standard-basic"  
                                className="edit-u-1of2-1"
                                label="Email*"
                                variant="standard"

                                name="email" 
                                value={ values.email }
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                            />
                        </div>
                        <div>
                            {<p className="edit-u-err-msg"> {touched.email && errors.email} </p>}
                        </div>
                    </div>
                    <div className="edit-u-2in1-x-err">
                        {values.id !== loggedUser.id &&
                            <div>
                                <FormControl
                                    variant="standard"  
                                    className="edit-u-2of2-1" sx={{ m: 1, minWidth: 120 }}
                                >
                                    <InputLabel htmlFor='roleId'> 
                                        Role*
                                    </InputLabel>

                                    <Select  /* st */
                                        name="roleId"
                                        id='roleId'
                                        // label={RoleId}
                                        onChange={ handleChange }
                                        onBlur={ handleBlur } 
                                        value={ values.roleId }
                                    >   
                                        {roles.length > 0 && roles.map((role) => (
                                            <MenuItem 
                                                value={role.id} 
                                                key = {"name" + role.id}
                                            >
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        }
                        <div>
                            {<p className="edit-u-err-msg"> {/*errors.roleId*/ touched.roleId && errors.roleId} </p>}
                        </div>
                    </div>
                </div>

                <div className="edit-u-submit-btn">
                    <Button 
                        type='submit'
                        variant='contained'
                        style={{ marginLeft: '20px', marginTop: '20px', width: '9%' }}
                        className='uni-save-btn edit-custom-save'
                    >
                        Save
                    </Button>
              
                    <Button 
                        variant='contained'
                        style={{ marginLeft: '20px', marginTop: '20px', width: '9%' }}
                        className='uni-delete-btn edit-custom-delete'
                        onClick={() => {
                            navigate('/user');
                        }}
                    >
                        cancel
                    </Button>
                </div>

            </form>

            </div>
        </div>
    </>
  )
}

export default EditUser
