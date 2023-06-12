import React, { useState } from 'react';
import './UpdateProfile.css';
import { useFormik } from 'formik';
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import userService from '../../service/user.service';
import { toast } from 'react-toastify';
import { messages } from '../../utils/shared';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../State/Slice/authSlice';


const UpdateProfile = () => {
//------------------------------------------------------------------------------------

    const navigate = useNavigate();
    const dispach = useDispatch();


    const isSubset = (superObj, subObj) => {
        return Object.keys(subObj).every((ele) => {
            return subObj[ele] === superObj[ele]
        });
    };

    //---------------------------------------------------------------------------st onSubmit

    const onSubmit = async (values) => {
        const password = values.newPassword ? values.newPassword : user.password;
        delete values.confirmPassword;
        delete values.newPassword;
        // const data = Object.assign(user, { ...values, password});
        const data = {...user, ...values, password}

        if (isSubset(user, data)) {
            toast.info("Change something to update Profile", {theme: 'colored'})
            return
        }

        const res = await userService.updateProfile(data);
        if (res) {
            dispach(setUser(res));
            toast.success(messages.UPDATED_SUCCESS, { theme: 'colored' });
            navigate('/');
        }
    };

    //---------------------------------------------------------------------------nd onSubmit


    //------------------------------------------------------------st Validation

    const  [updatePassword, setupdatePassword] = useState(false);
    const user = useSelector((state) => state.auth.user) //=================================
    const initialValues = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        newPassword: '',
        confirmPassword: '',
    }


    const updateProfileSchema = Yup.object().shape(
        {
          email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
          firstName: Yup.string()
            .required("First Name is required"),
          lastName: Yup.string()
            .required("Last Name is required"),
          newPassword: Yup.string()
            .min(5, "Minimum 5 charactor is required"),
          confirmPassword: 
          updatePassword ? Yup.string()
                .required("Must required")
                .oneOf([Yup.ref("newPassword")], "Passwords is not match")
            : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
        }
    )

    const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik(
        {
            initialValues: initialValues,
            validationSchema: updateProfileSchema,
            onSubmit: onSubmit,
        }
    );

    //------------------------------------------------------------nd Validation


    //------------------------------------------------------------st newPassword

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);  
    const handleMouseDownPassword = (event) => {
          event.preventDefault();
    };

    //------------------------------------------------------------nd newPassword


//------------------------------------------------------------------------------------
    
    return (
        <>

        <div className="update-profile-container-center">
            <h1 
                className="ff-r txt-41"
            > 
                Update Profile
            </h1>
            
            <hr />
        </div>

        <div className="update-profile-container-main">
            
            <div className="update-profile-frm-container">
                
                <form onSubmit={ handleSubmit } >
                    
                    <div className="update-profile-2in1">
                        <div className="update-profile-err-container">
                            
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
                                {<p className="update-profile-err-msg"> { touched.firstName && errors.firstName} </p>}
                            </div>
                        
                        </div>

                        <div className="update-profile-err-container">
                
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
                                {<p className="update-profile-err-msg"> {touched.lastName && errors.lastName} </p>}
                            </div>
                        
                        </div>
                    </div>

                    <div className="update-profile-2in1">
                        <div className="update-profile-err-container">

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
                                {<p className="update-profile-err-msg"> {touched.email && errors.email} </p>}
                            </div>

                        </div>

                        <div className="update-profile-err-container">
                            
                            <div>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">

                                    <InputLabel htmlFor="standard-adornment-password">
                                        New Password
                                    </InputLabel>
                                    
                                    <Input
                                        id="standard-adornment-password"
                                        type={showPassword ? 'text' : 'password'}

                                        name='newPassword'
                                        values={ values.newPassword } 
                                        onChange={(e) => {
                                            e.target.value !== ""
                                              ? setupdatePassword(true)
                                              : setupdatePassword(false);
                                            handleChange(e);
                                          }}
                                        onBlur={ handleBlur }

                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />

                                </FormControl>
                            </div>
                            <div>
                                {<p className="update-profile-err-msg"> {touched.newPassword && errors.newPassword} </p>}
                            </div>

                        </div>
                    </div>

                    {/* because its alone in 2 in 1 */}
                    <div className="update-profile-2in1">
                        <div className="update-profile-err-container">
                            <div>
                                <TextField 
                                    id="standard-basic" 
                                    type='password' 
                                    label="Confirm Password*" 
                                    variant="standard" 

                                    name="confirmPassword"
                                    values={ values.confirmPassword } 
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                /> 
                            </div>
                            <div>
                                {<p className="update-profile-err-msg"> { touched.confirmPassword && errors.confirmPassword } </p>}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <Button
                            type='submit'
                            variant='contained'
                            style={{ marginTop: '60px', width: '9%' }}
                            className='uni-save-btn'
                        >
                            Save
                        </Button>
                
                        <Button 
                            variant='contained'
                            style={{ marginLeft: '20px', marginTop: '60px', width: '9%' }}
                            className='uni-delete-btn'
                            onClick={() => {
                                navigate('/');
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

export default UpdateProfile;